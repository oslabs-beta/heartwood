import React, { useState, useEffect } from 'react';
import Layout from './Layout';


const App = () => {
  // const [loggedIn, setLoggedIn] = useState(false); // Add login status state
  // useEffect(() => {
 
  //   window.api.onLoginStatus((status) => {
  //     setLoggedIn(status.loggedIn);
  //     console.log(status.loggedIn)
  //   });
  // }, []);

  const [theme, setTheme] = useState('light'); 

  return (
    <div className="App min-h-screen" data-theme={theme}>
    <Layout/>
    </div>
  );
};

export default App;

