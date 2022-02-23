const fs = require('fs');
const express = require('express');
const server = express();

// ----------------------------------------------------------------
/* read the data in from the city data json file. Then parsing it so it can be used. 
we can use teh blocking sync version of file read becuase the data is read 
at the top of the execution loop so there's no need to worry about any blocking as 
no other code comes before it.*/
const cities = JSON.parse(fs.readFileSync(`${__dirname}/data/citydata.json`));

server.get('/api/v1/cities', (req, res) => {
  res.status(200).json({
    status: 'success',
    allCities: cities.length,
    data: {
      cities: cities,
    },
  });
});

const port = 4000;
server.listen(port, () => {
  console.log(`server now listening on port ${port}`);
});
