const AppError = require('../utils/appError');
//Mongoose specific error handling, these are also deemed to be operational type errors
//----------------------------------------------------------------
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value ${value}, Please enter another value!`;
  return new AppError(message, 400);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = (err) => {
  return new AppError('Invaild token, please login again', 401);
};

const handleTokenExpiredError = (err) => {
  return new AppError('Your token has expired, please login again', 401);
};
//----------------------------------------------------------------

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err, res) => {
  //Operational, trusted error: send message to the client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    //Programming or other unknown error. Don't leak error details.
  } else {
    //1 log the error objecct
    console.error('ERROR 💥', err);

    //2 Send generic error message

    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

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
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.create(err);
    //this is a destruction of the error object from the server so it can be reassigned to the parameters outlined for our error handling middleware. The defualt is called err and we are chaning it to error, and using let, as the object will be changed later

    //-------------------------------

    /*Mongoose specific error handling functions, we handle them so they can be defined with the isOperational flag, to indictate they should be represented by the client side in a user friendly presentation. 

        To do so, we have to place the isOperational flag (boolean assignment: this.IsOperational = true on our internally defined global error handling class) - on the error object coming from mongoose, which is why we have to destruct the error object: {...err} and then place it into the let error variable before conducting the if check for any mongoose specific errors in the handlers/functions below: */

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    //Cast error handling for incorrectly entered paths (inputs) from the client side.
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);

    if (error.name === 'ValidationError') handleValidationError(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
    if (error.name === 'TokenExpiredError')
      error = handleTokenExpiredError(error);
    sendErrorProd(error, res);
  }
};
