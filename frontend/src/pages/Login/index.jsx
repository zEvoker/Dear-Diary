import './index.scss'
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const Login = React.memo(({ user, setUser }) => {
    const [showUser, setShowUser] = useState(false);
    const [username, setUsername] = useState(user);

    return (
        <>
            {showUser && <input type="text" value={username} placeholder='Username' onChange={e => setUsername(e.target.value)} onKeyDown={e => {if (e.key === 'Enter') {setUser(username); setShowUser(false);}}}/>}
            <FontAwesomeIcon icon={faUser} className='icons' onClick={() => {if(showUser) setUser(username); setShowUser(prev => !prev)}}/>
        </>
    )
});

export default Login;