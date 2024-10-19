export type CustomError = {
  log: string;
  status: number;
  message: string | { err: string };
}

export interface LoginCredential {
  username: String;
  password: String;
}

export interface SingupCredential {
  username: String;
  password: String;
  email: String;
}