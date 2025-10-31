export type TypeCustomError = Error & { status?: number };
type requestErrorDef = (status: number, userMessage: string, serverMessage?: string) => TypeCustomError;
export const requestError: requestErrorDef = (status, userMessage, serverMessage = 'Error') => {
  const err: TypeCustomError = new Error(userMessage);
  err.name = serverMessage;
  err.status = status;
  return err;
};
