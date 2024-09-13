import React, { useState, useEffect } from 'react';
import HeaderBar from '../components/HeaderBar.jsx';
import SideNav from './SideNav.jsx';
import Login from "../components/Login";

const Layout = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false); // Add login status state

  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');  

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

  const githubOauth = () => {
    window.api.startGitHubAuth()
      .then(token => {
        console.log('GitHub Token:', token);
       
      })
      .catch(err => {
        console.error('GitHub Auth Error:', err);
      });
      setLoggedIn(true)
  };
  
  const userSubmit = async (username, password) => {
  
      try {
          console.log(username, password)
          const result = await window.api.login(username, password);
          console.log('Login success, token value is:', result);
        } catch (error) {
          console.error('Login error:', error);
        }
  }

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
        <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="card w-full max-w-md p-8 shadow-lg bg-white">
            <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
            
            <label className="input input-bordered flex items-center gap-2 mb-4">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
            >
                <path
                d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z"
                />
            </svg>
            <input type="text" className="grow" placeholder="Username" value={username} onChange={(e) => setUserName(e.target.value)}/>
            </label>


            <label className="input input-bordered flex items-center gap-2 mb-6">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
            >
                <path
                fillRule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clipRule="evenodd"
                />
            </svg>
            <input type="password" className="grow" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            </label>

            <label className="submit flex items-center gap-2">
                <button className="btn  w-full rounded" onClick={() => userSubmit(username, password)}>Submit</button>
            </label>

            <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
            </div>


            <button id="githubBtn" className="btn btn-primary rounded flex items-center justify-center gap-2 w-full" onClick={githubOauth}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6"
            >
                <path
                fillRule="evenodd"
                d="M12 .296C5.376.296 0 5.672 0 12.302c0 5.3 3.438 9.795 8.205 11.387.6.111.82-.261.82-.577 0-.286-.011-1.045-.017-2.05-3.338.727-4.042-1.611-4.042-1.611-.546-1.386-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 1.205.084 1.838 1.238 1.838 1.238 1.07 1.834 2.809 1.305 3.493.997.107-.775.42-1.305.763-1.605-2.665-.302-5.467-1.336-5.467-5.94 0-1.311.469-2.384 1.238-3.224-.125-.303-.536-1.522.117-3.172 0 0 1.009-.322 3.31 1.23a11.456 11.456 0 0 1 3.012-.405c1.021.004 2.048.137 3.012.405 2.3-1.552 3.31-1.23 3.31-1.23.654 1.65.243 2.869.118 3.172.77.84 1.238 1.913 1.238 3.224 0 4.61-2.805 5.634-5.476 5.93.431.371.815 1.104.815 2.226 0 1.606-.014 2.9-.014 3.293 0 .318.218.694.825.576C20.565 22.1 24 17.605 24 12.302 24 5.672 18.624.296 12 .296z"
                clipRule="evenodd"
                />
            </svg>
            Login via GitHub
            </button>
        </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
