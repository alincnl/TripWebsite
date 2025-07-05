from datetime import datetime
from sqlalchemy import MetaData, Table, Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

metadata = MetaData()

pages = Table(
    "pages",
    metadata,
    Column("id", Integer, autoincrement=True,  nullable=False,primary_key=True),
    Column("name", String, nullable=False),
)

kpi = Table(
    "kpi",
    metadata,
    Column("id", Integer,  nullable=False,autoincrement=True,primary_key=True),
    Column("page_id", Integer, ForeignKey("pages.id")),
    Column("url", String,  nullable=False),
    Column("amount", Integer,  nullable=False),
    Column("duration", Integer,  nullable=False),
)

roles = Table(
    "roles",
    metadata,
    Column("id", Integer, autoincrement=True,  nullable=False,primary_key=True),
    Column("name", String, unique=True),
)

users = Table(
    "users",
    metadata,
    Column("id", Integer, autoincrement=True,  nullable=False,primary_key=True),
    Column("email", String, nullable=False),
    Column("password", String, nullable=False),
    Column("role_id", Integer, ForeignKey("roles.id")),
)

Role = relationship("Role", backref="users")
User = relationship("User", backref="roles")
