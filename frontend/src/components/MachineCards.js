import React, { useEffect, useState } from 'react';
import Card from './Card';

function MachineCards({ machines, joinSeen, toggleJoinPopup, currentPopupId, setMessage, isLoggedIn, toggleFavorite, username }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const url = `http://localhost:10000/api/users/fetchFavorites?username=${encodeURIComponent(username)}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Error retrieving favorites list data');
        }
        const data = await response.json();
        setFavorites(data);
      } catch (error) {
        console.error('Error fetching favorites list:', error);
      }
    };

    if (isLoggedIn) {
      fetchFavorites();
    }
  }, [isLoggedIn, username]);

  const cards = [];

  if (isLoggedIn) {
    // Get current user's favorites
    favorites.forEach((favorite) => {
      const tryToFindMachine = machines.find(m => m._id === favorite);
      if (tryToFindMachine) {
        cards.push(
          <Card
            key={tryToFindMachine._id}
            machine={tryToFindMachine}
            joinSeen={joinSeen}
            toggleJoinPopup={toggleJoinPopup}
            currentPopupId={currentPopupId}
            machines={machines}
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
      addCardToArray = !(favorites.includes(machine._id));
    }
    if (addCardToArray) {
      cards.push(
        <Card
          key={machine._id}
          machine={machine}
          joinSeen={joinSeen}
          toggleJoinPopup={toggleJoinPopup}
          currentPopupId={currentPopupId}
          machines={machines}
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