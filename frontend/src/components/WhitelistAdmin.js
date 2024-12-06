import React, { useState } from 'react';
import config from '../utils/config';

function GrantAdmin({ toggle, setMessage, refreshUsers }) {
    const [localUsername, setLocalUsername] = useState('');

    const handleGrantAdmin = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${config.apiUrl}/api/users/grantAdmin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ username: localUsername }),
            });
            if (!response.ok) {
                throw new Error('Grant admin failed');
            }
            const data = await response.json();
            console.log('Successfully granted admin rights:', data);
            toggle();
        } catch (error) {
            toggle();
            setMessage(error.message);
        }
    };

    return (
        <div className="popup">
            <div className="popup-inner">
                <h2>Grant Admin</h2>
                <form onSubmit={handleGrantAdmin}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={localUsername}
                        onChange={(e) => setLocalUsername(e.target.value)}
                    />
                    <button type="submit">Grant</button>
                </form>
                <button className="close-button-top-right" onClick={toggle}>
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>
        </div>
    );
}

export default GrantAdmin;