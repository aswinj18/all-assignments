import React from "react";
import axios from 'axios';

function registerUser(email, password) {
    console.log('Inside registerUser');

    const body = {
        'username': email,
        'password': password
    };

    axios.post('http://localhost:3000/admin/signup', body);
}

function clearInput(setEmail, setPassword) {
    console.log('Inside clearInput');
    
    setEmail('');
    setPassword('');
}

/// File is incomplete. You need to add input boxes to take input for users to register.
function Register() {
    console.log('Inside Register');

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    return <div>
        <h1>Register to the website</h1>
        <br/>
        Email <input id='email-input' type={"text"} value={email} onChange={e => setEmail(e.target.value)} />
        <br/>
        Password <input id='password-input' type={"password"} value={password} onChange={e => setPassword(e.target.value)} />
        <br/>
        <button onClick={() => {
            registerUser(email, password);
            clearInput(setEmail, setPassword);
            window.location.href = '/login';
            }}>Register</button>
        Already a user? <a href="/login">Login</a>
    </div>
}

export default Register;