import React, { useState } from 'react';
import SignUp from "./SignUp";
import { FaMoon, FaSun, FaBell } from 'react-icons/fa';
import { HeaderBarProps } from '../rendererTypes';
import { ApiResponse, Session } from '../rendererTypes';

const HeaderBar: React.FC<HeaderBarProps> = ({ toggleDarkMode, isDarkMode, onNotificationClick, loggedIn, setLoggedIn }) => {
  const [isSignUpOpen, setIsSignUpOpen] = useState<boolean>(false);

  const toggleSignUp = () => {
    setIsSignUpOpen(!isSignUpOpen);
  };

  const handleSignUpSuccess = () => {
    setIsSignUpOpen(false);
  };

  const logout = async () => {
    console.log('logout btn is clicked')
    try {
      await window.api.logout();
      setLoggedIn(false);
    }
    catch(err){
      console.error;
    }
  }

  return (
    <header className="flex justify-between items-center p-4 bg-base-100 shadow-md">
      <div className="text-xl font-bold">Heartwood</div>
      <div className="flex items-center space-x-4">
        <button onClick={toggleDarkMode} className="btn btn-primary">
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>
        <button onClick={onNotificationClick} className="btn btn-secondary">
          <FaBell />
        </button>
        <div className="avatar flex space-x-2">
          {loggedIn ? (
            <button onClick={logout} className="btn btn-secondary">
              Logout
            </button>
          ) : (
            <button onClick={toggleSignUp} className="btn btn-secondary">
              SignUp
            </button>
          )}
        </div>
      </div>

      {isSignUpOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div>
            <SignUp
              onSignUpSuccess={handleSignUpSuccess}
              toggleSignUp={toggleSignUp}
              setLoggedIn={setLoggedIn}
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default HeaderBar;
