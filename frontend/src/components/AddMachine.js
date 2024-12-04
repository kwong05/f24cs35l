import React, { useState } from 'react';

function AddMachine({ toggle, setMessage }) {
    const [localMachineName, setLocalMachineName] = useState('');

    const handleAddMachine = async (e) => {
        //add machine to server
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:10000/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ machine_name: localMachineName }),
            });
            if (!response.ok) {
                throw new Error('Add machine failed');
            }
            const data = await response.json();
            console.log('Successfully added a new machine:', data);
            setMachineName(localMachineName);
            toggle();
        } catch (error) {
            toggle();
            setMessage(error.message);
        }
        
    };

    return (
        <div className="popup">
            <div className="popup-inner">
                <h2>Add Machine</h2>
                <form onSubmit={handleAddMachine}>
                    <input
                        type="text"
                        placeholder="Machine Name"
                        value={localMachineName}
                        onChange={(e) => setLocalMachineName(e.target.value)}
                    />
                    <button type="submit">Add</button>
                </form>
                <button className="close-button-top-right" onClick={toggle}>
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>
        </div>
    );
}

export default AddMachine;