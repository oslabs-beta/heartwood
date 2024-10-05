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

    // const checkCookie = () => {
    //   console.log(document.cookie)

    //   if (document.cookie) return true 
    //   return false
    // };

    // const isUserLoggedIn = checkCookie(); 
    //setLoggedIn(isUserLoggedIn);

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
    const client_id = "Ov23liX4a6wQpZlCpAu0";
    const redirect_uri = 'http://localhost:3000'; 
    const scope = 'user'; 
    //const redirect_uri = window.location.href
    //console.log(redirect_uri)
   
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${encodeURIComponent(redirect_uri)}&scope=${scope}`;
  
    window.location.href = githubAuthUrl;


    //setLoggedIn(true);
  };

  const handleGitHubCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code'); 

      if (code) {
          //console.log('Code:', code);
          //setLoggedIn(true);
          //window.api.startGitHubAuth(code)
          return code

      } else {
          console.error('Github code not found.');
          return null
      }  
  };

  const fetchCode = async () => {
    const code = await handleGitHubCallback();
    //console.log('code is this :)', code);

    if (code) {
       //console.log('does code exist?', code);
  
        const isLoggedIn = await window.api.startGitHubAuth(code);
        console.log('status is', isLoggedIn)
        setLoggedIn(true)

    }
};

 fetchCode();

  

  // const githubOauth_submit = async() => {

  //   console.log('handle git hub')
  //   githubOauth()
  //   const code = await handleGitHubCallback();
  //   console.log('code is ', code)
  //   window.api.startGitHubAuth()
  // }



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
