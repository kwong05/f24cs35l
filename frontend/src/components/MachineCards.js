import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, useParams } from 'react-router-dom';
import Card from './Card';
import StatusCard from './StatusCard';
import config from '../utils/config';
import AdminTools from './AdminTools';

function MachineCards({ machines, joinSeen, toggleJoinPopup, leaveSeen, toggleLeavePopup, currentPopupId, setMessage, isLoggedIn, toggleFavorite, username, favorites, isAdmin, refreshMachines }) {
  const [localFavorites, setLocalFavorites] = useState(favorites);
  // const [currentMachine, setCurrentMachine] = useState(null);
  // const [queuedMachine, setQueuedMachine] = useState(null);
  const { machineId } = useParams(); // Use useParams to get machineId

  useEffect(() => {
    // // Fetch current equipment and queued equipment
    // async function fetchUserData() {
    //   try {
    //     const response = await fetch(`${config.apiUrl}/api/users/fetchCurrentEquipment?username=${username}`);
    //     if (!response.ok) {
    //       throw new Error('Error retrieving current equipment data');
    //     }
    //     const data = await response.json();
    //     setCurrentMachine(data.currentEquipment);

    //     const response2 = await fetch(`${config.apiUrl}/api/users/fetchQueuedEquipment?username=${username}`);
    //     if (!response2.ok) {
    //       throw new Error('Error retrieving queued equipment data');
    //     }
    //     const data2 = await response2.json();
    //     setQueuedMachine(data2.queuedEquipment);
    //   } catch (error) {
    //     console.error('Error fetching user data:', error);
    //   }
    // }

    // fetchUserData();
    setLocalFavorites(favorites);
  }, [favorites]);

  const cards = [];
  const availableMachines = [];
  const unavailableMachines = [];

  if (machineId) {
    const tryToFindMachine = machines.find(m => m._id === machineId);
    if (tryToFindMachine) {
      return (
        <div className="machine-cards">
          <Card
            key={machineId}
            machine={tryToFindMachine}
            joinSeen={joinSeen}
            toggleJoinPopup={toggleJoinPopup}
            currentPopupId={currentPopupId}
            setMessage={setMessage}
            isLoggedIn={isLoggedIn}
            favorite={(isLoggedIn && favorites.includes(tryToFindMachine._id))}
            toggleFavorite={toggleFavorite}
            username={username}
          />
          <br /><br />
          {isAdmin && <AdminTools
            equipmentId={machineId} // Pass machineId as equipmentId
            refreshMachines={refreshMachines}
            setMessage={setMessage}
          />}
        </div>
      )
    }
  }

  if (isLoggedIn) {
    // Get current user's favorites
    localFavorites.forEach((favorite) => {
      const tryToFindMachine = machines.find(m => m._id === favorite);
      if (tryToFindMachine) {
        availableMachines.push(tryToFindMachine);
      }
    });
  }

  machines.forEach((machine) => {
    if (isLoggedIn && localFavorites.includes(machine._id)) {
      return; // Skip already added favorite machines
    }
    if (!machine.currentUser) {
      availableMachines.push(machine);
    } else {
      unavailableMachines.push(machine);
    }
  });

  // Render available machines first
  availableMachines.forEach((machine) => {
    cards.push(
      <Card
        key={machine._id}
        machine={machine}
        joinSeen={joinSeen}
        toggleJoinPopup={toggleJoinPopup}
        leaveSeen={leaveSeen}
        toggleLeavePopup={toggleLeavePopup}
        currentPopupId={currentPopupId}
        setMessage={setMessage}
        isLoggedIn={isLoggedIn}
        favorite={localFavorites.includes(machine._id)}
        toggleFavorite={toggleFavorite}
        username={username}
      />
    );
  });

  // Render unavailable machines next
  unavailableMachines.forEach((machine) => {
    cards.push(
      <Card
        key={machine._id}
        machine={machine}
        joinSeen={joinSeen}
        toggleJoinPopup={toggleJoinPopup}
        leaveSeen={leaveSeen}
        toggleLeavePopup={toggleLeavePopup}
        currentPopupId={currentPopupId}
        setMessage={setMessage}
        isLoggedIn={isLoggedIn}
        favorite={localFavorites.includes(machine._id)}
        toggleFavorite={toggleFavorite}
        username={username}
      />
    );
  });

  return (
    <div className="machine-cards">
      {isLoggedIn ? <StatusCard
        username={username}
        // currentMachine={machines.find(m => m._id === currentMachine)}
        // queuedMachine={machines.find(m => m._id === queuedMachine)}
        machines={machines}
      /> : null}
      {cards}
    </div>
  );
}

export default MachineCards;
