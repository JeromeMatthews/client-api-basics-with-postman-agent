const express = require('express');
const app = express();
const morgan = require('morgan');
const cityRoutes = require('./routes/cityroutes');
const userRoutes = require('./routes/userroutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

//allows the application to parse the incoming requests that are in Json format.
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/cities', cityRoutes);
app.use('/api/v1/users', userRoutes);

app.all('*', (req, res, next) => {
  // // We create a new Error object instance and make the message, status, and statusCode properties on it, then pass it to the global Error handler we createed by passing the error object as a parameter to the next() function;
  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;

  //THIS IS HOW WE ROUTE ALL ERRORS INTO THE GLOBAL ERROR APPLICATION ERROR HANDLER ONCE CREATED. This will SKIP ALL OTHER MIDDLEWARE and go to our error handling middleware.

  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// ------------------------------------------------------------
/* All app related middleware 
 1- Morgan - detailed server logging:
*/
//==----------------------------------------------------------------
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//ERROR HANDLING middleware
//To create errr handling middleware we use the app.use() method and pass err as the first argument to the middleware function.
app.use(globalErrorHandler);

module.exports = app;
