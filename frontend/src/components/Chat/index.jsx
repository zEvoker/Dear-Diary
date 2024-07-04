import { useEffect, useRef, useState } from 'react';
import './index.scss'
import axios from 'axios';

const Chat = ({type}) => {
    const firstMsgs = ["You wanna talk about it?",""];
    const [messages, setMessages] = useState([]);
    const [msg, setMsg] = useState("");
    const [waiting, setWaiting] = useState(false);
    const ref = useRef();

    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: "smooth"});
    }, [messages]);

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
                message: msg,
                history: []
            })
            setMessages([...temp,[m,response.data]]);
            setWaiting(false);
        } catch(err) {
            console.error("error : ",err);
            setMessages([...temp,[m,"can't respond to that"]]);
            setWaiting(false);
        }
    }
    return (
        <div className="chat">
            <div className="chat-screen">
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
                <input type="text" value={msg} onChange={(e) => setMsg(e.target.value)} onKeyDown={handleKeyDown} placeholder='start typing...'/>
            </div>
        </div>
    )
}

export default Chat;