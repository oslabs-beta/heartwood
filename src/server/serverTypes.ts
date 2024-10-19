export type CustomError = {
  log: string,
  status: number,
  message: string | {err: string}
};