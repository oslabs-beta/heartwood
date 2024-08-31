import React, { useState, useEffect } from 'react';
import HeaderBar from '../components/HeaderBar.jsx';
import SideNav from './SideNav.jsx';

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'retro' : 'coffee');
  };

  useEffect(() => {
    // Set the initial theme on mount
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'coffee' : 'retro');
  }, [isDarkMode]);

  const handleNotificationClick = () => {
    // Handle notification logic here
  };

  return (
    <div className="App">
      <HeaderBar
        toggleDarkMode={toggleDarkMode}
        isDarkMode={isDarkMode}
        onNotificationClick={handleNotificationClick}
      />
      <SideNav />
    </div>
  );
};

export default App;

