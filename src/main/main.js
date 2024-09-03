// Import 'app' and 'BrowserWindow' module 
// 'app' controls the application's lifecycle
// 'BrowserWindow' creates and manages application windows
const { app, BrowserWindow, ipcMain } = require('electron');
const OAuth2 = require('electron-oauth2');
require('dotenv').config();

// Include the Node.js 'path' module at the top of your file
// 'path' is used to handle and transform file paths
const path = require('node:path');

const { fork } = require('child_process');

let mainWindow;
let serverProcess;



const githubOAuthConfig = {
    clientId:  process.env.GITHUB_CLIENTID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET ,
    authorizationUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    useBasicAuthorizationHeader: false,
    redirectUri: 'http://localhost:8080/home'
};
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

  createWindow();
  startServer();

  // Open a window if none are open on macOS when the application is activated
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })


  ipcMain.handle('start-github-auth', async () => {
    try {
        const token = await githubOAuth.getAccessToken({ scope: 'user repo' });
        return token;
    } catch (err) {
        console.error('OAuth error:', err);
        throw err;
    }
  });
})



// Use 'process' globals's platform attribute to run code for each opearting system 

// Handle the 'window-all-closed' event
// Quit the app when all windows are closed, except on macOS
// On macOS, it's common for applications to stay active even without open windows
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
});
