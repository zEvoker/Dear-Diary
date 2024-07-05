import './index.scss'
import axios from 'axios';
import { useEffect, useState } from 'react';
import Card from '../../components/Card';

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
                    <Card key={idx} title={page.title} id={page._id} mood={page.mood}/>
                ))}
            </div>
        </>
    )
}

export default Home;