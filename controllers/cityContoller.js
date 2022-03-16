const fs = require('fs');
const mongoose = require('mongoose');
const City = require('../model/cityModel');

// ----------------------------------------------------------------
/* read the data in from the city data json file. Then parsing it so it can be used. 
we can use teh blocking sync version of file read becuase the data is read 
at the top of the execution loop so there's no need to worry about any blocking as 
no other code comes before it.*/
// const cities = JSON.parse(
//   fs.readFileSync(`${__dirname}/../data/citydata.json`)
// );

exports.getAllCities = async (req, res) => {
  try {
    let cityQuery = City.find();
    const cities = await cityQuery;
    res.status(200).json({
      status: 'success',
      allCities: cities.length,
      data: {
        cities: cities,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err,
    });
  }
};
exports.addNewCity = async (req, res) => {
  //WRITING TO FILE
  //const newCity = Object.assign(req.body);
  // cities.push(newCity);

  // fs.writeFile(
  //   `${__dirname}/data/citydata.json`,
  //   JSON.stringify(cities),
  //   (err) => {
  //     res.status(201).json({
  //       status: 'success',
  //       allCities: cities.length,
  //       data: {
  //         recentlyAdded: newCity,
  //         allCities: cities,
  //       },
  //     });
  //   }
  // );

  //FROM MONGO USING MONGOOSE Create();

  try {
    let cities = await City.create(req.body);

    res.status(201).json({
      status: 'success - new resource created.',
      data: { cities: cities },
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err,
    });
  }
};

// -----------------------------
/*
In order to update/ append any specific city, we need to
be able to identify an individual city. This requires us to  figure out
how to isolate one city, the senario of one city being requested. 

To do that, we must be able to locate the city that corresponds with the request.
The request will hold a variable in it's string that is sent. That variable will be 
what we use to identify the city that corresponds with the request.
 */

//  /:id - is the variable, it can be named anything.

exports.getCity = (req, res) => {
  console.log(req.params);
  const cityName = req.params.id;
  console.log(cityName);

  /* compares an object c - with all the objects in the citydata object array. 
  If it finds an object with the property found in the variable: id, then it returns 
  a new object with the founded city, storing it in thisCity.
  */
  const thisCity = cities.find((c) => c.Name === cityName);

  if (!cityName) {
    res.status(404).json({ message: 'No city found with this name:' });
  } else {
    res.status(200).json({
      status: 'success',
      data: {
        thisCity,
      },
    });
  }
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
