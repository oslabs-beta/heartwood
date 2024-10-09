import React, { useState, useEffect } from 'react';
import HeaderBar from '../components/HeaderBar';
import SideNav from './SideNav';
import Login from '../components/Login';



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

  // Function to check if a user has an active session
  useEffect(() => {
    async function checkLoginStatus() {
      console.log('checking if a user is logged in')
      try {
        // Call a function to main.js and get true or false 
        const isLoggedIn = await window.api.checkLoginStatus();
        console.log('status is', isLoggedIn)
        // If return value is true, set LoggedIn as true. 
        if (isLoggedIn) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    }
  
    checkLoginStatus();
  }, []);

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
