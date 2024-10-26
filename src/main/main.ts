// -----------------------------------------
// Import
// -----------------------------------------

import { app, BrowserWindow, IpcMain, ipcMain, session } from 'electron';
import { IpcMainInvokeEvent } from 'electron';
import { CustomError, LoginCredential, SingupCredential } from "./mainTypes";
import path from 'node:path';
import axios from 'axios';
import { fork } from 'child_process';
const OAuth2 = require('electron-oauth2');
require('dotenv').config();


// -----------------------------------------
// Window Management
// -----------------------------------------

let mainWindow;
let serverProcess;

// Create and configure the main application window 
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Load the 'index.html' file into the BrowserWindow
  mainWindow.loadFile(path.join(__dirname, '..', 'renderer', 'index.html'));
}

function startServer() {
  serverProcess = fork(path.join(__dirname, '..', '..', 'dist', 'server', 'server.js'));

  serverProcess.on('message', (message: any) => {
    console.log('Message from server:', message);
  });
}


// -----------------------------------------
// Application Lifecycle
// -----------------------------------------

// Initialize the app when ready 
app.whenReady().then(() => {

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  createWindow();
  startServer();
});

// Quit the app when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
});

// -----------------------------------------
// IPC Main Handlers - Authentication 
// -----------------------------------------

// Githab OAuth Autentication 
ipcMain.handle('start-github-auth', async (event, {code}) => {

  console.log('reached main.js github code is', code)

  try {
    const response = await axios.post('http://localhost:3000/user/github', {code: code});
    const sessionObject = response.data; 

    // Set a cookie 
    session.defaultSession.cookies.set(sessionObject)
      .then(() =>{
        // Success
        console.log('main.js login function - login success')
      }, (error: CustomError) =>{
        console.log('login cookie is not working', error);
      })

    return true;

  }
  catch (err){
    console.log('error for githubin main.js')
  }
});


// User login 
ipcMain.handle('login', async (event: IpcMainInvokeEvent, { username, password }: LoginCredential): Promise<boolean> => {
  try {
    const response = await axios.post('http://localhost:3000/user/login', { username, password });
    const sessionObject = response.data; 
    
    await session.defaultSession.cookies.set(sessionObject);
    return true;
    
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
});


// User signup 
ipcMain.handle('signUp', async (event: IpcMainInvokeEvent, { username, password, email }: SingupCredential): Promise<boolean> => {
  try {
    const response = await axios.post('http://localhost:3000/user/signUp', { username, password, email });
    const sessionObject = response.data; 

    await session.defaultSession.cookies.set(sessionObject);
    return true;
    
  } catch (error) {
    console.error('Sign up failed:', error);
    throw error;
  }
});


// Check login status  
ipcMain.handle('checkLoginStatus', async (event: IpcMainInvokeEvent): Promise<boolean> => {
  try {
    const cookies = await session.defaultSession.cookies.get({ url: 'http://localhost:3000/' });
    await checkCookie(); // TEST CODE: check if cookie exists

    if (!cookies[0]) return false;
    
    const expirationDate = cookies[0].expirationDate ?? 0;
    const expirationDateInMs = expirationDate * 1000; // Convert to Ms
    const expirationDateTime = new Date(expirationDateInMs); // Convert to DataTime 
    const today = new Date();

    console.log('expiration date', expirationDateTime);
    console.log('today', today)

    if (expirationDateTime >= today) {
      console.log("The expiration date is in the future.");
      return true;
    } else {
      console.log("The expiration date has passed.");
      return false;
    };
    
  } catch (error) {
    console.error('Error checking user login status', error);
    return false; // Return false in case of error
  }
});

// Logout
ipcMain.handle('logout', async () => {
  try {
    const ssid = await getSSIDFromCookie();
    const response = await axios.delete('http://localhost:3000/user/logout', {
      params: {
        ssid: ssid,
      }
    });

    await session.defaultSession.cookies.remove('http://localhost:3000/', 'ssid');
    await checkCookie(); // TEST CODE: check if cookie exists
  }
  catch(error:any){
    console.error('Error in logout (main.ts):', error.message);
  }
})

// -----------------------------------------
// IPC Main Handlers - AWS 
// -----------------------------------------

// Add AWS credential 
ipcMain.handle('addCredential', async (event: IpcMainInvokeEvent, accessKey: string, secretAccessKey: string, region: string): Promise<void> => {  
  try {
    const ssid = await getSSIDFromCookie();

    const response = await axios.post('http://localhost:3000/aws/credential/add', {
      accessKey,
      secretAccessKey,
      region,
      ssid,
    }); 

  } catch(error) {
    console.error('Failed to add AWS credentials:', error);
  }
});


// Get AWS Lambda function's invocation metric 
ipcMain.handle('getInvocations', async (event: IpcMainInvokeEvent, period: string, duration: string) => {
  try {
    const ssid = await getSSIDFromCookie();
    const response = await axios.get("http://localhost:3000/aws/metric/invocation", {
      params: {
        ssid: ssid,
        period: period,
        duration: duration,
      },
    });
    
    return response.data;

  } catch (error: any) {
    console.error('Error in getInvocations:', error.message);
  }
});


// Get AWS Lambda function's error metric
ipcMain.handle('getErrors', async (event: IpcMainInvokeEvent, period: string, duration: string) => {
  try {
    const ssid = await getSSIDFromCookie();

    const response = await axios.get('http://localhost:3000/aws/metric/error', {
      params: {
        ssid: ssid,
        period: period,
        duration: duration,
      }
    });

    return response.data;

  } catch (error:any) {
    console.error('Error in getErrors:', error.message);
  }
});


// Get AWS Lambda function's throttle metric
ipcMain.handle('getThrottles', async (event: IpcMainInvokeEvent, period: string, duration: string) => {
  try {
    const ssid = await getSSIDFromCookie();

    const response = await axios.get('http://localhost:3000/aws/metric/throttle', {
      params: {
        ssid: ssid,
        period: period,
        duration: duration,
      }
    });
    
    return response.data;
  
  } catch (error: any) {
    console.error('Error in getThrottles:', error.message);
  }
});


// Get AWS Lambda function's duration metric
ipcMain.handle('getDuration', async (event: IpcMainInvokeEvent, period: string, duration: string) => {
  try {
    const ssid = await getSSIDFromCookie();

    const response = await axios.get('http://localhost:3000/aws/metric/duration', {
      params: {
        ssid: ssid,
        period: period,
        duration: duration,
      }
    });

    return response.data;
  } catch (error:any) {
    console.error('Error in getDuration:', error.message);
  }
});


ipcMain.handle('getLambdaLogEvents', async () => {

  try {
    const ssid = await getSSIDFromCookie();
    //console.log("IPC cookies", ssid)

    const response = await axios.get('http://localhost:3000/aws/function/logevents', {
      params: {
        ssid: ssid,
      }
    });

    return response.data;
  } catch (error:any) {
    console.error('Log Events has an error', error.message);
  }
});


//IPC for passing SSID to the getting the aws function 
ipcMain.handle('getFunctionNameList', async() => {
  try {
    const ssid = await getSSIDFromCookie();

    const response = await axios.get('http://localhost:3000/aws/metric/functionlist', {
      params: {
        ssid: ssid,
      }
    }); 

    return response.data;
  } catch(error: any) {
    console.log('FunctionList IPC main has error', error.message)
  }
})

// -----------------------------------------
// IPC Main Handlers - Others 
// -----------------------------------------

ipcMain.handle('getUserName', async () => {
  try {
    const ssid = await getSSIDFromCookie();
    const response = await axios.get('http://localhost:3000/user/username', {
      params: {
        ssid: ssid,
      }
    });
    return {
      data: response.data
    };
  } catch (error: any) {
    console.error('Failed to get username', error.message);
  }
});

// -----------------------------------------
// Helper function 
// -----------------------------------------

// Get SSID from cookie 
const getSSIDFromCookie = async () => {
  const cookies = await session.defaultSession.cookies.get({ url: 'http://localhost/' })
  const ssid: String = cookies[0].value;
  return ssid;
};


// Check cookie
const checkCookie = async () => {
  console.log('checking Cookie...')
  const cookies = await session.defaultSession.cookies.get({ url: 'http://localhost:3000/' });
  cookies[0] ? console.log('cookie exists.', cookies) : console.log('cookie doesn\'t exist.'); 
}


// Use 'process' globals's platform attribute to run code for each opearting system 

// Handle the 'window-all-closed' event
// Quit the app when all windows are closed, except on macOS
// On macOS, it's common for applications to stay active even without open windows
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
});