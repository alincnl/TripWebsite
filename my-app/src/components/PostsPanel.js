import '../styles.css';
import React, { useState , useEffect}  from "react"
import RangeSlider from 'react-bootstrap-range-slider';
import PostsList from './Posts';
import { useNavigate } from 'react-router-dom';

export default function PostsPanel() {
    const [ value, setValue ] = useState(0); 
    const [posts, setPosts] = useState(null)

    const navigate = useNavigate(); 

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await fetch('http://localhost:8000/posts', {
                    headers: {
                        "Authorization": `Bearer ${token}` 
                    }
                });

                if (response.status === 401) {
                    localStorage.removeItem("token"); 
                    navigate("/login"); 
                }

                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.error('Ошибка при получении постов:', error);
            }
        };

        fetchPosts();
    }, []);


    console.log(posts);
    return (
        <div class="content">
            <h1>
                Туризм в НСО
            </h1>
            
            <div class="content-slider">

                <h2 title="#">
                    Посты
                </h2>
                
                <p>Количество постов: {value} </p>
                <RangeSlider
                    value={value}
                    max = {(posts || []).length===0? 0 : posts.length}
                    onChange={changeEvent => setValue(changeEvent.target.value)}
                />
                {posts && <PostsList posts={posts.slice(0,value)} />}
            </div>
        </div>
    )
}
