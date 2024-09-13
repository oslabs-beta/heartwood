import React, { useState } from 'react';
import SignUp from "./SignUp";

const HeaderBar = ({ toggleDarkMode, isDarkMode, onNotificationClick }) => {
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

 
  const toggleSignUp = () => {
    setIsSignUpOpen(!isSignUpOpen);
  };


  const handleSignUpSuccess = () => {
    setIsSignUpOpen(false);
  };

  return (
    <header className="flex justify-between items-center p-4 bg-base-100 shadow-md">
      <div className="text-xl font-bold">Heartwood</div>
      <div className="flex items-center space-x-4">
        <button onClick={toggleDarkMode} className="btn btn-primary">
          {isDarkMode ? 'Light' : 'Dark'}
        </button>
        <button onClick={onNotificationClick} className="btn btn-secondary">
          Notifications
        </button>
        <div className="avatar flex space-x-2">
          <button onClick={toggleSignUp} className="btn btn-secondary">
            SignUp
          </button>
        </div>
      </div>
      {isSignUpOpen && (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
          <div 
           
          >
            <button 
              onClick={toggleSignUp} 
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              X
            </button>
            <SignUp onSignUpSuccess={handleSignUpSuccess} />
          </div>
        </div>
      )}
    </header>
  );
};

export default HeaderBar;
