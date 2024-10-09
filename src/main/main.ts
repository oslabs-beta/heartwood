// Import 'app' and 'BrowserWindow' module 
// 'app' controls the application's lifecycle
// 'BrowserWindow' creates and manages application windows
// ipcMain: communication between the main process and the renderer process 
const { app, BrowserWindow, ipcMain, session } = require('electron');
// electron build in oauth 2.0
const OAuth2 = require('electron-oauth2');
require('dotenv').config();

// Include the Node.js 'path' module at the top of your file
// 'path' is used to handle and transform file paths
const path = require('node:path');
const axios = require('axios');

const { fork } = require('child_process');

let mainWindow;
let serverProcess;

// Declare a 'createWindow' function that loads 'index.html' into a new BrowserWindow instance
// This function is responsible for creating the main application window
const createWindow = () => {
  // Create a new BrowserWindow instance with specified width and height
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // // Preload script, useful for exposing APIs to the renderer process
    },
  })

  // Load the 'index.html' file into the BrowserWindow
  // The bundled HTML file is located in the 'dist' directory, two levels up from the current directory
  // mainWindow.loadFile(path.join(__dirname, '..', '..', 'dist', 'index.html')); 
  mainWindow.loadFile(path.join(__dirname, '..', 'renderer', 'index.html'));

  //mainWindow.loadURL(`http://localhost:8080/`);
}

function startServer() {
  serverProcess = fork(path.join(__dirname, '..', '..', 'dist', 'server', 'server.js'));

  serverProcess.on('message', (message) => {
    console.log('Message from server:', message);
  });
}

// Wait for 'ready' event and invoke createWindow and startServer function
// 'app.whenReady()' ensures that the code runs only when Electron has fully initialized
app.whenReady().then(() => {

  // Open a window if none are open on macOS when the application is activated
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  createWindow();
  startServer();
})

// -----------------------------------------
// handles github oAuth
// -----------------------------------------

// github Oauth config, specific to our application 
const githubOAuthConfig = {
  clientId:  process.env.GITHUB_CLIENTID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET ,
  authorizationUrl: 'https://github.com/login/oauth/authorize',
  tokenUrl: 'https://github.com/login/oauth/access_token',
  useBasicAuthorizationHeader: false,
  redirectUri: 'http://localhost:3000'
};
// create oauth instance 
const oauth2 = new OAuth2(githubOAuthConfig);
//const githubOAuth = oauth2(githubOAuthConfig);

ipcMain.handle('start-github-auth', async () => {
  try {
    console.log('hit github oauth');

    try{
      const token = await oauth2.getAccessToken({ scope: 'read:user' });
      access_token = token.access_token;

      try {
        const response = await axios.post('http://localhost:3000/user/saveToken', { access_token});
        return 
      } catch (error) {
        console.log('save token error', error);
      }
      
          // Store the token in a cookie
      session.defaultSession.cookies.set({
      url: 'http://localhost3000',
      name: 'auth_token',
      value: token.accessToken,
      expirationDate: Date.now() / 1000 + 3600, // expires in 1 hour
      httpOnly: true,
    });

    console.log(token)



    return token;
    }
    catch{ return

    }


        // Make a request to GitHub API to get the logged-in user's information
        // const userInfoResponse = await axios.get('https://api.github.com/user', {
        //   headers: {
        //     Authorization: `Bearer ${token.accessToken}`,
        //   },
        // });
    
        // // Extract user information
        // const userInfo = userInfoResponse.data;
        
        // console.log(userInfo)


  } catch (err) {
    console.error('OAuth error:', err);
    throw err;
  }
});

// -----------------------------------------
// handle login
// -----------------------------------------

ipcMain.handle('login', async (event, { username, password }) => {

  try {
    const response = await axios.post('http://localhost:3000/user/login', { username, password });
    const sessionObject = response.data; 

    // Set a cookie 
    session.defaultSession.cookies.set(sessionObject)
      .then(() =>{
        // Success
        console.log('main.js login function - login success')
      }, (error) =>{
        console.log('login cookie is not working', error);
      })

    return true;
    
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }

});

// -----------------------------------------
// handle sign up
// -----------------------------------------

ipcMain.handle('signUp', async (event, { username, password, email }) => {
  try {
    // Save user information to database, and receive a session object
    const response = await axios.post('http://localhost:3000/user/signUp', { username, password, email });
    const sessionObject = response.data; 

    console.log('sessio object in signup Main', sessionObject)

    // Set a cookie to the application 
    session.defaultSession.cookies.set(sessionObject)
      .then(() => {
        // success
        console.log('sucess to set a cookie');
      }, (error) => {
        console.log('failed to set a cookie', error);
      })

    // TEST CODE: Check if cookie is set to the application 
    // session.defaultSession.cookies.get({ url: 'http://localhost/' })
    //   .then((cookies) => {
    //     // success to get cookie  
    //     console.log('get cookie', cookies)
    //   })
    //   .catch((error) => {
    //     console.log('Error to set cookie', error)
    //   });

    // return something to trigger leaving sign up widget 
    return response.data;
    
  } catch (error) {
    console.error('Sign up failed:', error);
    throw error;
  }
});

// -----------------------------------------
// Check logged-in status
// -----------------------------------------

ipcMain.handle('checkLoginStatus', async (event) => {
  try {
    const cookies = await session.defaultSession.cookies.get({ url: 'http://localhost/' });

    const expirationDate = cookies[0].expirationDate;
    const expirationDateInMs = expirationDate * 1000; // Convert to Ms
    const expirationDateTime = new Date(expirationDateInMs); // Convert to DataTime 
    const today = new Date();

    console.log('expiration date time', expirationDateTime);
    console.log('today', today)

    if (expirationDateTime >= today) {
      console.log("The expiration date is in the future.");
      return true;
    } else {
      console.log("The expiration date has passed.");
      return false;
    };
    
    // return cookies[0].expirationDate > Date.now();
    return false; // TEST
  } catch (error) {
    console.error('Error checking user login status', error);
    return false; // Return false in case of error
  }
});


// -----------------------------------------
// handle AWS credential registration 
// -----------------------------------------

ipcMain.handle('addCredential', async (event, accessKey, secretAccessKey, region) => {  
  try {
    // Retrieve the ssid cookie 
    const cookies = await session.defaultSession.cookies.get({ url: 'http://localhost/' });
    const ssid = cookies[0].value;

    // Send a POST request to add AWS credentials associated with the user's session
    const response = await axios.post('http://localhost:3000/aws/credential/add', {
      accessKey,
      secretAccessKey,
      region,
      ssid,
    }); 

    // Consider returning the response data if needed by the caller
    // return response.data 

  } catch(error) {
    console.error('Failed to add AWS credentials:', error);
    // Consider returning error logs if needed by the caller
    // return { success: false, error: error.message };
  }
})


// -----------------------------------------
// handle AWS metrics
// -----------------------------------------


ipcMain.handle('getInvocations', async () => {
  try {
    const response = await axios.get('http://localhost:3000/aws/metric/invocation');
    console.log('Invocations response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in getInvocations:', error.message);
    throw error;
  }
});

ipcMain.handle('getErrors', async () => {
  try {
    const response = await axios.get('http://localhost:3000/aws/metric/error');
    console.log('Errors response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in getErrors:', error.message);
    throw error;
  }
});

ipcMain.handle('getThrottles', async () => {
  try {
    const response = await axios.get('http://localhost:3000/aws/metric/throttle');
    return response.data;
  } catch (error) {
    console.error('Error in getThrottles:', error.message);
    throw error;
  }
});

ipcMain.handle('getDuration', async () => {
  try {
    const response = await axios.get('http://localhost:3000/aws/metric/duration');
    return response.data;
  } catch (error) {
    console.error('Error in getDuration:', error.message);
    throw error;
  }
});



// Use 'process' globals's platform attribute to run code for each opearting system 

// Handle the 'window-all-closed' event
// Quit the app when all windows are closed, except on macOS
// On macOS, it's common for applications to stay active even without open windows
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
});