import React, { useState } from 'react';
import CardList from './CardList';
import JoinWaitlist from './JoinWaitlist'

function Card({ machine, joinSeen, toggleJoinPopup, currentPopupId, setMessage, isLoggedIn, favorite, toggleFavorite }) {
  const [listOpen, setListOpen] = useState(false);
  function toggleListOpen() {
    setListOpen(!listOpen);
  }

  let collapsible_text = "Waitlist is empty";
  let estimated_time = "";

  if (machine.userQueue && machine.userQueue.length != 0) {
    collapsible_text = machine.userQueue.length + " people waiting..."
    estimated_time = machine.unlockTime + " minutes";
  }

  return (
    <div className="card">
      <div className="card-title">
        {machine.name}
        <button className="join-waitlist-button" onClick={() => toggleJoinPopup(machine._id)}>
          Join
        </button>
        {joinSeen ? <JoinWaitlist toggle={toggleJoinPopup} id={currentPopupId} setMessage={setMessage} /> : null}
        {isLoggedIn ?
          (favorite ? (
            <button className="favorites-button" onClick={() => toggleFavorite(machine._id)}>
              <span className="material-symbols-outlined active-favorite">favorite</span>
            </button>
          ) : (
            <button className="favorites-button" onClick={() => toggleFavorite(machine._id)}>
              <span className="material-symbols-outlined inactive-favorite">favorite</span>
            </button>
          )) : null}
      </div>
      <div className="collapsible">
        <button type="button" className="collapsible-button" onClick={() => toggleListOpen()}>
          <div className="collapsible-description">
            {machine.userQueue && machine.userQueue.length != 0 ? (
              listOpen ? <span className="material-symbols-outlined arrow">keyboard_arrow_down</span> : <span class="material-symbols-outlined arrow">chevron_right</span>
            ) : null
            }
            {collapsible_text}
          </div>
          <div className="collapsible-est-time">
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
