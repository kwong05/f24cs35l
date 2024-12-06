import React from 'react';
import { Link } from 'react-router-dom';
import Login from './Login';
import SignUp from './SignUp';
import Error from './Error';
import AddMachine from './AddMachine';

function Header({ toggleLoginPopup, toggleSignUpPopup, loginSeen, signUpSeen, toggleErrorPopup, errorSeen, currentErrorMessage, isLoggedIn, username, handleLogout, addMachineSeen, toggleMachinePopup, toggleAdminPopup }) {
    return (
        <div className="header">
            <div className="topnav">
                <div className="topnav-icon">
                    <span className="material-symbols-outlined">fitness_center</span>
                </div>
                <Link className="topnav-appname" to="/kwong05/f24cs35l/">Bruin Wait-Lifting</Link>
                {isLoggedIn ? (
                    <>
                        <div className="topnav-user" data-username={username} onClick={handleLogout}>
                            <span>{username}</span>
                        </div>
                        <div className="topnav-buttons" onClick={toggleMachinePopup}>
                            Add machine
                        </div>
                        {addMachineSeen ? <AddMachine toggle={toggleMachinePopup} setMessage={toggleErrorPopup} /> : null}
                        <div className="topnav-buttons" onClick={toggleAdminPopup}>
                            Grant Admin
                        </div>
                        {addMachineSeen ? <AddMachine toggle={toggleAdminPopup} setMessage={toggleErrorPopup} /> : null}
                    </>
                ) : (
                    <>
                        <div className="topnav-buttons" onClick={toggleLoginPopup}>
                            Login
                        </div>
                        {loginSeen ? <Login toggle={toggleLoginPopup} setMessage={toggleErrorPopup} /> : null}
                        <div className="topnav-buttons" onClick={toggleSignUpPopup}>
                            Sign up
                        </div>
                        {signUpSeen ? <SignUp toggle={toggleSignUpPopup} setMessage={toggleErrorPopup} /> : null}
                    </>
                )}
            </div>
            {errorSeen ? <Error toggle={toggleErrorPopup} message={currentErrorMessage} /> : null}
        </div >
    );
}

export default Header;
