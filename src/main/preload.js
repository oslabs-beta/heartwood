// Preload Script: A script that runs in a privileged context before the renderer process loads. 

const { contextBridge, ipcRenderer } = require('electron');



window.addEventListener('DOMContentLoaded', () => {

  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
})



contextBridge.exposeInMainWorld('api', {
  startGitHubAuth: () => ipcRenderer.invoke('start-github-auth'),
  //startAuth: () => ipcRenderer.invoke('start-auth'),
  login: (username, password) => ipcRenderer.invoke('login', { username, password }),
  signUp: (username, password, email) => ipcRenderer.invoke('signUp', { username, password, email }),
  getInvocations: () => ipcRenderer.invoke('getInvocations'),
  getErrors: () => ipcRenderer.invoke('getErrors'),
  checkAuthToken: ()=> ipcRenderer.invoke('check-auth-token')
  
});




