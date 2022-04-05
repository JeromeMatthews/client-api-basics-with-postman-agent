
module.exports = (err, req, res, next) => {

    //err is the error object we access when creating errors to use.
    err.statusCode = err.statusCode || 500; // Defining a default error status code in the event that a given error is encountered and the error does not get assigned any code. This is to account for errors not created from us.
    err.status = err.status || 'Error - Something went wrong on the server.';
    // Defining a default status, similar to the default error code.
  
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  };

  