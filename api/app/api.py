import io
import json
import jwt
import requests
import hashlib
import numpy as np
from PIL import Image
from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, status, Security, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi_jwt import JwtAccessBearer, JwtAuthorizationCredentials
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.future import select
from sqlalchemy import Column, Integer, String, func
from .config import DB_HOST, DB_PASS, DB_NAME, DB_USER, DB_PORT
from sqlalchemy import MetaData, Table, Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timedelta, timezone

Base = declarative_base()

class Page(Base):
    __tablename__ = 'pages'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)

class KPI(Base):
    __tablename__ = 'kpi'
    
    id = Column(Integer, primary_key=True, index=True)
    page_id = Column(Integer, ForeignKey('pages.id'))
    url = Column(String)
    amount = Column(Integer, default=0)    
    duration = Column(Integer, default=0)

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)


class UserBase(BaseModel):
    email: str
    password: str

    class Config:
        orm_mode = True

class CreateUser(UserBase):
    class Config:
        orm_mode = True
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

SQLALCHEMY_DATABASE_URL = f"postgresql+asyncpg://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
engine = create_async_engine(SQLALCHEMY_DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, bind=engine, class_=AsyncSession)

# Функция для получения сессии БД
async def get_db():
    async with SessionLocal() as session:
        yield session

app = FastAPI()

origins = ["http://localhost:3000", "localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

metadata = MetaData()

roles_table = Table(
    'roles', metadata,
    Column('id', Integer, primary_key=True, index=True),
    Column('name', String, unique=True)
)

users_table = Table(
    'users', metadata,
    Column('id', Integer, primary_key=True, index=True),
    Column('email', String, unique=True, index=True),
    Column('password', String),
    Column('role_id', Integer, ForeignKey('roles.id'))
)

Role = relationship("Role", backref="users")
User = relationship("User", backref="roles")

def hash_password(password: str) -> str:
    return hashlib.md5(password.encode()).hexdigest()

access_security = JwtAccessBearer(secret_key="very_secret_key")
SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@app.post("/register", response_model=Token)
async def register(user: CreateUser, db: AsyncSession = Depends(get_db)):
    hashed_password = hash_password(user.password)
    default_role = await db.execute(select(roles_table).where(roles_table.c.name == "user"))
    role = default_role.scalars().first()

    if not role:
        raise HTTPException(status_code=400, detail="Default user role not found")

    db_user = {
        "email": user.email,
        "password": hashed_password,
        "role_id": role
    }
    await db.execute(users_table.insert().values(db_user))
    await db.commit()

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"login": user.email, "role": 'user'}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")

async def login_user(user: UserBase, db: AsyncSession = Depends(get_db)) -> Token:
    hashed_password = hash_password(user.password)
    stmt = select(users_table).where(users_table.c.email == user.email, users_table.c.password == hashed_password)
    result = await db.execute(stmt)
    user_in_db = result.fetchone()

    if user_in_db is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    role = 'admin'
    if user_in_db.role_id==2:
        role = 'user'
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"login": user_in_db.email, "role": role},
        expires_delta=access_token_expires
    )

    return Token(access_token=access_token, token_type="bearer")

@app.post("/login", response_model=Token)
async def login(user: UserBase, db: AsyncSession = Depends(get_db)):
    token_data = await login_user(user, db)
    return token_data

@app.post("/roles")
async def create_role(role_name: str, db: AsyncSession = Depends(get_db)):
    new_role = {"name": role_name}
    await db.execute(roles_table.insert().values(new_role))
    await db.commit()
    return new_role

@app.get("/roles")
async def get_roles(db: AsyncSession = Depends(get_db)):
    roles = await db.execute(select(roles_table))    
    return roles.fetchall()

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("login")
        if email is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")
        return email
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_current_user(authorization: str = Header(None)):
    if authorization is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    token = authorization.split(" ")[1]
    email = verify_token(token)
    return email

@app.get("/protected")
async def protected_endpoint(current_user: str = Depends(get_current_user)):
    return {"message": f"Hello, {current_user}!"}

@app.get("/posts")
async def get_posts():
    res = requests.get('https://jsonplaceholder.typicode.com/posts')
    return res.json()

@app.post("/invert")
async def invert_image(file: UploadFile = File(...), current_user: str = Depends(get_current_user)):
    image = Image.open(io.BytesIO(await file.read()))
    np_image = np.asarray(image)
    np_image = 255 - np_image[:, :, :3]
    inverted_image = Image.fromarray(np_image)
    
    img_byte_arr = io.BytesIO()
    inverted_image.save(img_byte_arr, format='PNG')
    img_byte_arr.seek(0)
    
    return StreamingResponse(content=img_byte_arr, media_type="image/png")

@app.post("/pages")
async def create_page(page_name: str, db: AsyncSession = Depends(get_db), current_user: str = Depends(get_current_user)):
    new_page = Page(name=page_name)
    db.add(new_page)
    await db.commit()
    await db.refresh(new_page)
    return new_page

@app.get("/pages/{page_id}")
async def read_page(page_id: int, db: AsyncSession = Depends(get_db), current_user: str = Depends(get_current_user)):
    stmt = select(Page).where(Page.id == page_id)
    result = await db.execute(stmt)
    page = result.scalars().first()
    
    if page is None:
        raise HTTPException(status_code=404, detail="Page not found")
    
    return page

@app.post("/send_kpi")
async def send_kpi(data: dict, db: AsyncSession = Depends(get_db), current_user: str = Depends(get_current_user)):
    stmt = select(KPI).where(KPI.page_id == data['page_id'])
    result = await db.execute(stmt)
    kpi_entry = result.scalars().first()
    
    if kpi_entry is None:
        new_kpi = KPI(page_id=data['page_id'], url=data['url'], amount=data['amount'], duration=data['time'])
        db.add(new_kpi)
    else:
        print()
        kpi_entry.amount += 1
        kpi_entry.duration += data['time']
    
    await db.commit()
    return {"detail": "KPI updated successfully"}

@app.get("/kpi")
async def get_kpi(db: AsyncSession = Depends(get_db), current_user: str = Depends(get_current_user)): 
    stmt = select(KPI)
    result = await db.execute(stmt)
    kpi_entries = result.scalars().all()
    
    if not kpi_entries:
        raise HTTPException(status_code=404, detail="No KPI data found")
    return [{"url": entry.url, "amount": entry.amount, "duration": entry.duration} for entry in kpi_entries]