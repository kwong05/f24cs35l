import React, { useState } from 'react';
import { handleLogin } from './Login';

function SignUp({ toggle, setMessage, setIsLoggedIn, setUsername }) {
    const [localUsername, setLocalUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:10000/api/users/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: localUsername, password }),
            });
            if (!response.ok) {
                throw new Error('Signup failed');
            }
            const data = await response.json();
            console.log('Signup successful:', data);
            // Automatically log in the user after successful registration
            handleLogin({ username: localUsername, password, setUsername, setIsLoggedIn, toggle, setMessage });
        } catch (error) {
            setMessage(error.message);
        }
    };

    return (
        <div className="popup">
            <div className="popup-inner">
                <h3>Sign Up</h3>
                <form onSubmit={handleSignUp}>
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
                    <button type="submit">Sign Up</button>
                </form>
                <button className="close-button-top-right" onClick={toggle}>
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>
        </div>
    );
}

export default SignUp;