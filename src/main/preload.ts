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
  getInvocations: (period: string, duration: string, selectedFunction: string) => ipcRenderer.invoke('getInvocations', period, duration, selectedFunction),
  getErrors: (period: string, duration: string, selectedFunction: string) => ipcRenderer.invoke('getErrors',period, duration, selectedFunction),
  getThrottles: (period: string, duration: string, selectedFunction: string) => ipcRenderer.invoke('getThrottles',period, duration, selectedFunction),
  getDuration: (period: string, duration: string, selectedFunction: string) => ipcRenderer.invoke('getDuration',period, duration, selectedFunction),
  checkAuthToken: () => ipcRenderer.invoke('check-auth-token'),
  addCredential: (accessKey: string, secretAccessKey: string, region: string) => ipcRenderer.invoke('addCredential', accessKey, secretAccessKey, region),
  checkLoginStatus: () => ipcRenderer.invoke('checkLoginStatus'),
  logout: () => ipcRenderer.invoke('logout'),
  getLambdaLogEvents: (functionName:string, logStreamName:string) => ipcRenderer.invoke('getLambdaLogEvents', functionName, logStreamName),
  getFunctionNameList: () => ipcRenderer.invoke('getFunctionNameList'),
  getUserName: () => ipcRenderer.invoke('getUserName'),
  getLambdaLogStreams: (functionName: string) => ipcRenderer.invoke('getLambdaLogStreams', functionName)
});
