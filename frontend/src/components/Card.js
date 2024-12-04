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
            {loggedIn ? 
              (favorite ? (
                <button class="favorites-button" onClick={() => toggleFavorite(machine.id)}>
                  <span class="material-symbols-outlined active-favorite">favorite</span>
              </button>
              ) : (
                <button class="favorites-button" onClick={() => toggleFavorite(machine.id)}>
                <span class="material-symbols-outlined inactive-favorite">favorite</span>
            </button>
              )) : null}
            <div>
                <CardList waitlist={machine.waitlist} />
            </div>
        </div>
    );
}

export default Card;
