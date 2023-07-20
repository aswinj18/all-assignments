import React from "react";
import axios from "axios";

function getToken(email, password) {
    console.log('Inside getToken');

    let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://localhost:3000/admin/login',
    headers: { 
        'username': email, 
        'password': password, 
    }
    };

    console.log(config);
    
    axios.request(config)
    .then(request => request.data.jwtToken)
    .then(jwtToken => {
        sessionStorage.setItem('admin-session-key', jwtToken);
        console.log('JWT Token stored!');
    });
}

function clearInput(setEmail, setPassword) {
    console.log('Inside clearInput');

    setEmail('');
    setPassword('');
}

/// File is incomplete. You need to add input boxes to take input for users to login.
function Login() {
    console.log('Inside Login');

    // sessionStorage.removeItem('admin-session-key');

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("")

    return <div>
        <h1>Login to admin dashboard</h1>
        <br/>
        Email - <input id='email-input' type={"text"} value={email} onChange={e => setEmail(e.target.value)} />
        <br/>
        Password - <input id='password-input' type={"password"} value={password} onChange={e => setPassword(e.target.value)} />
        <br/>
        <button onClick={() => {
            getToken(email, password);
            clearInput(setEmail, setPassword);
            setTimeout(() => (window.location.href = '/courses'), 2*1000);
        }}>Login</button>
        <br/>
        New here? <a href="/register">Register</a>
    </div>
}

export default Login;