import React, { useState } from 'react';
import config from '../utils/config';

const handleLogin = async ({ username, password, setUsername, setIsLoggedIn, toggle, setMessage, setIsAdmin }) => {
    try {
        const response = await fetch(`${config.apiUrl}/api/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        if (!response.ok) {
            throw new Error('Login failed');
        }
        const data = await response.json();
        console.log('Login successful:', data);
        localStorage.setItem('token', data.token);
        setUsername(username);
        setIsLoggedIn(true);
        setIsAdmin(data.isAdmin);
        toggle();
    } catch (error) {
        toggle();
        setMessage(error.message);
    }
};

function Login({ toggle, setMessage, setIsLoggedIn, setUsername, setIsAdmin }) {
    const [localUsername, setLocalUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        handleLogin({ username: localUsername, password, setUsername, setIsLoggedIn, toggle, setMessage, setIsAdmin });
    };

    return (
        <div className="popup">
            <div className="popup-inner">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={localUsername}
                        onChange={(e) => setLocalUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">Login</button>
                </form>
                <button className="close-button-top-right" onClick={toggle}>
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>
        </div>
    );
}

export { handleLogin };
export default Login;
