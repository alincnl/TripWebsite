import '../styles.css';
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

export default function IntroPanel() {
    const navigate = useNavigate(); 

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login"); 
        }
    }, []);

    useEffect(() => {
        const startTime = Date.now();

        return () => {
            const lastTime = Date.now();
            const spentTime = Math.floor((lastTime - startTime) / 1000);
            
            const requestOptions = {
                method: 'POST',
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}`,
                'Content-Type': 'application/json' },
                body: JSON.stringify({ page_id: 2, time: spentTime })
            };

            const sendKpiData = async () => {
                try {
                    const response = await fetch('http://localhost:8000/send_kpi', requestOptions);
                    
                    if (response.status === 401) {
                        localStorage.removeItem("token");
                        localStorage.removeItem("role");
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
            
            <div class="content-facts">

                <h2 title="#">
                    Географическая справка
                </h2>
                
                <p>
                    Новосибирск расположен в юго-восточной части Западно-Сибирской равнины, на обоих берегах реки Обь, на пересечении лесной и лесостепной природных зон.
                </p>

                <p>
                    <strong>Площадь</strong> Новосибирска: 506,67 кв.км (50 667 га) (12-е место в России).
                </p>

                <p>
                    <strong>Климат</strong> Новосибирска преимущественно континентальный, с резкими перепадами температур, как среднесуточных, так и сезонных. Это обусловлено географическим положением - город расположен в умеренных широтах, глубоко внутри материка, вдали от морей и океанов.
                </p>

                <p>
                    Для Новосибирска характерны четыре классических сезона: зима, весна, лето, осень.
                </p>

                <table>
                    <tbody>
                        <tr>
                            <td><strong>Зима</strong></td>
                            <td> Суровая и продолжительная (с середины ноября до середины-конца марта - 120-130 дней), с устойчивым снежным покровом, сильными ветрами и метелями.</td>
                        </tr>
                        <tr>
                            <td><strong>Весна</strong></td>
                            <td> Короткий переходный сезон (с середины-конца марта до конца мая - 70-75 дней), неустойчивая погода, весенние возвраты холодов, много солнечного света.</td>
                        </tr>
                        <tr>
                            <td><strong>Лето</strong></td>
                            <td> Тёплое и соответствует трем летним календарным месяцам. Летом увеличивается относительная влажность воздуха (в августе до 74 %), иногда лето бывает достаточно дождливым.</td>
                        </tr>
                        <tr>
                            <td><strong>Осень</strong></td>
                            <td> Короткий переходный сезон (с конца августа до середины ноября, 75-80 дней), с неустойчивой погодой, ранними осенними заморозками. </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
