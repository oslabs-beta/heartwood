import React, { useState, useEffect } from 'react';
import HeaderBar from '../components/HeaderBar.jsx';
import SideNav from './SideNav.jsx';
import Login from '../components/Login.jsx';



const Layout = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false); // Add login status state

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


  /* TODO 
    https://trello.com/c/S1GYcGZn/55-if-a-user-is-already-logged-in-skip-the-auth-page-and-redirect-to-dashboard
    implement function to check if a user is logged in based on session in database.
    if there's valid session (session's expiration date is after today's date), change 'loggedIn' state to true, triggering to change the layout to sideNav
  */

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

  // Function to make a post request to log in 
  const userSubmit = async (username, password) => {
    try {
      const result = await window.api.login(username, password);
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
        setLoggedIn={setLoggedIn}
      />

      {loggedIn ? (
        <SideNav /> 
      ) : (
        <Login 
          githubOauth={githubOauth}
          userSubmit={userSubmit}
        />
      )}


    </div>
  );
};

export default Layout;
