import React from 'react';
import config from '../utils/config';

function LeaveWaitlist({ toggle, setMessage, id, username, updateMachineQueue }) {

  async function handleLeaveWaitlist(e) {
    e.preventDefault();
    const selectedEquipment = id; // the id of the machine that the user is trying to leave

    // Handle leaving waitlist
    try {
      // Validate user input
      if (!username || !selectedEquipment) {
        setMessage("Please provide a valid username and equipment name.");
        return;
      }

      console.log(username, selectedEquipment);
      // Send the POST request to the backend
      const response = await fetch(`${config.apiUrl}/api/equipment/renege`, {
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
          setMessage('Successfully left the waitlist');
        } else {
          setMessage(data.message || 'Something went wrong');
        }
      } else {
        const text = await response.text();
        console.error('Error leaving waitlist:', text);
        setMessage('Error leaving the waitlist');
      }
    } catch (error) {
      console.error('Error leaving waitlist:', error);
      setMessage('An error occurred. Please try again later.');
    }
    toggle();
  }

  return (
    <div className="popup">
      <div className="popup-inner">
        <h2>Leave the Waitlist</h2>
        <label>Are you sure you want to leave the queue?</label>
        <button className="close-button-top-right" onClick={toggle}>
          <span className="material-symbols-outlined">close</span>
        </button>
        <form onSubmit={handleLeaveWaitlist}>
          <button type="submit">Leave</button>
        </form>
      </div>
    </div>
  );
}

export default LeaveWaitlist;