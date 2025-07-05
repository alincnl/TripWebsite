import '../styles.css';
import React, { useState , useEffect}  from "react"
import { useNavigate } from 'react-router-dom';

export default function StatisticPanel() {
    const [kpi, setKpi] = useState([]);
    const navigate = useNavigate(); 

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }
    }, []);

    useEffect(() => {
      const fetchKpiData = async () => {
          try {
            const token = localStorage.getItem("token");console.log("Текущий токен:", token); 
              const response = await fetch('http://localhost:8000/kpi', {
                  headers: {
                      "Authorization": `Bearer ${localStorage.getItem("token")}` 
                  }
              });

              if (response.status === 401) {
                  localStorage.removeItem("token");
                  navigate("/login"); 
              }

              const data = await response.json();
              setKpi(data);
          } catch (error) {
              console.error('Error fetching KPI data:', error);
          }
      };

      fetchKpiData();
    }, []);
    console.log("kpi",typeof(kpi), kpi);
  
    return (
      <div className="content">
        <h1>
          Туризм в НСО
        </h1>
  
        <div className="content-facts">
          <h2 title="#">
            Статистика посещения страниц
          </h2>
  
          <table className='statistic'>
            <thead>
              <tr>
                <th>Название страницы</th>
                <th>Количество посещений</th>
                <th>Общее проведенное время</th>
              </tr>
            </thead>
            <tbody>
              {kpi && kpi.map((row, index) => (
                <tr key={index}>
                  <td>{row.url}</td>
                  <td>{row.amount}</td>
                  <td>{row.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }



