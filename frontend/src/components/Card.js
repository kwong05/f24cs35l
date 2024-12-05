import React, { useState, useEffect } from 'react';
import CardList from './CardList';
import JoinWaitlist from './JoinWaitlist';

function Card({ machine, joinSeen, toggleJoinPopup, currentPopupId, setMessage, isLoggedIn, favorite, toggleFavorite, username }) {
  const [listOpen, setListOpen] = useState(false);
  const [usernames, setUsernames] = useState([]);

  useEffect(() => {
    const fetchUsernames = async () => {
      try {
        const response = await fetch('http://localhost:10000/api/users/fetchUserDetails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userIds: machine.userQueue }),
        });
        if (!response.ok) {
          throw new Error('Error retrieving user details');
        }
        const data = await response.json();
        setUsernames(data.map(user => user.username));
      } catch (error) {
        console.error('Error fetching usernames:', error);
      }
    };

    if (machine.userQueue && machine.userQueue.length > 0) {
      fetchUsernames();
    }
  }, [machine.userQueue]);

  function toggleListOpen() {
    setListOpen(!listOpen);
  }

  let collapsible_text = "Waitlist is empty";
  let estimated_time = "";

  if (machine.userQueue && machine.userQueue.length !== 0) {
    collapsible_text = `${machine.userQueue.length} people waiting...`;
    estimated_time = `${machine.unlockTime} minutes`;
  }

  return (
    <div className="card">
      <div className="card-title">
        {machine.name}
        <button className="join-waitlist-button" onClick={() => toggleJoinPopup(machine._id)}>
          Join
        </button>
        {joinSeen && currentPopupId === machine._id ? (
          <JoinWaitlist
            toggle={toggleJoinPopup}
            setMessage={setMessage}
            id={currentPopupId}
            username={username}
          />
        ) : null}
        {isLoggedIn ? (
          favorite ? (
            <button className="favorites-button" onClick={() => toggleFavorite(machine._id)}>
              <span className="material-symbols-outlined active-favorite">favorite</span>
            </button>
          ) : (
            <button className="favorites-button" onClick={() => toggleFavorite(machine._id)}>
              <span className="material-symbols-outlined inactive-favorite">favorite</span>
            </button>
          )
        ) : null}
      </div>
      <div className="collapsible">
        <button type="button" className="collapsible-button" onClick={toggleListOpen}>
          <div className="collapsible-description">
            {machine.userQueue && machine.userQueue.length !== 0 ? (
              listOpen ? <span className="material-symbols-outlined arrow">keyboard_arrow_down</span> : <span className="material-symbols-outlined arrow">chevron_right</span>
            ) : null}
            {collapsible_text}
          </div>
          <div className="collapsible-est-time">
            {estimated_time}
          </div>
        </button>
        <div>
          {listOpen ? <CardList waitlist={usernames} /> : null}
        </div>
      </div>
    </div>
  );
}

export default Card;