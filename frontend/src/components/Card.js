import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import config from '../utils/config';

import CardList from './CardList';
import JoinWaitlist from './JoinWaitlist';
import LeaveWaitlist from './LeaveWaitlist';

function Card({ machine, joinSeen, toggleJoinPopup, leaveSeen, toggleLeavePopup, currentPopupId, setMessage, isLoggedIn, favorite, toggleFavorite, username, currentMachine, queuedMachine, machines }) {
  const [listOpen, setListOpen] = useState(false);
  const [usernames, setUsernames] = useState([]);
  const [currentUsername, setCurrentUsername] = useState("");
  const [showQRCode, setShowQRCode] = useState(false);
  const qrCodeRef = useRef();

  const navigate = useNavigate();

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
  }, [username, machines]);
  
  useEffect(() => {
    const fetchUserData = async (userIds, isCurrentUsername) => {
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
        // Map the fetched user details back to the original order of the user IDs
        const orderedUsernames = userIds.map(id => {
          const user = data.find(user => user._id === id);
          return user ? user.username : null;
        });
        if (isCurrentUsername) {
          setCurrentUsername(orderedUsernames[0]);
        } else {
          setUsernames(orderedUsernames);
        }
      } catch (error) {
        console.error('Error fetching usernames:', error);
      }
    };

    if (machine.userQueue && machine.userQueue.length > 0) {
      fetchUserData(machine.userQueue, false);
    }
    if (machine.currentUser) {
      fetchUserData([machine.currentUser], true);
    }
  }, [machine.userQueue, machine.currentUser]);

  function toggleListOpen() {
    setListOpen(!listOpen);
  }

  function toggleQRCode() {
    setShowQRCode(!showQRCode);
  }

  function downloadQRCode() {
    const canvas = qrCodeRef.current.querySelector('canvas');
    const pngUrl = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');
    let downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `${machine.name}-qrcode.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }


  function toggleQRCode() {
    setShowQRCode(!showQRCode);
  }

  function downloadQRCode() {
    const canvas = qrCodeRef.current.querySelector('canvas');
    const pngUrl = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');
    let downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `${machine.name}-qrcode.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }


  const inUse = machine.currentUser;
  const listIsNotEmpty = (machine.userQueue && machine.userQueue.length != 0);
  const inQueue = queuedMachine && queuedMachine._id === machine._id;
  const currentlyUsing = currentMachine && currentMachine._id === machine._id;

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

    //(`${machine.name} Unlock time: ${date}`);
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


  const machineStatus = machine.status ? (machine.currentUser ? 'in-use' : 'available') : 'out-of-order';
  const statusText = machine.status ? (machine.currentUser ? 'In Use' : 'Available') : 'Out of Order';

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title" onClick={() => navigate(`/kwong05/f24cs35l/${machine._id}`)}>
          {machine.name}
        </div>
        <span className={`outcome ${machineStatus}`}>{statusText}</span>
        {isLoggedIn ? (
          inQueue || currentlyUsing ? (
            <button className="leave-waitlist-button" onClick={() => toggleLeavePopup(machine._id)}>
            Leave
          </button>
          ) : (
            <button className="join-waitlist-button" onClick={() => toggleJoinPopup(machine._id)}>
            Join
          </button>
          )
        ) : null}
        {joinSeen && currentPopupId === machine._id ? (
          <JoinWaitlist
            toggle={toggleJoinPopup}
            setMessage={setMessage}
            id={currentPopupId}
            username={username}
          />
        ) : null}
        {leaveSeen && currentPopupId === machine._id ? (
          <LeaveWaitlist
            toggle={toggleLeavePopup}
            setMessage={setMessage}
            id={currentPopupId}
            username={username}
          />
        ) : null}
        <button className="info-button" onClick={(e) => { e.stopPropagation(); toggleQRCode(); }}>
          <span className="material-symbols-outlined">info</span>
        </button>
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
      {showQRCode && (
        <div id="qrCodeModal" className="modal" style={{ display: 'block' }}>
          <div className="modal-content">
            <span className="close" onClick={toggleQRCode}>&times;</span>
            <div ref={qrCodeRef}>
              <QRCodeCanvas value={`${config.frontUrl}/kwong05/f24cs35l/${machine._id}`} />
            </div>
            <button className="download-button" onClick={downloadQRCode}>Download</button>
          </div>
        </div>
      )}
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
