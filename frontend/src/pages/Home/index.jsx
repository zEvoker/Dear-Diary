import './index.scss'
import axios from 'axios';
import Card from '../../components/Card';
import Loader from '../../components/Loader';
import Login from '../Login';
import { useCallback, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpenReader, faPen, faSearch } from '@fortawesome/free-solid-svg-icons';
import { startOfToday } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
};

const Home = ({user,setUser}) => {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchtxt, setSearchtxt] = useState('');
    const [query, setQuery] = useState('');
    const [searchdate, setSearchdate] = useState('');
    const [results, setResults] = useState([]);
    const nav = useNavigate();

    useEffect(() => {
        const fetchMine = async () => {
            setLoading(true);
            try {
                let par = {};
                if(user) par.author=user;
                const response = await axios.get('https://dear-diary-backend.vercel.app/diary', {
                    params: par
                });
                const sortedPages = response.data.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                setPages(sortedPages);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        }
        fetchMine();
    }, [user]);

    const handleCreate = async () => {
        if(user === "") {
            return;
        }
        setLoading(true);
        try {
            const today = startOfToday();
            const newPage = {title:"", author:user, content:"", date:today, mood:0};
            const response = await axios.post(`https://dear-diary-backend.vercel.app/diary`, newPage);
            const id = response.data._id;
            nav(`diary/${id}`);
            setLoading(false);
        } catch(error) {
            setLoading(false);
            console.error(error);
        }
    }

    const handleQuery = async () => {
        if(query === "") return;
        setLoading(true);
        const today = startOfToday();
        try{
            const response = await axios.post('https://dear-diary-backend.vercel.app/chat/', {
                message: `The database has 3 fields title, date (today is ${today}) and mood (0 for neutral, 1 for happy, 2 for sad, 3 for angry). Return a mongo db query string of the form "title=value;dateStart=value;dateEnd=value;mood=value;" corresponding to the text given after the ';' at the end ; ${query}`,
                history: []
            })
            //(regex syntax where * means 0 or more of preceding element and ^ means start of string) 
            // console.log(response.data)
            const q = response.data;
            const resp = await axios.get('https://dear-diary-backend.vercel.app/diary/search', {
                params: {
                    queryString: q,
                }
            });
            setResults(resp.data.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    }

    const handleSearch = async (stxt, sdate) => {
        if(!stxt && !sdate) {
            setResults([]);
            return;
        }
        setLoading(true);
        try {
            const response = await axios.get('https://dear-diary-backend.vercel.app/diary', {
                params: {
                    title: stxt,
                    date: sdate,
                }
            });
            setResults(response.data.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }
    const debouncedHandleSearch = useCallback(debounce(handleSearch, 300), []);

    return (
        <div className='home'>
            <div className="logo">
                <div className="logoicon">
                    <FontAwesomeIcon icon={faBookOpenReader} className='logoimg'/>
                    <span>Dear Diary</span>
                </div>
                <div className="user">
                    <Login user={user} setUser={setUser}/>
                </div>
            </div>
            <div className="pages-1">
                <div className="cards">
                    {pages.map((page,idx) => (
                        <Card key={idx} title={page.title} id={page._id} mood={page.mood} day={page.date}/>
                    ))}
                </div>
            </div>
            <div className="section">
                <div className="searchsection">
                    <div className="searchdate">
                        <FontAwesomeIcon icon={faSearch}/>
                        <input type="date" value={searchdate} onChange={e => {const temp=e.target.value; setSearchdate(temp); debouncedHandleSearch(searchtxt,temp);}} />
                    </div>
                    <div className="searchquery">
                        <FontAwesomeIcon icon={faSearch}/>
                        <input type="text" placeholder='Show me entries from April' value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => {if (e.key === 'Enter') handleQuery();}}/>
                    </div>
                    <div className="searchtitle">
                        <FontAwesomeIcon icon={faSearch}/>
                        <input type="text" placeholder='Title' value={searchtxt} onChange={e => {const temp=e.target.value; setSearchtxt(temp); debouncedHandleSearch(temp,searchdate);}}/>
                    </div>
                </div>
                <div className="searchresults">
                    {loading?
                    <Loader />
                    :
                    <div className="cards">
                    {results.map((page,idx) => (
                        <Card key={idx} title={page.title} id={page._id} mood={page.mood} day={page.date}/>
                    ))}
                    </div>}
                </div>
            </div>
            <FontAwesomeIcon icon={faPen} className='write' onClick={handleCreate}/>
        </div>
    )
}

export default Home;