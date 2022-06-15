//Native packages

const express = require('express');
const path = require('path'); // for setting the default path for the views.
const app = express();

//3rd-Party packages
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
//App specific packages
const cityRoutes = require('./routes/cityroutes');
const userRoutes = require('./routes/userroutes');
const reviewRoutes = require('./routes/reviewroutes');
const viewRoutes = require('./routes/viewroutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

//VIEW SETUP: ENGING AND CONFIGURATION:
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views')); // forms the path to the views folder so app.js can find it.

//Development Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//Limit requests from same API
//Security feature: route access limiting, to prevent Brute force and DOS attacks.
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour.',
});
app.use('/api', limiter);

//Set security on HTTP headers.
app.use(helmet());

// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'", 'data:', 'blob:'],

//       baseUri: ["'self'"],

//       fontSrc: ["'self'", 'https:', 'data:'],

//       scriptSrc: ["'self'", 'https://*.cloudflare.com'],

//       scriptSrc: ["'self'", 'https://*.stripe.com'],

//       frameSrc: ["'self'", 'https://*.stripe.com'],

//       objectSrc: ["'none'"],

//       styleSrc: ["'self'", 'https:', 'unsafe-inline'],

//       workerSrc: ["'self'", 'data:', 'blob:'],

//       childSrc: ["'self'", 'blob:'],

//       imgSrc: ["'self'", 'data:', 'blob:'],

//       upgradeInsecureRequests: [],
//     },
//   })
// );

//BODY PARSER, reading data from body into req.body
//allows the application to parse the incoming requests that are in Json format.
app.use(express.json({ limit: '10kb' })); // passing the limit options to the json function prevent hijacking of the query string.

//COOKIE PARSER, reading the cookie data from the client into the database.
app.use(cookieParser());

app.use(express.static(`${__dirname}/public`));

//Data Sanitization against NoSQL query injection.
app.use(mongoSanitize()); //Filters out all the mongoDB operators - "$"

//Data Sanitization against XSS attacks
app.use(xss()); //Filters out malicous html code , and removes any HTML symbols.

//Preventing Parameter Pollution:
app.use(hpp({ whitelist: [''] }));

app.use('/', viewRoutes);
app.use('/api/v1/cities', cityRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/reviews', reviewRoutes);

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

//ERROR HANDLING middleware
//To create errr handling middleware we use the app.use() method and pass err as the first argument to the middleware function.
app.use(globalErrorHandler);

module.exports = app;
