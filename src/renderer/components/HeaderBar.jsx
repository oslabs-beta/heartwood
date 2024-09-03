import React from 'react';

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
        <div className="avatar">
          <div className="w-10 rounded-full">
            user
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderBar;
