import './index.scss'
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import Card from '../../components/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpenReader, faPen, faSearch, faUser } from '@fortawesome/free-solid-svg-icons';
import { startOfToday } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
};

const Home = () => {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchtxt, setSearchtxt] = useState('');
    const [query, setQuery] = useState('');
    const [searchdate, setSearchdate] = useState('');
    const [results, setResults] = useState([]);
    const nav = useNavigate();

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

    const handleCreate = async () => {
        setLoading(true);
        try {
            const today = startOfToday();
            const newPage = {title:"", content:"", data:today, mood:0};
            const response = await axios.post(`http://localhost:5555/diary`, newPage);
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
        try{
            const response = await axios.post('http://localhost:5555/chat/', {
                message: `The database has 4 fields title, content, date and mood (0 for neutral, 1 for happy, 2 for sad, 3 for angry). Return a mongo db query string of the form "title=value;content=value;dateStart=value;dateEnd=value;mood=value; corresponding to the text given after the ';' at the end "; ${query}`,
                history: []
            })
            //(regex syntax where * means 0 or more of preceding element and ^ means start of string) 
            console.log(response.data)
            const q = response.data;
            const resp = await axios.get('http://localhost:5555/diary/search', {
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
            const response = await axios.get('http://localhost:5555/diary', {
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
                    <FontAwesomeIcon icon={faBookOpenReader}/>
                    <span>Dear Diary</span>
                </div>
                <FontAwesomeIcon icon={faUser} className='icons'/>
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
                    <div className="cards">
                    {results.map((page,idx) => (
                        <Card key={idx} title={page.title} id={page._id} mood={page.mood} day={page.date}/>
                    ))}
                    </div>
                </div>
            </div>
            <FontAwesomeIcon icon={faPen} className='write' onClick={handleCreate}/>
        </div>
    )
}

export default Home;