import '../styles.css';
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

export default function ConclusionPanel() {

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
            <div class="content-places">
                <div class="content-places-text">
                    <div class="text_wheretogo">
                        <h2 id="text_wheretogo">
                            Куда сходить в разные времена года
                        </h2>

                        <p>Летом в Новосибирской области можно съездить на Бердские скалы, Караканский бор или Абрашинский карьер, отдохнуть на пляжах Оби или Обского моря, провести время активно в походах, велотрипах, джип-турах или на сплавах. Интересные места Новосибирска для прогулок не оставят вас равнодушными.

                        <br /> <br />Осенняя пора — это открытие культурного сезона в Сибири. Что же посетить в Новосибирске в это время? Театральные премьеры, открытия новых выставок и концертных программ, организованные экскурсии, в том числе и по вузам региона, фестивали и другие события культуры ждут гостей со всего мира в Новосибирской области.

                        <br /><br />Снежное время в Новосибирской области — самая горячая пора! Ледовый городок на Михайловской набережной, Кубок Сибири по сноукайтингу и зимнему виндсерфингу, фестиваль Иглу, катание на собачьих упряжках и многие другие места в Новосибирске, которые стоит посетить.

                        <br /><br />Весна - отличное время года, чтобы поправить здоровье в санаторно-курортных комплексах с собственными природными факторами, посетить самый большой крытый аквапарк, уникальный термальный комплекс «Термы Мира» или любимую русскую баньку, а после насладиться новоСибирской кухней от лучших поваров в ресторанах города. </p>
                    </div>
                    
                    <div class="text_contacts">
                        <h2 title="#">
                            Контакты
                        </h2>

                        <p id="contacts">
                            В самом туристическом месте Новосибирска – на площади Ленина – работает туристско-информационный центр.

                            <br /> <br /> Что посмотреть в Новосибирске за день? В каком музее лежит меч каролингов? Где погулять с другом из Читы? Как попасть на экскурсию в Сузун? А какой фестиваль будет завтра? И это далеко не все вопросы, на которые вам помогут ответить. <br/>

                            <br /> Туристско-информационный центр (визит-центр) находится на площади Ленина сбоку от Первомайского сквера. Ориентир: Ленина, 25, ресторанный дворик за гостиницей «Центральная». Выход из метро к зданию Краеведческого музея или к улице Ленина. <br/>
                        </p>
                    </div>
                </div>

                <img src="map.png" alt="Карта визит-центра"/>
            </div>
        </div>
    )
}
