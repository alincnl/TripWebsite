import '../styles.css';
import React from "react"
import { Link } from 'react-router-dom';

export default function SideBar({ setPage, activeComponent, userRole }) {

    return (
        <div className="sidebar">
            <Link to="/" onClick={() => setPage('intro')}>
                <button className={`sidebar_button sidebar_button-intro ${activeComponent === 'intro' ? 'active' : ''}`}>
                    ФАКТЫ
                </button>
            </Link>

            <Link to="/main" onClick={() => setPage('main')}>
                <button className={`sidebar_button sidebar_button-descr ${activeComponent === 'main' ? 'active' : ''}`}>
                    ПРИЧИНЫ
                </button>
            </Link>

            <Link to="/posts" onClick={() => setPage('posts')}>
                <button className={`sidebar_button sidebar_button-posts ${activeComponent === 'posts' ? 'active' : ''}`}>
                    ПОСТЫ
                </button>
            </Link>

            <Link to="/invert" onClick={() => setPage('invert')}>
                <button className={`sidebar_button sidebar_button-invert ${activeComponent === 'invert' ? 'active' : ''}`}>
                    ФОТО
                </button>
            </Link>

            <Link to="/conclusion" onClick={() => setPage('conclusion')}>
                <button className={`sidebar_button sidebar_button-conclusion ${activeComponent === 'conclusion' ? 'active' : ''}`}>
                    КОНТАКТЫ
                </button>
            </Link>

            {userRole === 'admin' && (
                <>
                    <Link to="/api" onClick={() => setPage('api')}>
                        <button className={`sidebar_button sidebar_button-api ${activeComponent === 'api' ? 'active' : ''}`}>
                            API
                        </button>
                    </Link>

                    <Link to="/statistic" onClick={() => setPage('statistic')}>
                        <button className={`sidebar_button sidebar_button-statistic ${activeComponent === 'statistic' ? 'active' : ''}`}>
                            СТАТИСТИКА
                        </button>
                    </Link>
                </>
            )}
        </div>
    );}