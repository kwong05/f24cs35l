import React from 'react';
import CardList from './CardList';

function Card({ machine, joinSeen, toggleJoinPopup, currentPopupId, setMessage }) {
    return (
        <div className="card">
            <h2>{machine.name}</h2>
            <button onClick={() => toggleJoinPopup(machine.id)}>
                Join
            </button>
            {joinSeen && currentPopupId === machine.id && (
                <div className="collapsible-est-time">
                    {machine.estimated_time}
                </div>
            )}
            <div>
                <CardList waitlist={machine.waitlist} />
            </div>
        </div>
    );
}

export default Card;