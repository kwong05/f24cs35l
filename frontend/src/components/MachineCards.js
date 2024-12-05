import React, { useEffect, useState } from 'react';
import Card from './Card';

function MachineCards({ machines, joinSeen, toggleJoinPopup, currentPopupId, setMessage, isLoggedIn, toggleFavorite, username, favorites }) {
  const [localFavorites, setLocalFavorites] = useState(favorites);

  useEffect(() => {
    setLocalFavorites(favorites);
  }, [favorites]);

  const cards = [];

  if (isLoggedIn) {
    // Get current user's favorites
    localFavorites.forEach((favorite) => {
      const tryToFindMachine = machines.find(m => m._id === favorite);
      if (tryToFindMachine) {
        cards.push(
          <Card
            key={tryToFindMachine._id}
            machine={tryToFindMachine}
            joinSeen={joinSeen}
            toggleJoinPopup={toggleJoinPopup}
            currentPopupId={currentPopupId}
            setMessage={setMessage}
            isLoggedIn={isLoggedIn}
            favorite={true}
            toggleFavorite={toggleFavorite}
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
          currentPopupId={currentPopupId}
          setMessage={setMessage}
          isLoggedIn={isLoggedIn}
          favorite={false}
          toggleFavorite={toggleFavorite}
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