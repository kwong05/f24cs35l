import React from 'react';

function Error({ message, toggle }) {
    return (
        <div className="popup">
            <div className="popup-inner">
                <h2>Notice</h2>
                <p className="error-message">{message}</p>
                <button className="close-button-top-right" onClick={() => toggle('')}>
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>
        </div>
    );
}

export default Error;
