const fs = require('fs');
// ----------------------------------------------------------------
/* read the data in from the city data json file. Then parsing it so it can be used. 
we can use teh blocking sync version of file read becuase the data is read 
at the top of the execution loop so there's no need to worry about any blocking as 
no other code comes before it.*/
const cities = JSON.parse(
  fs.readFileSync(`${__dirname}/../data/citydata.json`)
);

exports.getAllCities = (req, res) => {
  res.status(200).json({
    status: 'success',
    allCities: cities.length,
    data: {
      cities: cities,
    },
  });
};
exports.addNewCity = (req, res) => {
  const newCity = Object.assign(req.body);
  cities.push(newCity);

  fs.writeFile(
    `${__dirname}/data/citydata.json`,
    JSON.stringify(cities),
    (err) => {
      res.status(201).json({
        status: 'success',
        allCities: cities.length,
        data: {
          recentlyAdded: newCity,
          allCities: cities,
        },
      });
    }
  );
};
exports.getCity = (req, res) => {
  console.log(req.params);
  const cityName = req.params.name;

  /* compares an object c - with all the objects in the citydata object array. 
  If it finds an object with the property found in the variable: id, then it returns 
  a new object with the founded city, storing it in thisCity.
  */
  const thisCity = cities.find((c) => c.Name === cityName);

  res.status(200).json({
    status: 'success',
    data: {
      thisCity,
    },
  });
};

exports.updateCity = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      city: 'updated city data.',
    },
  });
};

exports.deleteCity = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
