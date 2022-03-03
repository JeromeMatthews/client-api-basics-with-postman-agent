const express = require('express');
const app = express();
const cityRoutes = require('./routes/cityroutes');

app.use('/api/v1/cities', cityRoutes);
app.use('/api/v1/cities', cityRoutes);


module.exports = app;
