import React from 'react';
import { Link } from 'react-router-dom';
import Login from './Login';
import SignUp from './SignUp';
import Error from './Error';

function Header({ toggleLoginPopup, toggleSignUpPopup, loginSeen, signUpSeen, toggleErrorPopup, errorSeen, currentErrorMessage }) {
    return (
        <div className="header">
            <div className="topnav">
                <div className="topnav-icon">
                    <span className="material-symbols-outlined">fitness_center</span>
                </div>
                <Link className="topnav-appname" to="/kwong05/f24cs35l/">Bruin Wait-Lifting</Link>
                <div className="topnav-buttons" onClick={toggleLoginPopup}>
                    Login
                </div>
                {loginSeen ? <Login toggle={toggleLoginPopup} setMessage={toggleErrorPopup} /> : null}
                <div className="topnav-buttons" onClick={toggleSignUpPopup}>
                    Sign up
                </div>
                {signUpSeen ? <SignUp toggle={toggleSignUpPopup} setMessage={toggleErrorPopup} /> : null}
            </div>
            {errorSeen ? <Error toggle={toggleErrorPopup} message={currentErrorMessage} /> : null}
        </div>
    );
}

export default Header;