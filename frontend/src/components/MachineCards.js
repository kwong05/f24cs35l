import React from 'react';
import Card from './Card';

function MachineCards({ machines, joinSeen, toggleJoinPopup, currentPopupId, setMessage }) {
    return (
        <div className="machine-cards">
            {machines.map((machine) => (
                <Card
                    key={machine.id}
                    machine={machine}
                    joinSeen={joinSeen}
                    toggleJoinPopup={toggleJoinPopup}
                    currentPopupId={currentPopupId}
                    setMessage={setMessage}
                />
            ))}
        </div>
    );
}

export default MachineCards;