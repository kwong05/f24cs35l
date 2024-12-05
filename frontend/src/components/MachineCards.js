import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, useParams } from 'react-router-dom';
import Card from './Card';

function MachineCards({ machines, joinSeen, toggleJoinPopup, leaveSeen, toggleLeavePopup, currentPopupId, setMessage, isLoggedIn, toggleFavorite, username, favorites }) {
  const [localFavorites, setLocalFavorites] = useState(favorites);

  useEffect(() => {
    setLocalFavorites(favorites);
  }, [favorites]);

  const cards = [];

  const {machineId} = useParams();
  if(machineId)
  {
    const tryToFindMachine = machines.find(m => m._id === machineId);
    if(tryToFindMachine) {
      return (
        <div class="machine-cards">
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
        </div>
      )
    }
  }

  if (isLoggedIn) {
    // Get current user's favorites
    localFavorites.forEach((favorite) => {
      const tryToFindMachine = machines.find(m => m._id === favorite);
      if (tryToFindMachine) {
        cards.push(
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
            favorite={false}
            toggleFavorite={toggleFavorite}
            username={username}
          />
        );
      }
    });
  }

  // Add rest of machines to the array
  let addCardToArray = true;
  machines.forEach((machine) => {
    if (isLoggedIn) {
      addCardToArray = !(localFavorites.includes(machine._id));
    }
    if (addCardToArray) {
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
          favorite={false}
          toggleFavorite={toggleFavorite}
          username={username}
        />
      );
    }
  });

  return (
    <div className="machine-cards">
      {cards}
    </div>
  );
}

export default MachineCards;
