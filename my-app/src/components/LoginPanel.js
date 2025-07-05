import '../styles.css';
import React, {useState } from "react";
import  { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

export default function LoginPanel() {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

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
            const response = await fetch("http://localhost:8000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: login,
                    password: password
                })
            });

            const data = await response.json();
            
            const decodedToken = jwtDecode(data.access_token); 
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("role", decodedToken.role);
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="content">
            <h1>
                Туризм в НСО
            </h1>
            
            <div className="content-slider">
                <h2 title="#">
                    Авторизация
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
                <form  action="/register">
                        <button className='sidebar_button1'type="submit">Еще нет аккаунта?</button>
                </form>
            </div>
        </div>
    );
}
