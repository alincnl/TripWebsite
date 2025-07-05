import React, { useState, useEffect } from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { useNavigate } from 'react-router-dom';

export default function ApiPanel() {
    const [jsonSpecification, setJsonSpecification] = useState(null);

    const navigate = useNavigate(); 

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
        }
    }, [navigate]);
    
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
    
    useEffect(() => {
        fetch('http://127.0.0.1:8000/openapi.json')
            .then(res => res.json())
            .then(data => {
                setJsonSpecification(data);
            })
            .catch(err => {
                console.error("Error fetching OpenAPI specification:", err);
            });
    }, []);

    return (
        <div className="content">
            <h1>API Documentation</h1>
            {jsonSpecification ? (
                <SwaggerUI spec={jsonSpecification} />
            ) : (
                <p>Loading API documentation...</p>
            )}
        </div>
    );
}