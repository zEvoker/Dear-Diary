import './index.scss'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios.get('http://localhost:5555/diary')
        .then((response) => {
            setPages(response.data.data);
            setLoading(false);
        })
        .catch((error) => {
            console.log(error);
            setLoading(false);
        })
    }, []);

    return (
        <>
            <h1>Home</h1>
            <div className="pages">
                {pages.map((page,idx) => (
                    <div className="card">
                        {page.title}
                        <Link to={`diary/${page._id}`}>
                            go
                        </Link>
                    </div>
                ))}
            </div>
        </>
    )
}

export default Home;