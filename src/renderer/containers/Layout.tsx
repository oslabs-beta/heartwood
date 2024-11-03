import React, { useState, useEffect } from 'react';
import HeaderBar from '../components/HeaderBar';
import SideNav from './SideNav';
import Login from '../components/Login';
import { ApiResponse, Session } from '../rendererTypes';



const Layout: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [loggedIn, setLoggedIn] = useState<boolean>(false); // Add login status state



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
        const isLoggedIn: ApiResponse<boolean> = await window.api.checkLoginStatus();
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
    console.log('front end githubOau')
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

// commented out for now because pf type error. 
//   const fetchCode = async () => {
//     const code: any = await handleGitHubCallback();
//     //console.log('code is this :)', code);

//     if (code) {
//        //console.log('does code exist?', code);
  
//         const isLoggedIn = await window.api.startGitHubAuth(code);
//         console.log('status is', isLoggedIn)
//         setLoggedIn(true)

//     }
// };

//  fetchCode();


  // const githubOauth = () => {
  //   window.api.startGitHubAuth()
  //     .then(() => {
  //       // console.log('GitHub Token:', token);

  //     })
  //     .catch(err => {
  //       console.error('GitHub Auth Error:', err);
  //     });
  //   setLoggedIn(true);
  // };

  // Function to make a post request to log in 
  const userSubmit = async (username: string, password: string) => {
    try {
      const result: ApiResponse<Session> = await window.api.login(username, password);
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
        loggedIn = {loggedIn}
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
