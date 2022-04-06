module.exports = (err, req, res, next) => {
  //err is the error object we access when creating errors to use.
  err.statusCode = err.statusCode || 500; // Defining a default error status code in the event that a given error is encountered and the error does not get assigned any code. This is to account for errors not created from us.
  err.status = err.status || 'Error - Something went wrong on the server.';
  // Defining a default status, similar to the default error code.
  //-----------------------------------------------------------------

  //----------------------------------------------
  //Setting up dif reporting senarios based on whether in development or production modes. When in production mode the error reporting is more user friendly and minimal in information issued so as to not leak information. When in development mode the error reporting is more explict to provide as much information as possible for debugging.
  //---------------------------------------------
  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  } else if (process.env.NODE_ENV === 'production') {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
};
