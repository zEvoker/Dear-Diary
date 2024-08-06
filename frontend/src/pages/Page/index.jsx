import './index.scss'
import axios from 'axios'
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faClose, faFaceAngry, faFaceFrown, faFaceMeh, faFaceSmileBeam, faPalette, faPenToSquare, faTrashAlt, faUserPlus, faUserXmark } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';
import Chat from '../../components/Chat';

const Page = ({user}) => {
    const [page, setPage] = useState({});
    const [text, setText] = useState("");
    const [head, setHead] = useState("");
    const [day, setDay] = useState('2024-07-04');
    const [mood, setMood] = useState(0);
    const [loading, setLoading] = useState(false);
    const [color, setColor] = useState('#ffeaa7');
    const [edit, setEdit] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [firstMsg, setFirstMsg] = useState("");
    const [confirmDel, setConfirmDel] = useState(false);
    const dateInputRef = useRef(null);
    const {id} =useParams();
    const moods = [faFaceMeh, faFaceSmileBeam, faFaceFrown, faFaceAngry]
    const navigate = useNavigate();
    
    useEffect(() => {
        setLoading(true);
        axios.get(`https://dear-diary-backend.vercel.app/diary/${id}`)
        .then((response) => {
            setPage(response.data);
            setText(response.data.content);
            setHead(response.data.title);
            setDay(response.data.date);
            setMood(response.data.mood);
            setLoading(false);
        })
        .catch((error) =>{
            console.log(error);
            setLoading(false);
        })
    }, [id]);

    const handleDel = async () => {
        setLoading(true);
        try {
            await axios.delete(`https://dear-diary-backend.vercel.app/diary/${id}`);
            setLoading(false);
            navigate('/');
        } catch (error) {
            setLoading(false);
            console.error(error);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const feel = await handleMood();
            const updatedPage = {...page,title:head,content:text,date:day,mood:feel};
            const response = await axios.put(`https://dear-diary-backend.vercel.app/diary/${id}`, updatedPage);
            setLoading(false);
            setEdit(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }

    const handleShowChat = async () => {
        setLoading(true);
        try{
            const response = await axios.post('https://dear-diary-backend.vercel.app/chat/', {
                message: `Talk to me like a friend in short messages. I'm feeling sad, so please be understanding and supportive.; ${text}`,
                history: []
            })
            const botres = response.data;
            setFirstMsg(botres);
            setLoading(false);
        } catch(error) {
            console.log(error);
            setLoading(true);
        }
        setShowChat(true);
    }

    const handleMood = async () => {
        setLoading(true);
        try{
            const response = await axios.post('https://dear-diary-backend.vercel.app/chat/', {
                message: `return how the user is feeling in one word among the 4 : neutral, happy, sad, neutralangry; ${text}`,
                history: []
            })
            const feel = response.data;
            if(feel === "sad" || feel === "angry") handleShowChat();
            const moodMap = { happy: 1, sad: 2, angry: 3, neutral: 0 };
            setMood(moodMap[feel] ?? 0);
            setLoading(false);
            return moodMap[feel] ?? 0;
        } catch(e) {
            console.log(e);
            setLoading(false);
            return mood;
        }
    }

    const modules = {
        toolbar: {
            container: "#toolbar"
        }
    }

    const Size = Quill.import("formats/size");
    Size.whitelist = [ "small", "medium", "large"];
    Quill.register(Size, true);

    const Font = Quill.import("formats/font");
    Font.whitelist = [
      "arial",
      "comic-sans",
      "georgia",
      "helvetica",
      "AlexBrush",
      "RougeScript",
      "Swanky"
    ];
    Quill.register(Font, true);

    const formats = [ "header", "font", "size", "bold", "italic", "underline", "align", "strike", "script", "blockquote", "background", "list", "bullet", "indent", "link", "image", "color", "code-block"];

    return (
        <div className='pageContainer' style={loading ? {backgroundColor: "black"} : {backgroundColor: color}}>
            {user === page.author && <div className="header">
                {edit?
                <div className='confirmDel'>
                    <FontAwesomeIcon onClick={handleSave} icon={faCheck} className='headericon'/>
                    <FontAwesomeIcon onClick={() => {setEdit(false); setText(page.content);}} icon={faClose} className='headericon'/>
                </div>
                :
                <FontAwesomeIcon onClick={()=>setEdit(true)} icon={faPenToSquare} className='headericon'/>
                }
                <FontAwesomeIcon icon={showChat ? faUserXmark : faUserPlus} className='headericon' onClick={() => setShowChat( prev => !prev)}/>
                {confirmDel ?
                <div className="confirmDel">
                    <FontAwesomeIcon onClick={() => setConfirmDel(false)} icon={faClose} className='headericon'/>                
                    <FontAwesomeIcon onClick={handleDel} icon={faCheck} className='headericon'/>
                </div>
                :
                <FontAwesomeIcon icon={faTrashAlt} className='headericon' onClick={() => setConfirmDel(true)} />
                }
            </div>}
            <div className="heading">
                <input type="text" placeholder='Title' value={head} onChange={(e) => setHead(e.target.value)} disabled={!edit}/>
                <div className="track">
                    <span onClick={() => {if(edit) dateInputRef.current.showPicker();}}>{format(day, "MMMM do',' yyyy")}</span>
                    <input type="date" ref={dateInputRef} value={day} onChange={e => setDay(e.target.value)} style={{ display: 'none' }} disabled={!edit} />
                    {user === page.author && <FontAwesomeIcon icon={moods[mood]} className='mood' onClick={handleMood}/>}
                </div>
            </div>
            <div className={`content ${showChat && "chat-show"}`}>
                <ReactQuill theme="snow" modules={modules} formats={formats} value={text} onChange={setText} readOnly={!edit} placeholder='Start writing...'/>
                {showChat && <Chat firstMsg={firstMsg} />}
            </div>
            <div id='toolbar'>
                <span className='ql-formats'>
                    <select className="ql-size" defaultValue="medium">
                        <option value="small">small</option>
                        <option value="medium">medium</option>
                        <option value="large">large</option>
                    </select>
                    <select className="ql-font" defaultValue="arial">
                        <option value="arial">Arial</option>
                        <option value="comic-sans">Comic Sans</option>
                        <option value="georgia">Georgia</option>
                        <option value="helvetica">Helvetica</option>
                        <option value="AlexBrush">Alex Brush</option>
                        <option value="RougeScript">Rogue Scipt</option>
                        <option value="Swanky">Swanky</option>
                    </select>
                    <select className="ql-header" defaultValue="3">
                        <option value="1">heading</option>
                        <option value="2">subheading</option>
                        <option value="3">normal</option>
                  </select>
                </span>
                <span className="ql-formats">
                  <button className="ql-bold" />
                  <button className="ql-italic" />
                  <button className="ql-underline" />
                  <button className="ql-strike" />
                </span>
                <span className="ql-formats">
                  <button className="ql-list" value="ordered" />
                  <button className="ql-list" value="bullet" />
                  <button className="ql-indent" value="-1" />
                  <button className="ql-indent" value="+1" />
                </span>
                <span className="ql-formats">
                  <button className="ql-script" value="super" />
                  <button className="ql-script" value="sub" />
                  <button className="ql-blockquote" />
                  <button className="ql-direction" />
                </span>
                <span className="ql-formats">
                  <select className="ql-align" />
                  <select className="ql-color" />
                  <select className="ql-background" />
                </span>
                <span className="ql-formats">
                  <button className="ql-link" />
                  <button className="ql-image" />
                  <button className="ql-video" />
                </span>
                <span className="ql-formats">
                  <button className="ql-formula" />
                  <button className="ql-code-block" />
                  <button className="ql-clean" />
                </span>
            </div>
            <input type="color" value={color} id="favcolor" onChange={e => { setColor(e.target.value) }} style={{ display: 'none' }} />
            <label htmlFor="favcolor"><FontAwesomeIcon icon={faPalette} className='bgchange'/></label>
        </div>
    )
}

export default Page;