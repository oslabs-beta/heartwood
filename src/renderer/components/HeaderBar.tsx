import React, { useState, useEffect } from 'react';
import SignUp from "./SignUp";
import { FaMoon, FaSun, FaBell, FaUser } from 'react-icons/fa';
import { HeaderBarProps } from '../rendererTypes';
import { ApiResponse, Session } from '../rendererTypes';
import HeartwoodLogo from '../Heartwoodlogo.png';



const HeaderBar: React.FC<HeaderBarProps> = ({ toggleDarkMode, isDarkMode, onNotificationClick, loggedIn, setLoggedIn,  }) => {
  const [isSignUpOpen, setIsSignUpOpen] = useState<boolean>(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const togglePopover = () => setIsPopoverOpen(!isPopoverOpen);

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
      setIsPopoverOpen(false);
    }
    catch(err){
      console.error;
    }
  }

  return (
    <header className="flex justify-between items-center py-2 bg-base-100 shadow-md">
      <div className="flex items-center pl-8">
        <img src={HeartwoodLogo} alt="Heartwood Logo" className="h-24 w-auto" />

      </div>
      <div className="flex items-center space-x-4 px-2"> {/* This div wraps the buttons */}
        <button onClick={toggleDarkMode} className="btn btn-secondary">
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>
        <button onClick={onNotificationClick} className="btn btn-primary">
          <FaBell />
        </button>
        <div className="relative">
          {loggedIn ? (
            <>
              <button onClick={togglePopover} className="btn btn-circle bg-gray-500 hover:bg-gray-600 text-white">
                <FaUser />
              </button>
              {isPopoverOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-base-200 shadow-lg rounded-lg p-4 z-50">
                  <p className="text-sm text-gray-500 mb-2">
                    Logged in as <span className="font-semibold text-gray-700">USER</span>
                  </p>
                  <div className="flex justify-center">
                  <button
                    onClick={logout}
                    className="btn btn-outline btn-error btn-sm"
                  >
                    Logout
                  </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <button onClick={toggleSignUp} className="btn btn-ghost">
              Sign Up
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