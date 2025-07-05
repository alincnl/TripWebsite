import '../styles.css';
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

export default function MainPanel() {
    const [timeSpent, setTimeSpent] = useState(0);

    const navigate = useNavigate(); 

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login"); 
        }
    }, []);

    useEffect(() => {
        const startTime = Date.now();
        const token = localStorage.getItem("token");


        return () => {
            const lastTime = Date.now();
            const spentTime = Math.floor((lastTime - startTime) / 1000);
            
            const requestOptions = {
                method: 'POST',
                headers: { "Authorization": `Bearer ${token}` , 'Content-Type': 'application/json' },
                body: JSON.stringify({ page_id: 2, time: spentTime })
            };

            const sendKpiData = async () => {
                try {
                    const response = await fetch('http://localhost:8000/send_kpi', requestOptions);
                    
                    if (response.status === 401) {
                        localStorage.removeItem("token");
                        navigate("/login");
                    }

                    const data = await response.json();
                } catch (error) {
                    console.error(error);
                }
            };

            sendKpiData();
        };
    }, []); 

    return (
        <div class="content">
            <h1>
                Туризм в НСО
            </h1>
            
            <div class="content-reasons">
                <h2 title="#">
                    Причины побывать в Новосибирске
                </h2>
        
                <ul>
                    <li>
                        Своими глазами увидеть самый быстрорастущий город-миллионер в мире
                    </li>
                    <li>
                        Прокатиться по самому длинному в мире метромосту
                    </li>
                    <li>
                        Насладиться балетом или оперой в самом большом театральном здании России
                    </li>
                    <li>
                        Прогуляться по самой умной улице мира
                    </li>
                    <li>
                        Сделать селфи на фоне Бугринского моста
                    </li>

                </ul>
            </div>
        </div>
    )
}
