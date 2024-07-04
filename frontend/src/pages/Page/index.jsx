import './index.scss'
import axios from 'axios'
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheck, faClose, faFaceAngry, faFaceFrown, faFaceMeh, faFaceSmileBeam, faPalette, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';
import Chat from '../../components/Chat';

const Page = () => {
    const [page, setPage] = useState({});
    const [text, setText] = useState("");
    const [head, setHead] = useState("");
    const [day, setDay] = useState('07-04-2024');
    const [mood, setMood] = useState(0);
    const [loading, setLoading] = useState(false);
    const [color, setColor] = useState('#ffeaa7');
    const [edit, setEdit] = useState(false);
    const dateInputRef = useRef(null);
    const {id} =useParams();
    const moods = [faFaceMeh, faFaceSmileBeam, faFaceFrown, faFaceAngry]
    
    useEffect(() => {
        setLoading(true);
        axios.get(`http://localhost:5555/diary/${id}`)
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

    const handleSave = () => {
        setLoading(true);
        const updatedPage = {...page, title: head, content: text, date: day, mood:mood};
        axios.put(`http://localhost:5555/diary/${id}`, updatedPage)
        .then((response) => {
            setLoading(false);
            setEdit(false);
        })
        .catch((error) => {
            setLoading(false);
            console.log(error);
        })
    }

    const handleMood = async () => {
        setLoading(true);
        try{
            const response = await axios.post('http://localhost:5555/chat/', {
                message: `return how the user is feeling in one word among the 4 : neutral, happy, sad, neutralangry; ${text}`,
                history: []
            })
            const feel = response.data;
            const moodMap = { happy: 1, sad: 2, angry: 3, neutral: 0 };
            setMood(moodMap[feel] ?? 0);
            setLoading(false);
        } catch(e) {
            console.log(e);
            setLoading(false);
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
        <div className='pageContainer' style={{backgroundColor: color}}>
            <div className="header">
                <FontAwesomeIcon icon={faArrowLeft} className='headericon'/>
                {edit?
                <>
                    <FontAwesomeIcon onClick={() => {setEdit(false); setText(page.content);}} icon={faClose} className='headericon'/>
                    <FontAwesomeIcon onClick={handleSave} icon={faCheck} className='headericon'/>
                </>
                :
                    <FontAwesomeIcon onClick={()=>setEdit(true)} icon={faPenToSquare} className='headericon'/>
                }
            </div>
            <div className="heading">
                <input type="text" placeholder='Title' value={head} onChange={(e) => setHead(e.target.value)} disabled={!edit}/>
                <div className="track">
                    <span onClick={() => dateInputRef.current.showPicker()}>{format(day, "MMMM do',' yyyy")}</span>
                    <input type="date" ref={dateInputRef} value={day} onChange={e => setDay(e.target.value)} style={{ display: 'none' }} disabled={!edit} />
                    <FontAwesomeIcon icon={moods[mood]} className='mood' onClick={handleMood}/>
                </div>
            </div>
            <div className="content">
                <ReactQuill theme="snow" modules={modules} formats={formats} value={text} onChange={setText} readOnly={!edit} placeholder='Start writing...'/>
                <Chat />
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