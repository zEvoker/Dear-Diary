import './index.scss'
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faSpinner } from '@fortawesome/free-solid-svg-icons';

const Chat = ({firstMsg}) => {
    const [messages, setMessages] = useState([]);
    const [msg, setMsg] = useState("");
    const [waiting, setWaiting] = useState(false);
    const ref = useRef();
    const inputRef = useRef();

    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: "smooth"});
    }, [messages]);

    useEffect(() => {
        inputRef.current?.focus();
    }, [])

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSend(msg);
        }
    };
    const handleSend = async (m) => {
        if(m === "") return;
        if(waiting) return;
        const temp = [...messages];
        setWaiting(true);
        setMessages([...temp,[m,"..."]]);
        setMsg("");
        try{
            const response = await axios.post('http://localhost:5555/chat/', {
                message: `Talk to me like a friend in short messages. I'm feeling sad, so please be understanding and supportive.; ${msg}`,
                history: []
            })
            setMessages([...temp,[m,response.data]]);
            setWaiting(false);
        } catch(err) {
            console.error("error : ",err);
            setMessages([...temp,[m,"yeah I got nothing to say to that"]]);
            setWaiting(false);
        }
    }
    return (
        <div className="chat">
            <div className="chat-screen">
                {firstMsg && <div className="bot"><span>{firstMsg}</span></div>}
                <div className="bot"><span>You wanna talk about it?</span></div>
                {messages.map((message, idx) => (
                    <div key={idx}>
                        <div className="me"><span>{message[0]}</span></div>
                        <div className="bot" ref={ref}><span>{
                        message[1] === "..." ?
                        <div className="chatloader">
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                        :
                        message[1]
                        }</span></div>
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input type="text" ref={inputRef} value={msg} onChange={(e) => setMsg(e.target.value)} onKeyDown={handleKeyDown} placeholder='start chatting...'/>
                <FontAwesomeIcon icon={waiting ? faSpinner : faPaperPlane} className={`msgsender ${waiting && "spinn"}`} onClick={() => handleSend(msg)} />
            </div>
        </div>
    )
}

export default Chat;