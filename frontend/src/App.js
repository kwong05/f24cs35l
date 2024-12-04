import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Error from './components/Error';
import MachineCards from './components/MachineCards';

const PORT = 3001;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [loginSeen, setLoginSeen] = useState(false);
  const [signUpSeen, setSignUpSeen] = useState(false);
  const [errorSeen, setErrorSeen] = useState(false);
  const [currentErrorMessage, setCurrentErrorMessage] = useState('');
  const [joinSeen, setJoinSeen] = useState(false);
  const [currentPopupId, setCurrentPopupId] = useState(null);
  const [machines, setMachines] = useState([]); // State to hold machines data
  const [addMachineSeen, setAddMachineSeen] = useState(false);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Fetch equipment data from the backend
    const fetchEquipment = async () => {
      try {
        const response = await fetch('http://localhost:10000/api/equipment/fetchEquipment');
        if (!response.ok) {
          throw new Error('Error retrieving equipment data');
        }
        const data = await response.json();
        setMachines(data);
      } catch (error) {
        console.error('Error fetching equipment:', error);
      }
    };

    fetchEquipment();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  const fetchFavorites = async () => {
    try {
      const response = await fetch('http://localhost:10000/api/user/fetchFavorites');
      if (!response.ok) {
        throw new Error('Error retrieving favorites list data');
      }
      const data = await response.json();
      setFavorites(data);
    } catch (error) {
      console.error('Error fetching favorites list:', error);
    }
  };

  const toggleLoginPopup = () => {
    setLoginSeen(!loginSeen);
  };

  const toggleFavorite = (machineId) => {
    //todo get favorites
    //favorites = getFavorites()
    //favorites = [];
    if (favorites.includes(machineId)) {
      //setFavorites(favorites.filter(id => id !== machineId));
    } else {
      //setFavorites([...favorites, machineId]);
    }
  };

  const toggleMachinePopup = () => {
    setAddMachineSeen(!addMachineSeen);
  };

  const toggleSignUpPopup = () => {
    setSignUpSeen(!signUpSeen);
  };

  const toggleErrorPopup = (message) => {
    setCurrentErrorMessage(message);
    setErrorSeen(!errorSeen);
  };

  const toggleJoinPopup = (id) => {
    setCurrentPopupId(id);
    setJoinSeen(!joinSeen);
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
      <Routes>
        <Route path="/kwong05/f24cs35l/:machineId?" element={<MachineCards
          machines={machines}
          joinSeen={joinSeen}
          toggleJoinPopup={toggleJoinPopup}
          currentPopupId={currentPopupId}
          setMessage={toggleErrorPopup}
          isLoggedIn={isLoggedIn}
          toggleFavorite={toggleFavorite}
        />} />
      </Routes>
    </div>
  );
}

export default App;
