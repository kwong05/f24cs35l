import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Error from './components/Error';
import MachineCards from './components/MachineCards';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(''); // Define username state
  const [loginSeen, setLoginSeen] = useState(false);
  const [signUpSeen, setSignUpSeen] = useState(false);
  const [errorSeen, setErrorSeen] = useState(false);
  const [currentErrorMessage, setCurrentErrorMessage] = useState('');
  const [joinSeen, setJoinSeen] = useState(false);
  const [currentPopupId, setCurrentPopupId] = useState(null);
  const [addMachineSeen, setAddMachineSeen] = useState(false);
  const MACHINES = []; // Replace with actual machines data

  const toggleFavorite = (machineId) => {
    favorites = getFavorites() //TODO get favorites list for current user from server
    if (favorites.includes(machineId)) {
      //remove machine from favorites list
      //setFavorites(favorites.filter(id => id !== machineId));
    } else {
      //add machine to favorites list 
      //setFavorites([...favorites, machineId]);
    }
  };
  
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
        username={username} // Pass username state to Header
        handleLogout={handleLogout} // Pass handleLogout to Header
        addMachineSeen={addMachineSeen} //if Add Machine popup has been seen
        toggleMachinePopup={toggleMachinePopup} //toggle Add Machine popup
      />
      {loginSeen && (
        <Login
          toggle={toggleLoginPopup}
          setMessage={toggleErrorPopup}
          setIsLoggedIn={setIsLoggedIn}
          setUsername={setUsername} // Pass setUsername to Login
        />
      )}
      {signUpSeen && (
        <SignUp
          toggle={toggleSignUpPopup}
          setMessage={toggleErrorPopup}
          setIsLoggedIn={setIsLoggedIn}
          setUsername={setUsername} // Pass setUsername to SignUp
        />
      )}
      <Routes>
        <Route path="/kwong05/f24cs35l/:machineId?" element={<MachineCards
            machines = {MACHINES}
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
