import React, { useState, useEffect } from 'react';
import ProgressBar from './ProgressBar';

function StatusCard({ username, currentMachine, queuedMachine }) {
  const [queuedUsernames, setQueuedUsernames] = useState([]);

  useEffect(() => {
    const fetchUsernames = async (userIds) => {
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
        setQueuedUsernames(data.map(user => user.username));
      } catch (error) {
        console.error('Error fetching usernames:', error);
      }
    };
    if (queuedMachine) {
      fetchUsernames(queuedMachine.userQueue);
    }
  });

  let waitlistPosition = "";
  let timeLeftToWait = 0;
  let totalTime = 15;
  if(queuedMachine) {
    waitlistPosition = queuedUsernames.indexOf(username);
    if(waitlistPosition != -1) {
      const now = new Date();
      const minutesRemaining = Math.ceil((new Date(queuedMachine.unlockTime) - now) / 60000);
      timeLeftToWait = minutesRemaining + (waitlistPosition*15);
      totalTime = 15 + (waitlistPosition*15);
    }
  }

  let minutesRemainingOnCurrent = "";
  if(currentMachine) {
    const now = new Date();
    minutesRemainingOnCurrent = Math.ceil((new Date(currentMachine.unlockTime) - now) / 60000);
  }


  return (
    <div className="card">
      <span className="material-symbols-outlined account-circle">account_circle</span>
      <div className="status-card-title">
      {username}
      </div>
      <p></p>
      {currentMachine ?
        (<div className="status-card-body">
          <div className="progress-bar-description-left">
          Currently using: <b>{currentMachine.name}</b>
          </div>
          <div className="progress-bar-description-right">
            {minutesRemainingOnCurrent} minutes left
          </div>
        </div>) :
        (<div className="status-card-body">
          Currently not using a machine
        </div>)}
        {queuedMachine ? 
          (<div className="status-card-body">
            <div className="progress-bar-description-left">
            You are <b>{getOrdinal(waitlistPosition)}</b> in line for <b>{queuedMachine.name}</b>
            </div>
            <div className="progress-bar-description-right">
              {timeLeftToWait} minutes remaining
            </div>
            <ProgressBar progress={1-(timeLeftToWait/totalTime)} />
          </div>
          )
          : (<div className="status-card-body">
            Currently not queued
          </div>)}
    </div>
  );
}

function getOrdinal(number) {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const mod100 = number % 100;
  const mod10 = number % 10;
  if(number == 0)
  {
    return "next";
  }
  if (mod100 >= 11 && mod100 <= 13) {
    return number + 'th';
  }
  return number + (suffixes[mod10] || suffixes[0]);
}

export default StatusCard;
