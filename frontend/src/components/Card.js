import React, { useState } from 'react';
import CardList from './CardList';

function Card({ machine, joinSeen, toggleJoinPopup, currentPopupId, setMessage, loggedIn, favorite, toggleFavorite }) {
  const [listOpen, setListOpen] = useState(false);
  function toggleListOpen() {
    setListOpen(!listOpen);
  }

  let collapsible_text = "Waitlist is empty";
  let estimated_time = "";
  
  if (machine.userQueue && machine.userQueue.length == 0)
  {
    collapsible_text = machine.userQueue.length + " people waiting..."
    estimated_time = machine.unlockTime + " minutes";
  }

  return (
    <div className="card">
      <div className="card-title">
        {machine.name}
        <button className="join-waitlist-button" onClick={() => toggleJoinPopup(machine.id)}>
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
      </div>
      <div class="collapsible">
        <button type="button" class="collapsible-button" onClick={() => toggleListOpen()}>
          <div class="collapsible-description">
            {machine.userQueue && machine.userQueue.length != 0 ? (
              listOpen ? <span class="material-symbols-outlined arrow">keyboard_arrow_down</span> : <span class="material-symbols-outlined arrow">chevron_right</span>
            ) : null
            }
            {collapsible_text}
          </div>
          <div class="collapsible-est-time">
            {estimated_time}
          </div>
        </button>
        <div>
          {listOpen ? <CardList waitlist={machine.userQueue} /> : null}
        </div>
      </div>
    </div>
  );
}

export default Card;
