import React from 'react';
import Card from './Card';
import { BrowserRouter as Router, useParams } from 'react-router-dom';

function MachineCards({ machines, joinSeen, toggleJoinPopup, currentPopupId, setMessage, isLoggedIn, toggleFavorite }) {
  const cards = []
  let favorites = [];
  try {
    const url = `http://localhost:10000/api/users/fetchFavorites?username=${encodeURIComponent(username)}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          },
        });
        
    if (!response.ok) {
      throw new Error('Error retrieving favorites list data') }
      const data = await response.json();
      favorites = data;
    } catch (error) {
        console.error('Error fetching favorites list:', error);
      }
    };
  
  if (isLoggedIn) {
    //get current user's favorites
    //favorites = getFavorites();
    favorites.forEach((favorite) => {
      const tryToFindMachine = machines.find(m => m._id === favorite);
      if (tryToFindMachine) {
        cards.push(
          <Card key={tryToFindMachine._id} machine={tryToFindMachine} joinSeen={joinSeen} toggleJoinPopup={toggleJoinPopup} currentPopupId={currentPopupId} machines={machines} setMessage={setMessage} isLoggedIn={isLoggedIn} favorite={true} toggleFavorite={toggleFavorite} />
        )
      }
    })
  }
  //add rest of machines to the array
  let addCardToArray = true;
  machines.forEach((machine) => {
    if (isLoggedIn) {
      addCardToArray = !(favorites.includes(machine._id))
    }
    if (addCardToArray) {
      cards.push(
        <Card key={machine._id} machine={machine} joinSeen={joinSeen} toggleJoinPopup={toggleJoinPopup} currentPopupId={currentPopupId} machines={machines} setMessage={setMessage} isLoggedIn={isLoggedIn} favorite={false} toggleFavorite={toggleFavorite} />
      )
    }
  })

  //if the URL is not the homepage, only display the machine that is in the url 
  const { machineId } = useParams();
  const tryToFindMachine = machines.find(m => m._id === machineId);

  if (!tryToFindMachine) {
    return (
      <div className="machine-cards">
        {cards}
      </div>
    )
  }

  return (
    <div className="machine-cards">
      <Card key={machineId} machine={tryToFindMachine} joinSeen={joinSeen} toggleJoinPopup={toggleJoinPopup} currentPopupId={currentPopupId} machines={machines} setMessage={setMessage} isLoggedIn={isLoggedIn} favorite={isLoggedIn && favorites.includes(tryToFindMachine._id)} toggleFavorite={toggleFavorite} />
    </div>
  )
}

export default MachineCards;
