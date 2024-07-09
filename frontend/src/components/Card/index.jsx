import { format } from 'date-fns';
import './index.scss'
import { Link } from 'react-router-dom';

const Card = ({title, id, mood, day}) => {
    const moodClass = {0: 'mood-neutral',1: 'mood-happy',2: 'mood-sad',3: 'mood-angry'}[mood];

    return (
        <Link className={`card-container ${moodClass}`} to={`diary/${id}`}>
            <div className="glass"></div>
            <div className="card-top">{title}</div>
            <div className="card-bot">
                <div className="card-left">
                    <span>{format(day, "MMMM do yyyy")}</span>
                </div>
                <div className="card-right">
                    <span>{mood}</span>
                </div>
            </div>
        </Link>
    )
}

export default Card;