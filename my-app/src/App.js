import './styles.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SideBar from './components/SideBar';
import ApiPanel from './components/ApiPanel';
import MainPanel from './components/MainPanel';
import IntroPanel from './components/IntroPanel';
import PostsPanel from './components/PostsPanel';
import InverterPanel from './components/InverterPanel';
import ConclusionPanel from './components/ConclusionPanel';
import StatisticPanel from './components/StatisticPanel';
import LoginPanel from './components/LoginPanel';
import RegisterPanel from './components/RegisterPanel';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // состояние для проверки авторизации
  const [activeComponent, setPage] = useState('intro');

  return (
    <Router>
      <div class="body">
        <SideBar setPage={setPage} activeComponent={activeComponent} userRole={localStorage.getItem("role")}/>
        
        <Routes>
          <Route path="/login" element={<LoginPanel/>} />
          <Route path="/register" element={<RegisterPanel/>} />
          <Route path="/" element={<IntroPanel/>} />
          <Route path="/main" element={<MainPanel/>} />
          <Route path="/posts" element={<PostsPanel/>} />
          <Route path="/invert" element={<InverterPanel/>} />
          <Route path="/conclusion" element={<ConclusionPanel />} />
          <Route path="/api" element={<ApiPanel />} />
          <Route path="/statistic" element={<StatisticPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
