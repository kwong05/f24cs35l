import React, { useState, useEffect } from 'react';
import ProgressBar from './ProgressBar';
import config from '../utils/config';

function StatusCard({ username, currentMachine, queuedMachine }) {
  /*
  useEffect(() => {
    // Fetch current equipment and queued equipment
    async function fetchUserData() {
      try {
        const response = await fetch(`${config.apiUrl}/api/users/fetchCurrentEquipment?username=${username}`);
        if (!response.ok) {
          throw new Error('Error retrieving current equipment data');
        }
        const data = await response.json();
        setCurrentMachine(machines.find(m => m._id === data.currentEquipment));

        const response2 = await fetch(`${config.apiUrl}/api/users/fetchQueuedEquipment?username=${username}`);
        if (!response2.ok) {
          throw new Error('Error retrieving queued equipment data');
        }
        const data2 = await response2.json();
        setQueuedMachine(machines.find(m => m._id === data2.queuedEquipment));
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    fetchUserData();

  }, [username, machines]);*/

  const [waitlistPosition, setWaitlistPosition] = useState("");
  const [timeLeftToWait, setTimeLeftToWait] = useState(0);
  const [totalTime, setTotalTime] = useState(15);
  const [minutesRemainingOnCurrent, setMinutesRemainingOnCurrent] = useState("");

  useEffect(() => {
    const fetchUsernames = async (userIds) => {
      try {
        const response = await fetch(`${config.apiUrl}/api/users/fetchUserDetails`, {
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

        const orderedUsernames = userIds.map(id => {
          const user = data.find(user => user._id === id);
          return user ? user.username : null;
        });

        return orderedUsernames;
      } catch (error) {
        console.error('Error fetching usernames:', error);
      }
    };

    if (queuedMachine) {
      console.log(queuedMachine.userQueue);
      fetchUsernames(queuedMachine.userQueue).then((orderedUsernames) => {
        let position = -1;
        if(orderedUsernames)
        {
           position = orderedUsernames.indexOf(username); 
        }
        setWaitlistPosition(position);
        if (position !== -1) {
          const now = new Date();
          const minutesRemaining = Math.ceil((new Date(queuedMachine.unlockTime) - now) / 60000);
          setTimeLeftToWait(minutesRemaining + (position * 15));
          setTotalTime(15 + (position * 15));
        }
      });
    }

    if (currentMachine) {
      const now = new Date();
      const minutesRemaining = Math.ceil((new Date(currentMachine.unlockTime) - now) / 60000);
      setMinutesRemainingOnCurrent(minutesRemaining);
    }
  }, [queuedMachine, currentMachine]);

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
            You are <b>{getOrdinal(waitlistPosition+1)}</b> in line for <b>{queuedMachine.name}</b>
          </div>
          <div className="progress-bar-description-right">
            {timeLeftToWait} minutes remaining
          </div>
          <ProgressBar progress={1 - (timeLeftToWait / totalTime)} />
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
  if (mod100 >= 11 && mod100 <= 13) {
    return number + 'th';
  }
  return number + (suffixes[mod10] || suffixes[0]);
}

export default StatusCard;
