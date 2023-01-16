module.exports = (status, userMessage, serverMessage = 'Error') => {
  const err = new Error(userMessage);
  err.name = serverMessage;
  err.status = status;
  return err;
};
