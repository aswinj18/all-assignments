import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function userLoginRequest(username, password) {
    const config = {
        method: 'POST',
        url: 'http://localhost:3000/users/login',
        headers: {
            username,
            password
        }
    }

    axios.request(config)
    .then(response => response.data)
    .then(responseData => {
        const jwtToken = responseData.jwtToken;
        localStorage.setItem('user-access-token', jwtToken);

        console.log('Successfully Logged In!');
    })
    .catch(err => console.log(err));
}

function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    return <>
        <h1>
            Login Page
        </h1>
        <div>
            Email - <input type={'text'} value={username} onChange={e => setUsername(e.target.value)}/>
        </div>
        <div>
            Password - <input type={'password'} value={password} onChange={e => setPassword(e.target.value)}/>
        </div>
        <div>
            <button onClick={() => {
                userLoginRequest(username, password);
                setTimeout(() => navigate('/'), 2*1000);
            }}>Sign In</button>
        </div>
        <div>
            <Link to={'/'}>Return to Main Page</Link>
        </div>
    </>
}

export default Login;
