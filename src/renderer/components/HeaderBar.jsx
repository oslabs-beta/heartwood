import React from 'react';
import Login from "./Login";
import SignUp from "./SignUp";



const HeaderBar = ({ toggleDarkMode, isDarkMode, onNotificationClick }) => {
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

        <button onClick = {()=>{}} className="btn btn-secondary">
          Login
        </button>
        <button onClick = {()=>{}} className="btn btn-secondary">
          SignUp
        </button>


        </div>
      </div>
    </header>
  );
};

export default HeaderBar;
