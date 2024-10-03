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

// [To do] Add this block for auto-reloading in development 
// if (process.env.NODE_ENV === 'development') {
//   try {
//     require('electron-reloader')(module, {
//       debug: true,
//       watchRenderer: false
//     });
//   } catch (_) { console.log('Error'); }
// }

// below code shows local host as cookie url 
const express = require('express');
const server = express();server.use(express.static(path.join(__dirname, '..', '..', 'dist')));

const http = require('http');
const httpServer = http.createServer(server);
httpServer.listen(3000, () => {
  console.log(`Server running at http://localhost:3000`);
});
// const server = http.createServer(app);
// server.listen(8080, () => {
//   console.log('Server listening on http://localhost:8080');
// });

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
  //mainWindow.loadFile(path.join(__dirname, '..', '..', 'dist', 'index.html')); 
  mainWindow.loadURL(`http://localhost:3000/`);
}

function startServer() {
  serverProcess = fork(path.join(__dirname, '..', 'server', 'server.js'));
  
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

  // // TEST: Register 'app' protocol 
  // protocol.registerHttpProtocol('app', (request, callback) => {
  //   callback({
  //     url: request.url.replace('app://', 'http://')
  //   });
  // });

  // COMMENTED OUT THE FOLLOWING FOR NOW
  
  // session.defaultSession.cookies.get({ name: 'auth_token' })
  // .then(cookies => {
  //   if (cookies.length > 0) {
  //     console.log('User is already logged in');

  //     mainWindow.webContents.send('login-status', { loggedIn: true });
  //   } else {
  //     console.log('No token found. User is not logged in.');

  //     mainWindow.webContents.send('login-status', { loggedIn: false });
  //   }
  // })
  // .catch(err => {
  //   console.error('Error checking for auth token:', err);
  // });

  createWindow();
  startServer();
})

// -----------------------------------------
// handles github oAuth
// -----------------------------------------

ipcMain.handle('start-github-auth', async () => {

  try {
    const token = await axios.post('http://localhost:3000/user/github');


  }
  catch (err){
    console.log('error for githubin main.js')
  }
})


// // github Oauth config, specific to our application 
// const githubOAuthConfig = {
//   clientId:  process.env.GITHUB_CLIENTID,
//   clientSecret: process.env.GITHUB_CLIENT_SECRET ,
//   authorizationUrl: 'https://github.com/login/oauth/authorize',
//   tokenUrl: 'https://github.com/login/oauth/access_token',
//   useBasicAuthorizationHeader: false,
//   redirectUri: 'http://localhost:3000'
// };
// // create oauth instance 
// const oauth2 = new OAuth2(githubOAuthConfig);
// //const githubOAuth = oauth2(githubOAuthConfig);

// ipcMain.handle('start-github-auth', async () => {
//   try {
//     console.log('hit github oauth');

//     try{
//       const token = await oauth2.getAccessToken({ scope: 'read:user' });
//       access_token = token.access_token;

//       try {
//         const response = await axios.post('http://localhost:3000/user/saveToken', { access_token});
//         return 
//       } catch (error) {
//         console.log('save token error', error);
//       }
      
//           // Store the token in a cookie
//       session.defaultSession.cookies.set({
//       url: 'http://localhost3000',
//       name: 'auth_token',
//       value: token.accessToken,
//       expirationDate: Date.now() / 1000 + 3600, 
//       httpOnly: true,
//     });

//     console.log(token)



//     return token;
//     }
//     catch{ return

//     }


//         // Make a request to GitHub API to get the logged-in user's information
//         // const userInfoResponse = await axios.get('https://api.github.com/user', {
//         //   headers: {
//         //     Authorization: `Bearer ${token.accessToken}`,
//         //   },
//         // });
    
//         // // Extract user information
//         // const userInfo = userInfoResponse.data;
        
//         // console.log(userInfo)


//   } catch (err) {
//     console.error('OAuth error:', err);
//     throw err;
//   }
// });

// -----------------------------------------
// handle login
// -----------------------------------------
ipcMain.handle('login', async (event, { username, password }) => {

  // TODO: get session object from backend, and set cookie to the application using 'session.defaultSession.cookie.set'. 

  try {
    console.log('main.js')
    const token = await axios.post('http://localhost:3000/user/login', { username, password });
    console.log('response',token)

    const cookie = {
      url: 'http://localhost:3000', 
      name: 'token',
      value: token,
      expirationDate: Date.now() / 1000 + 3600, // 1 hour
      httpOnly: true,
      secure: true,
    };
    try {
      await session.defaultSession.cookies.set(cookie);
      //return 'Cookie set successfully';
    } catch (err) {
      console.log(err)
      throw new Error('Failed to set cookie');
    }

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
    session.defaultSession.cookies.get({ url: 'http://localhost/' })
      .then((cookies) => {
        // success to get cookie  
        console.log('get cookie', cookies)
      })
      .catch((error) => {
        console.log('Error to set cookie', error)
      });

    // return something to trigger leaving sign up widget 
    return response.data;
    
  } catch (error) {
    console.error('Sign up failed:', error);
    throw error;
  }
});


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

ipcMain.handle('addCredential', async (event, accessKey, secretAccessKey, region) => {  
  try {

    // Get ssid cookie with `session.defaultSession.cookies.get` method , and pass in request body 

    const response = await axios.post('http://localhost:3000/aws/credential/add', {
      accessKey,
      secretAccessKey,
      region
    });   
  } catch(error) {
    // console.error('Aws Signup Fail:', error);
    throw error;
  }
})


// Use 'process' globals's platform attribute to run code for each opearting system 

// Handle the 'window-all-closed' event
// Quit the app when all windows are closed, except on macOS
// On macOS, it's common for applications to stay active even without open windows
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
});