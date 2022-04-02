const express = require('express');
const app = express();
const morgan = require('morgan');
const cityRoutes = require('./routes/cityroutes');

app.use('/api/v1/cities', cityRoutes);
app.all('*', (req, res, next) => {
  res
    .status(404)
    .json({
      status: 'fail',
      message: `Can't find ${req.originalUrl}on this server`,
    });
});

// ------------------------------------------------------------
/* All app related middleware 
 1- Morgan - detailed server logging:
*/
//==----------------------------------------------------------------
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}



module.exports = app;
