import '../styles.css';
import React, { FormEvent, useState , useEffect}  from "react";
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

export default function RegisterPanel() {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); 

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/");
        }
    }, []);

    const handleSubmit = async (e) => { 
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: login,
                    password: password
                })
            });

            if (!response.ok) {
                throw new Error("Ошибка при входе: " + response.statusText);
            }
            const data = await response.json();
            const decodedToken = jwtDecode(data.access_token); 
            console.log(decodedToken);
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("role", decodedToken.role);
            window.location.reload();
        } catch (err) {
            console.log(err.message);
        }
    };

    return (
        <div class="content">
            <h1>
                Туризм в НСО
            </h1>
            
            <div class="content-slider">

                <h2 title="#">
                    Регистрация
                </h2>
                
                <form onSubmit={handleSubmit}>
                    <div className='forms'>
                        <label>Логин:  </label>
                        <input
                            type="text"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                        />
                    </div>
                    <div className='forms'>
                        <label>Пароль:  </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button className='sidebar_button1'type="submit">Войти</button>
                </form>
                <form  action="/login">
                    <button className='sidebar_button1'type="submit">Уже есть аккаунт?</button>
                </form>
            </div>
        </div>
    )
}
