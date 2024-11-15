// general app response utility for response
const appResponse = (message, success, data) => {
  success ? console.log(message) : console.error(data || message);

  return {
    message,
    success,
    payload: data || {},
  };
};

module.exports = appResponse ;
