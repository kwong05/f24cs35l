import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import config from './utils/config';

import Header from './components/Header';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Error from './components/Error';
import MachineCards from './components/MachineCards';
import AddMachine from './components/AddMachine';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [loginSeen, setLoginSeen] = useState(false);
  const [signUpSeen, setSignUpSeen] = useState(false);
  const [errorSeen, setErrorSeen] = useState(false);
  const [currentErrorMessage, setCurrentErrorMessage] = useState('');
  const [joinSeen, setJoinSeen] = useState(false);
  const [leaveSeen, setLeaveSeen] = useState(false);
  const [currentPopupId, setCurrentPopupId] = useState(null);
  const [machines, setMachines] = useState([]); // State to hold machines data
  const [addMachineSeen, setAddMachineSeen] = useState(false);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchEquipment();
    const ws = new WebSocket(config.wsUrl);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      //console.log('Received update:', data);
      if (data.type === 'update') {
        setMachines((prevMachines) => {
          return prevMachines.map((machine) => {
            if (machine._id === data.equipment._id) {
              return data.equipment;
            }
            return machine;
          });
        });
      }
    };
    return () => {
      ws.close();
    };
  }, []);

  const fetchEquipment = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/api/equipment/fetchEquipment`);
      if (!response.ok) {
        throw new Error('Error retrieving equipment data');
      }
      const data = await response.json();
      setMachines(data);
    } catch (error) {
      console.error('Error fetching equipment:', error);
    }
  };


  const fetchFavorites = async () => {
    try {
      const url = `${config.apiUrl}/api/users/fetchFavorites?username=${encodeURIComponent(username)}`;
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

  useEffect(() => {
    if (isLoggedIn) {
      fetchFavorites();
    }
  }, [isLoggedIn, username]);


  const toggleFavorite = async (machineId) => {
    try {
      console.log('Toggling favorite:', machineId);
      let updatedFavorites;
      if (favorites.includes(machineId)) {
        updatedFavorites = favorites.filter(id => id !== machineId);
      } else {
        updatedFavorites = [...favorites, machineId];
      }
      setFavorites(updatedFavorites);

      const response = await fetch(`${config.apiUrl}/api/users/updateFavorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, favorites: updatedFavorites }),
      });

      if (!response.ok) {
        throw new Error('Error updating favorites');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  // POPUPS
  const toggleLoginPopup = () => {
    setLoginSeen(!loginSeen);
  };

  const toggleSignUpPopup = () => {
    setSignUpSeen(!signUpSeen);
  };

  const toggleMachinePopup = () => {
    setAddMachineSeen(!addMachineSeen);
  };

  const toggleErrorPopup = (message) => {
    setCurrentErrorMessage(message);
    setErrorSeen(!errorSeen);
  };

  const toggleJoinPopup = (id) => {
    setCurrentPopupId(id);
    setJoinSeen(!joinSeen);
  };

  const toggleLeavePopup = (id) => {
    setCurrentPopupId(id);
    setLeaveSeen(!leaveSeen);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
  };

  return (
    <div className="App">
      <Header
        toggleLoginPopup={toggleLoginPopup}
        toggleSignUpPopup={toggleSignUpPopup}
        loginSeen={loginSeen}
        signUpSeen={signUpSeen}
        toggleErrorPopup={toggleErrorPopup}
        errorSeen={errorSeen}
        currentErrorMessage={currentErrorMessage}
        isLoggedIn={isLoggedIn}
        username={username}
        handleLogout={handleLogout}
        addMachineSeen={addMachineSeen}
        toggleMachinePopup={toggleMachinePopup}
      />
      {loginSeen && (
        <Login
          toggle={toggleLoginPopup}
          setMessage={toggleErrorPopup}
          setIsLoggedIn={setIsLoggedIn}
          setUsername={setUsername}
        />
      )}
      {signUpSeen && (
        <SignUp
          toggle={toggleSignUpPopup}
          setMessage={toggleErrorPopup}
          setIsLoggedIn={setIsLoggedIn}
          setUsername={setUsername}
        />
      )}
      {addMachineSeen && (
        <AddMachine
          toggle={toggleMachinePopup}
          setMessage={toggleErrorPopup}
          refreshMachines={fetchEquipment}
        />
      )}
      <Routes>
        <Route path="/kwong05/f24cs35l/:machineId?" element={<MachineCards
          machines={machines}
          joinSeen={joinSeen}
          leaveSeen={leaveSeen}
          toggleJoinPopup={toggleJoinPopup}
          toggleLeavePopup={toggleLeavePopup}
          currentPopupId={currentPopupId}
          setMessage={toggleErrorPopup}
          isLoggedIn={isLoggedIn}
          toggleFavorite={toggleFavorite}
          username={username}
          favorites={favorites}
        />} />
      </Routes>
    </div>
  );
}

export default App;
