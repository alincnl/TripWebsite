import '../styles.css';
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

export default function InverterPanel() {
    const [file, setImg] = useState(null);
    const [invertImg, setInvert] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login"); 
        }
    }, []);

    const handleChange = async (event) => {
        setImg(URL.createObjectURL(event.target.files[0]));
        const formData = new FormData();
        formData.append('file', event.target.files[0]);
        const token = localStorage.getItem("token");

        
        const response = await fetch('http://localhost:8000/invert', {
            method: 'POST',
            body: formData,
            headers: {
                "Authorization": `Bearer ${token}` 
            }
        });

        if (response.status === 401) {
            localStorage.removeItem("token");
            navigate("/login"); 
        }

        const data = await response.blob();
        setInvert(URL.createObjectURL(data));
    }

    return (
        <div className="content">
            <h1>
                Туризм в НСО
            </h1>
            
            <div className="content-slider">
                <h2 title="#">
                    Инвертирование изображений
                </h2>
                
                <form>
                    <input type="file" onChange={handleChange}/>
                </form>

                <div className="content-invert">
                    <div>
                        <h3>Оригинал</h3>
                        {file && <img src={file} alt="Оригинал" />}
                    </div>
                    
                    <div>
                        <h3>Инвертированное фото</h3>
                        {invertImg && <img src={invertImg} alt="Инвертированное" />}
                    </div>
                </div>
            </div>
        </div>
    );
}
