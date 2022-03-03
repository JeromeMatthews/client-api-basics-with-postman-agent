const express = require('express');
const server = express();
const cityRoutes = require('./routes/cityroutes');


server.use('/api/v1/cities', cityRoutes);
server.use('/api/v1/cities', cityRoutes);

// -----------------------------
/*
In order to update/ append any specific city, we need to
be able to identify an individual city. This requires us to  figure out
how to isolate one city, the senario of one city being requested. 

To do that, we must be able to locate the city that corresponds with the request.
The request will hold a variable in it's string that is sent. That variable will be 
what we use to identify the city that corresponds with the request.
 */

//  /:id - is the variable, it can be named anything. It is found in the req.params object.
// server.get('/api/v1/cities/:name');

// server.patch('/api/v1/cities/:name');

// server.delete('/api/v1/cities/:name');

const port = 4000;
server.listen(port, () => {
  console.log(`server now listening on port ${port}`);
});
