import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header';
import MachineCards from './components/MachineCards';
import Error from './components/Error';

export default function App() {
  const [joinSeen, setJoinSeen] = useState(false);
  const [loginSeen, setLoginSeen] = useState(false);
  const [errorSeen, setErrorSeen] = useState(false);
  const [signUpSeen, setSignUpSeen] = useState(false);
  const [currentPopupId, setCurrentPopupId] = useState(null);
  const [currentErrorMessage, setCurrentErrorMessage] = useState(null);
  const [MACHINES, setMACHINES] = useState([]);

  useEffect(() => {
    const fetchEquipNames = async () => {
      try {
        const response = await fetch('http://localhost:10000/api/equipment');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setMACHINES(data);
      } catch (error) {
        console.error('Error fetching equipment names:', error);
      }
    };
    fetchEquipNames();
  }, []);

  const toggleJoinPopup = (id) => {
    setCurrentPopupId(id);
    setJoinSeen(!joinSeen);
  };

  const toggleLoginPopup = () => {
    setLoginSeen(!loginSeen);
  };

  const toggleSignUpPopup = () => {
    setSignUpSeen(!signUpSeen);
  };

  const toggleErrorPopup = (message) => {
    setCurrentErrorMessage(message);
    setErrorSeen(!errorSeen);
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
      />
      <Routes>
        <Route path="/kwong05/f24cs35l/" element={<MachineCards machines={MACHINES} joinSeen={joinSeen} toggleJoinPopup={toggleJoinPopup} currentPopupId={currentPopupId} setMessage={toggleErrorPopup} />} />
        <Route path="/kwong05/f24cs35l/:machineId" element={<MachineCards machines={MACHINES} joinSeen={joinSeen} toggleJoinPopup={toggleJoinPopup} currentPopupId={currentPopupId} setMessage={toggleErrorPopup} />} />
      </Routes>
    </div>
  );
}