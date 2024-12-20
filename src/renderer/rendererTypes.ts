/*
Error interface
*/

export type CustomError = {
  log: string;
  status: number;
  message: string | { err: string };
};

export type Functions = string[];

export type LogStreams = string[];

/*
Props interface 
*/

export interface DonutChartProps {
  data: number[];
  labels: string[];
}

export interface HeaderBarProps {
  toggleDarkMode: () => void;
  isDarkMode: boolean;
  onNotificationClick: () => void;
  loggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
}

export interface LineChartProps {
  data: number[];
  labels: string[];
  xaxis: 'hour' | 'day' | 'week' | 'month' | 'year';
}

export type Xaxis = 'hour' | 'day' | 'week' | 'month' | 'year'

export interface LoginProps {
  githubOauth: () => void;
  userSubmit: (username: string, password: string) => void;
}

export interface signUpProps {
  onSignUpSuccess: () => void;
  toggleSignUp: () => void;
  setLoggedIn: (loggedIn: boolean) => void;
}

export interface Log {
  message: string;
  timestamp: string;
}


export type FormEvent = React.ChangeEvent<HTMLInputElement | HTMLSelectElement>;

export interface Credentials {
  accessKey: string,
  secretAccessKey: string,
  maskedSecretAccessKey: string,
  region: string,
}

/*
Response object interface
*/

// Session interface for response object 
export interface Session {
    name: string,
    value: string,
    url: string,
    expirationDate?: string // date string??
    
}   

/*
API response & ElectronAPI interface 
*/

// Generic API response type
export interface ApiResponse<T> {
    data?: T; // data holds actual data returned by API
    label: string[];
    status: number; 
    error?: string; // if response has an error 
}

// ElectronAPI types
interface ElectronAPI {
  // TODO: revise arguments for AWS functions (e.g., getInvocation) 
  getInvocations: (period: string, duration: string, selectedFunction: string) => Promise<ApiResponse<any>>; // Temp any, check returned data to specify later
  getErrors: (period: string, duration: string, selectedFunction: string) => Promise<ApiResponse<any>>;
  getThrottles: (period: string, duration: string, selectedFunction: string) => Promise<ApiResponse<any>>;
  getDuration: (period: string, duration: string, selectedFunction: string) => Promise<ApiResponse<any>>;
  checkLoginStatus: () => Promise<ApiResponse<boolean>>;
  signUp: (username: string, password: string, email: string) => Promise<ApiResponse<Session>>
  login: (username: string, password: string) => Promise<ApiResponse<Session>>
  startGitHubAuth: () => Promise<ApiResponse<Session>> // Temporary code. [TO DO] need to fix the function first, and revise the type. 
  addCredential: (accessKey: string, secretAccessKey:string, region:string) => Promise<ApiResponse<any>>
  logout: () => Promise<ApiResponse<void>>;
  getLambdaLogEvents: (functionName: string, logStreamName: string) => Promise<ApiResponse<any>>;
  getFunctionNameList: () => Promise<ApiResponse<any>>;
  getUserName: () => Promise<ApiResponse<string>>;
  getLambdaLogStreams: (functionName: string) => Promise<ApiResponse<any>>;
  
}

// Extend the global window interface 
declare global {
    interface Window {
        api: ElectronAPI;
    }
}