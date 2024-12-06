import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import config from '../utils/config'; // Import the configuration file
import './AdminTools.css'; // Import the CSS file for styling

function AdminTools({ equipmentId, setMessage, refreshMachines }) {
    const [username, setUsername] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate

    const handleDeleteEquipment = async () => {
        try {
            const response = await fetch(`${config.apiUrl}/api/equipment/deleteEquipment`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include the token in the Authorization header
                },
                body: JSON.stringify({ _id: equipmentId }), // Send equipment name in the request body
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Equipment deleted successfully');
                navigate('/kwong05/f24cs35l/'); // Navigate to home page

            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage(error.message);
        }
    };

    const handleToggleStatus = async () => {
        try {
            const response = await fetch(`${config.apiUrl}/api/equipment/toggleStatus`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include the token in the Authorization header
                },
                body: JSON.stringify({ _id: equipmentId })
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Equipment status toggled');
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage('Error toggling equipment status');
        }
    };

    const handleRemoveCurrentUser = async () => {
        try {
            const response = await fetch(`${config.apiUrl}/api/equipment/removeCurrentUser/${equipmentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include the token in the Authorization header
                },
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Current user removed from machine');
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage('Error removing current user from machine');
        }
    };

    const handleRenegeUserFromWaitlist = async () => {
        try {
            const response = await fetch(`${config.apiUrl}/api/equipment/renegeUserFromWaitlist`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include the token in the Authorization header
                },
                body: JSON.stringify({ equipmentId, username }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('User removed from waitlist');
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage('Error removing user from waitlist');
        }
    };

    const handleRenegeAllUsers = async () => {
        try {
            const response = await fetch(`${config.apiUrl}/api/equipment/renegeAllUsers/${equipmentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include the token in the Authorization header
                },
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('All users removed from waitlist');
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage('Error removing all users from waitlist');
        }
    };

    return (
        <div className="admin-tools">
            <h1>Admin Tools</h1>
            <p>Manage application settings and perform administrative tasks.</p>
            <div className="admin-tools-form">
                <h2>Manage equipment</h2>
                <button onClick={handleDeleteEquipment} className="admin-tools-button">Delete equipment</button>
                <button onClick={handleToggleStatus} className="admin-tools-button">Toggle out-of-order status</button>
                <br></br>
                <h2>Manage users</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="admin-tools-input"
                />
                <button onClick={handleRemoveCurrentUser} className="admin-tools-button">Remove current user</button>

                <button onClick={handleRenegeUserFromWaitlist} className="admin-tools-button">Renege user from waitlist</button>
                <button onClick={handleRenegeAllUsers} className="admin-tools-button">Renege all users</button>
            </div>
        </div>
    );
}

export default AdminTools;