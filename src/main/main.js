// Import 'app' and 'BrowserWindow' module 
// 'app' controls the application's lifecycle
// 'BrowserWindow' creates and manages application windows
// ipcMain: communication between the main process and the renderer process
const { app, BrowserWindow, ipcMain } = require('electron');
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

let mainWindow;
let serverProcess;
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
  mainWindow.loadFile(path.join(__dirname, '..', '..', 'dist', 'index.html')); 
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

  createWindow();
  startServer();
})

ipcMain.handle('start-github-auth', async () => {
  try {
      console.log('hit github oauth')
      const token = await oauth2.getAccessToken({ scope: 'read:user' });
      
      console.log(token)
      return token;
  } catch (err) {
      console.error('OAuth error:', err);
      throw err;
  }
});

ipcMain.handle('login', async (event, { username, password }) => {

  try {
    console.log('main.js')
    const response = await axios.post('http://localhost:3000/login', { username, password });
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
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
