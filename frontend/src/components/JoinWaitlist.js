import React from 'react';

function JoinWaitlist({ toggle, setMessage, id, username, updateMachineQueue}) {

  async function handleJoinWaitlist(e) {
    e.preventDefault();
    const selectedEquipment = id; // the id of the machine that the user is trying to join

    // Handle joining waitlist
    try {
      // Validate user input
      if (!username || !selectedEquipment) {
        toggle();
        setMessage("Please provide a valid username and equipment name");
        return;
      }
      console.log(username, selectedEquipment);
      // Send the POST request to the backend
      const response = await fetch('http://localhost:10000/api/equipment/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Tell the backend you're sending JSON data
        },
        body: JSON.stringify({ user: username, id: selectedEquipment }), // Send the username and desired equipment name
      });

      // Check if the response is JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        const data = await response.json();
        if (response.ok) {
          setIsInQueue(true);
          setMessage('Successfully joined the waitlist');
        } else {
          setMessage(data.message || 'Something went wrong');
        }
      } else {
        const text = await response.text();
        console.error('Error joining waitlist:', text);
        setMessage('Error joining the waitlist');
      }
    } catch (error) {
      console.error('Error joining waitlist:', error);
      setMessage('An error occurred. Please try again later.');
    }
    toggle();
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
  );
}

export default JoinWaitlist;
