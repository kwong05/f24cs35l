import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CardList from './CardList';
import JoinWaitlist from './JoinWaitlist';
import LeaveWaitlist from './LeaveWaitlist';

function Card({ machine, joinSeen, toggleJoinPopup, leaveSeen, toggleLeavePopup, currentPopupId, setMessage, isLoggedIn, favorite, toggleFavorite, username }) {
  const [listOpen, setListOpen] = useState(false);
  const [usernames, setUsernames] = useState([]);
  const [currentUsername, setCurrentUsername] = useState("");
  const [isInQueue, setIsInQueue] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsernames = async (userIds, isCurrentUsername) => { //if isCurrentUsername is true, will put userId in currentUsername instead of usernames 
      try {
        const response = await fetch('http://localhost:10000/api/users/fetchUserDetails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userIds: userIds }),
        });
        if (!response.ok) {
          throw new Error('Error retrieving user details');
        }
        const data = await response.json();
        if (isCurrentUsername) {
          setCurrentUsername(data[0].username);
        } else {
          setUsernames(data.map(user => user.username));
        }
      } catch (error) {
        console.error('Error fetching usernames:', error);
      }
    };

    if (machine.userQueue && machine.userQueue.length > 0) {
      fetchUsernames(machine.userQueue, false);
    }
    if (machine.currentUser) {
      fetchUsernames([machine.currentUser], true);
    }
  }, [machine.userQueue, machine.currentUser]);

  function toggleListOpen() {
    setListOpen(!listOpen);
  }

  const inUse = machine.currentUser;
  const listIsNotEmpty = (machine.userQueue && machine.userQueue.length != 0);
  
  let collapsible_text = "Waitlist is empty";
  if (inUse) {
    collapsible_text = "Current user: " + currentUsername;
  }
  let unlock_time = "";

  if (machine.userQueue && machine.userQueue.length != 0) {

    collapsible_text += ` (${machine.userQueue.length} waiting...)`;
    const date = new Date(machine.unlockTime);
    const now = new Date();
    const additionalMinutes = machine.userQueue.length * 15;
    const totalMinutesRemaining = Math.ceil((date - now) / 60000) + additionalMinutes;

    // Calculate the new unlock time
    const newUnlockTime = new Date(date);
    newUnlockTime.setMinutes(newUnlockTime.getMinutes() + additionalMinutes);
    const formattedNewUnlockTime = newUnlockTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    console.log(`${machine.name} Unlock time: ${date}`);
    unlock_time = `Free at ${formattedNewUnlockTime} (${totalMinutesRemaining} minutes)`;
  } else if (machine.currentUser) {
    const unlockTime = new Date(machine.unlockTime);
    const now = new Date();
    const totalMinutesRemaining = Math.ceil((unlockTime - now) / 60000);
    const formattedUnlockTime = unlockTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    unlock_time = `Free at ${formattedUnlockTime} (${totalMinutesRemaining} minutes)`;
  }


  const machineStatus = machine.currentUser ? 'in-use' : 'available';
  const statusText = machine.currentUser ? 'In Use' : 'Available';

  return (
    <div className="card">
      <div className="card-title" onClick={() => navigate(`/kwong05/f24cs35l/${machine._id}`)}>
        {machine.name}
        <span className={`outcome ${machineStatus}`}>{statusText}</span>
        {!isInQueue && isLoggedIn ? (
          <button className="join-waitlist-button" onClick={() => toggleJoinPopup(machine._id)}>
            Join
          </button>
        ) : null}

        {joinSeen && currentPopupId === machine._id ? (
          <JoinWaitlist
            toggle={toggleJoinPopup}
            setMessage={setMessage}
            id={currentPopupId}
            username={username}
          />
        ) : null}
        {isInQueue ? (
          <button className="leave-waitlist-button" onClick={() => toggleLeavePopup(machine._id)}>
            Leave
          </button>
        ) : null}
        {leaveSeen && currentPopupId === machine._id ? (
          <LeaveWaitlist
            toggle={toggleLeavePopup}
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
        <button type="button" className="collapsible-button" onClick={(inUse && listIsNotEmpty ? toggleListOpen : null)}>
          <div className="collapsible-description">
            {machine.userQueue && machine.userQueue.length !== 0 ? (
              listOpen ? <span className="material-symbols-outlined arrow">keyboard_arrow_down</span> : <span className="material-symbols-outlined arrow">chevron_right</span>
            ) : null}
            {collapsible_text}
          </div>
          <div className="collapsible-est-time">
            {unlock_time}
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
