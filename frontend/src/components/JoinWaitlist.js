import React from 'react';

function JoinWaitlist({toggle, id, setMessage}) {

  async function handleJoinWaitlist(e) {
      e.preventDefault();
      const selectedEquipment = id; //the id of the machine that the user is trying to join
      //const token = localStorage.getItem('token'); // if JWT token in localStorage

      //handle joining waitlist
       try {
      // Validate user input <- I don't think we need this
      /* 
        if (!userId || !selectedEquipment) {
          setMessage("Please provide a valid user ID and equipment name");
          return;
        }
      */

      // Send the POST request to the backend
      const response = await fetch('/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Tell the backend you're sending JSON data
          //'Authorization': `Bearer ${token}`, // Send the JWT token in the Authorization header
        },
        body: JSON.stringify({ name: selectedEquipment }), // Send the desired equipment name
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Successfully joined the waitlist');
      } else {
        setMessage(data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error joining waitlist:', error);
      setMessage('An error occurred. Please try again later.');
    }
    toggle()
    }

    return (
      <div className="popup">
          <div className="popup-inner">
              <h2>Join the Waitlist</h2>
              <label>When it is your turn on the waitlist, you will have 15 minutes.</label>
              <button className="close-button-top-right" onClick={toggle}>
                <span className="material-symbols-outlined">close</span>
              </button>
              <form onSubmit={handleJoinWaitlist}>
                  <button type="submit">Join</button>
              </form>
          </div>
      </div>
  )
}

export default JoinWaitlist;
