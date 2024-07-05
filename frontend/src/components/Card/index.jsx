import { Link } from 'react-router-dom';
import './index.scss'

const Card = ({title, id, mood}) => {
    const bgs = ['#ffeaa7','#74b9ff','#ff7675','#ffffff']
    return (
        <Link className="card-container" to={`diary/${id}`} style={{backgroundColor: bgs[mood]}}>
            <div className="card-top">{title}</div>
            <div className="card-bot">
                <span>{id}</span>
                <span>{mood}</span>
            </div>
        </Link>
    )
}

export default Card;