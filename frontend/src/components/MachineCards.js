import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, useParams } from 'react-router-dom';
import Card from './Card';
import StatusCard from './StatusCard';
import config from '../utils/config';
import AdminTools from './AdminTools';

function MachineCards({ machines, joinSeen, toggleJoinPopup, leaveSeen, toggleLeavePopup, currentPopupId, setMessage, isLoggedIn, toggleFavorite, username, favorites, currentMachine, queuedMachine, isAdmin, refreshMachines }) {
  const [localFavorites, setLocalFavorites] = useState(favorites);
  const { machineId } = useParams(); // Use useParams to get machineId

  useEffect(() => {
    setLocalFavorites(favorites);
  }, [favorites]);

  const cards = [];
  const availableMachines = [];
  const unavailableMachines = [];
  const outOfOrderMachines = [];

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
            leaveSeen={leaveSeen}
            toggleLeavePopup={toggleLeavePopup}
            currentPopupId={currentPopupId}
            setMessage={setMessage}
            isLoggedIn={isLoggedIn}
            favorite={(isLoggedIn && favorites.includes(tryToFindMachine._id))}
            toggleFavorite={toggleFavorite}
            username={username}
            currentMachine={currentMachine}
            queuedMachine={queuedMachine}
            machines={machines}
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
    if(currentMachine) {
      const tryToFindMachine = machines.find(m => m._id === currentMachine._id);
      if (tryToFindMachine) {
        availableMachines.push(tryToFindMachine);
      }
    }
    if(queuedMachine) {
      const tryToFindMachine = machines.find(m => m._id === queuedMachine._id);
      if (tryToFindMachine) {
        availableMachines.push(tryToFindMachine);
      }
    }
    // Get current user's favorites
    localFavorites.forEach((favorite) => {
      const tryToFindMachine = machines.find(m => m._id === favorite);
      if (tryToFindMachine) {
        availableMachines.push(tryToFindMachine);
      }
    });
  }

  machines.forEach((machine) => {
    if (isLoggedIn && (localFavorites.includes(machine._id) || (currentMachine && currentMachine._id === machine._id) || (queuedMachine && queuedMachine._id === machine._id))) {
      return; // Skip already added favorite/current/queued machines
    }
    if (!machine.status) {
      outOfOrderMachines.push(machine);
    } else if (!machine.currentUser) {
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
        currentMachine={currentMachine}
        queuedMachine={queuedMachine}
          machines={machines}
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
        currentMachine={currentMachine}
        queuedMachine={queuedMachine}
          machines={machines}
      />
    );
  });

  // Render out of order machines last
  outOfOrderMachines.forEach((machine) => {
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
        currentMachine={currentMachine}
        queuedMachine={queuedMachine}
          machines={machines}
      />
    );
  });

  return (
    <div className="machine-cards">
      {isLoggedIn ? <StatusCard
        username={username}
        currentMachine={currentMachine}
        queuedMachine={queuedMachine}
      /> : null}
      {cards}
    </div>
  );
}

export default MachineCards;
