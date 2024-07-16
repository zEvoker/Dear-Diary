import './index.scss'
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceAngry, faFaceFrown, faFaceMeh, faFaceSmileBeam } from '@fortawesome/free-solid-svg-icons';

const Card = ({title, id, mood, day}) => {
    const moodClass = {0: 'mood-neutral',1: 'mood-happy',2: 'mood-sad',3: 'mood-angry'}[mood];
    const moods = [faFaceMeh, faFaceSmileBeam, faFaceFrown, faFaceAngry]

    return (
        <Link className={`card-container ${moodClass}`} to={`diary/${id}`}>
            <div className="glass"></div>
            <div className="card-top">{title}</div>
            <div className="card-bot">
                <div className="card-left">
                    <span>{format(day, "MMMM do yyyy")}</span>
                </div>
                <div className="card-right">
                    <FontAwesomeIcon icon={moods[mood]} />
                </div>
            </div>
        </Link>
    )
}

export default Card;