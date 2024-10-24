const { contextBridge, ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  // [TO DO] test type is any for now, research later 
  const replaceText = (selector: string, text: any) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
})

contextBridge.exposeInMainWorld('api', {
  startGitHubAuth: (code: string) => {
    console.log('code in preload is ', code)
    ipcRenderer.invoke('start-github-auth', { code })
  },
  //startAuth: () => ipcRenderer.invoke('start-auth'),
  login: (username: string, password: string) => ipcRenderer.invoke('login', { username, password }),
  signUp: (username: string, password: string, email: string) => ipcRenderer.invoke('signUp', { username, password, email }),
  getInvocations: (period: number, duration: number) => ipcRenderer.invoke('getInvocations', period, duration),
  getErrors: (period: number, duration: number) => ipcRenderer.invoke('getErrors',period, duration),
  getThrottles: (period: number, duration: number) => ipcRenderer.invoke('getThrottles',period, duration),
  getDuration: (period: number, duration: number) => ipcRenderer.invoke('getDuration',period, duration),
  checkAuthToken: () => ipcRenderer.invoke('check-auth-token'),
  addCredential: (accessKey: string, secretAccessKey: string, region: string) => ipcRenderer.invoke('addCredential', accessKey, secretAccessKey, region),
  checkLoginStatus: () => ipcRenderer.invoke('checkLoginStatus'),
  logout: () => ipcRenderer.invoke('logout'),
});
