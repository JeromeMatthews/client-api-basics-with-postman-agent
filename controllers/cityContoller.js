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
  //Filtering requests from the query object:
  //1 -desturct the query object to isolate the parameters in it.
  const queryObj = { ...req.query };

  //2 - Identify the fields to be excluded from the query objec: PSLF
  const excludedFields = ['page', 'sort', 'limit', 'field'];
  //3 remove the params from the query object, creating a blank object to set up control flow with. We will be able to secify what actions to take for each individual field, using if - then statements.
  excludedFields.forEach((e) => delete queryObj[e]);

  console.log(queryObj);



  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte)|(gt)|(lte)|(lt)\b/g, (match) => {`${match}`});


 
    let cityQuery = City.find(queryStr);
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

exports.getCity = async (req, res) => {
  // Get a specific city using request parameters, manually from file.
  // console.log(req.params);
  // const cityName = req.params.id;
  // console.log(cityName);

  // /* compares an object c - with all the objects in the citydata object array.
  // If it finds an object with the property found in the variable: id, then it returns
  // a new object with the founded city, storing it in thisCity.
  // */
  // const thisCity = cities.find((c) => c.Name === cityName);

  // if (!cityName) {
  //   res.status(404).json({ message: 'No city found with this name:' });
  // } else {
  //   res.status(200).json({
  //     status: 'success',
  //     data: {
  //       thisCity,
  //     },
  //   });
  // }

  //Get a city from the mongo database using mongoose: findById();

  try {
    const cityName = req.params.id;
    let cities = await City.find({ Name: cityName });
    console.log(cityName);
    res.status(200).json({
      status: 'success, city found:',
      data: {
        city: cities,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'error, city not found.',
      message: err,
    });
  }
};

exports.updateCity = async (req, res) => {
  //Placeholder code, was not able to implement
  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     city: 'updated city data.',
  //   },
  // });

  //UPDATING DATA
  try {
    const cityName = req.params.id;
    const filter = { Name: cityName };
    const update = req.body;

    let cities = await City.findByIdAndUpdate(cityName, update, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: `success, ${cityName} has been updated`,
      data: {
        city: cities,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'error, unable to find city requested.',
      message: err,
    });
  }

  // ATTEMPT TO FIND BY CITY NAME AND UPDATE FIELDS... DIDN't WORK
  //   try {
  //     const filter = req.params.id;
  //     const cityInfo = req.body;
  //     let cities = await City.findOneAndUpdate(
  //       { Name: filter },
  //       { $set: { Name: cityInfo } }
  //     );

  //     res.status(200).json({
  //       status: `success, ${cityName} has been updated`,
  //       data: {
  //         city: cities,
  //       },
  //     });
  //   } catch (err) {
  //     res.status(404).json({
  //       status: 'error, unable to find city requested.',
  //       message: err,
  //     });
  //   }
  // };
  //In the case of the City project API, we need to find the city name in the DB not really the ID of a given city, given that users will expect to search for a specific city by its name, not having any knowledge of the database, nor would anyone want to search, by some long, complex ID string.
  // Given this situation a query to the database usinf the find(); would be agumented to return the field name that matches the name taken from the request parameters object. I.E:  City.find({ Name: cityName });
  //Taken what we learned from the Mongo Db couse with Max, and checking online for mongoose find() options.

  // In the example from the course, Jonas references the document IDs, and as such uses the findById() method.
};

exports.deleteCity = async (req, res) => {
  //Deleteing from Mongo database using Mongoose findByIdAndDelete(); method.

  try {
    const cityName = req.params.id;
    await City.findByIdAndDelete(cityName);
    res.status(204).json({
      status: 'success, confirmed deltetion of city data.',
      data: null,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error, unable to delete city requested.',
      mesage: err,
    });
  }

  //FILE DATA Deletion method

  // res.status(204).json({
  //   status: 'success',
  //   data: null,
  // });
};
