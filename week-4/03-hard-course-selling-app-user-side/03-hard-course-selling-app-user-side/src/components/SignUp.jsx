import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function createUser(username, password) {
    const config = {
        method: 'POST',
        url: 'http://localhost:3000/users/signup',
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            username,
            password
        })
    }

    axios.request(config)
    .then(response => response.data)
    .then(responseData => console.log(responseData))
    .catch(err => console.log(err));
}

function SignUp() {
    const navigate = useNavigate();

    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    return <>
        <h1>
            Sign Up Page
        </h1>
        <div>
            Email - <input type={'text'} value={username} onChange={e => setUsername(e.target.value)}/>
        </div>
        <div>
            Password - <input type={'password'} value={password} onChange={e => setPassword(e.target.value)}/>
        </div>
        <div>
            <button onClick={() => {
                createUser(username, password);
                navigate('/');
            }}>Sign In</button>
        </div>
        <div>
            <Link to={'/'}>Return to Main Page</Link>
        </div>
    </>
}

export default SignUp;
