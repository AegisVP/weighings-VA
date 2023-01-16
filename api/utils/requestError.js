module.exports = (status, userMessage, serverMessage = 'Error') => {
  // const err = {};
  const err = new Error(userMessage);

  // err.message = userMessage;
  // err.name = serverMessage;
  // err.status = status;

  return err;
};
