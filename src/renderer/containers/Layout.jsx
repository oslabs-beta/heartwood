import React, { useState, useEffect } from 'react';
import HeaderBar from '../components/HeaderBar.jsx';
import SideNav from './SideNav.jsx';
import Login from '../components/Login.jsx';



const Layout = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false); // Add login status state
  
  // const [username, setUserName] = useState('');
  // const [password, setPassword] = useState('');

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'retro' : 'coffee');
  };

  useEffect(() => {
    // Set the initial theme on mount
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'coffee' : 'retro');

    // Check if the user is already logged in (session or cookie check)
    // window.api.checkAuthToken()
    // .then(isAuthenticated => {
    //   setLoggedIn(isAuthenticated);
    // })
    // .catch(err => {
    //   console.error('Error checking authentication:', err);
    // });
  }, [isDarkMode]);

  const handleNotificationClick = () => {
    // Handle notification logic here
  };

  const githubOauth = () => {
    window.api.startGitHubAuth()
      .then(() => {
        console.log('GitHub Token:', token);
        
      })
      .catch(err => {
        console.error('GitHub Auth Error:', err);
      });
      setLoggedIn(true);
  };

  const userSubmit = async (username, password) => {
    try {
      console.log(username, password);
      const result = await window.api.login(username, password);
      console.log('Login success, user value is:', result);
      setLoggedIn(true);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderBar
        toggleDarkMode={toggleDarkMode}
        isDarkMode={isDarkMode}
        onNotificationClick={handleNotificationClick}
      />

      {loggedIn ? (
        <SideNav />  
      ) : ( 
        <Login githubOauth = {githubOauth}
                userSubmit = {userSubmit}
        />
      )}


    </div>
  );
};

export default Layout;
