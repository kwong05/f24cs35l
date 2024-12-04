import React from 'react';
import Card from './Card';

function MachineCards({ machines, joinSeen, toggleJoinPopup, currentPopupId, setMessage, loggedIn, toggleFavorite }) {
      const cards = []
  if(loggedIn)
  {
      //get current user's favorites
    favorites = getFavorites();
    favorites.forEach((favorite) => {
      const tryToFindMachine = machines.find(m => m.id === favorite);
      if(tryToFindMachine) {
        cards.push(
          <Card key={tryToFindMachine.id} machine={tryToFindMachine} joinSeen={joinSeen} toggleJoinPopup={toggleJoinPopup} currentPopupId={currentPopupId} machines={machines} setMessage={setMessage} loggedIn={loggedIn} favorite={true} toggleFavorite={toggleFavorite}/>
          )
      }
    })
  }
  //add rest of machines to the array
  let addCardToArray = true;
  machines.forEach((machine) => {
    if(loggedIn) {
      addCardToArray = !(favorites.includes(machine.id))
    }
    if(addCardToArray) {
      cards.push(
        <Card key={machine.id} machine={machine} joinSeen={joinSeen} toggleJoinPopup={toggleJoinPopup} currentPopupId={currentPopupId} machines={machines} setMessage={setMessage} loggedIn={loggedIn} favorite={false} toggleFavorite={toggleFavorite}/>
      )
    }
  })

    //if the URL is not the homepage, only display the machine that is in the url 
  const { machineId } = useParams(); 
  const tryToFindMachine = machines.find(m => m.id === machineId);
    
  if(!tryToFindMachine) {
    return (
      <div class="machine-cards">
        {cards}
      </div>
    )
  }
    
  return (
    <div class="machine-cards">
      <Card key={machineId} machine={tryToFindMachine} joinSeen={joinSeen} toggleJoinPopup={toggleJoinPopup} currentPopupId={currentPopupId} machines={machines} setMessage={setMessage} loggedIn={loggedIn} favorite={loggedIn && favorites.includes(tryToFindMachine.id)} toggleFavorite={toggleFavorite}/>
    </div>
  )
}

export default MachineCards;
