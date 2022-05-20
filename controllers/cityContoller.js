const City = require('../model/cityModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const CRUDfactory = require('./crudFunctionFactory');

exports.getAllCities = CRUDfactory.getAll(City);

exports.addNewCity = CRUDfactory.createOne(City);
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

exports.getCity = catchAsync(async (req, res, next) => {
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

  const cities = await City.findById(req.params.id).populate('reviews');

  if (!cities) {
    return next(new AppError('City not found.', 404));
    //we return so we don't send a response twice causing another error, "headers already sent" - error.
  }

  res.status(200).json({
    status: 'success, city found:',
    data: {
      cities,
    },
  });
});

exports.updateCity = catchAsync(async (req, res, next) => {
  //Placeholder code, was not able to implement
  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     city: 'updated city data.',
  //   },
  // });

  //UPDATING DATA

  const cityName = req.params.id;
  const filter = { Name: cityName };
  const update = req.body;

  let cities = await City.findByIdAndUpdate(
    cityName,
    update,
    {
      new: true,
      runValidators: true,
    },
    () => {
      return next(new AppError('City not found.', 404));
      //we return so we don't send a response twice causing another error, "headers already sent" - error.
    }
  );

  res.status(200).json({
    status: `success, ${cityName} has been updated`,
    data: {
      city: cities,
    },
  });

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
});

exports.deleteCity = CRUDfactory.deleteOne(City);

// exports.deleteCity = catchAsync(async (req, res, next) => {
//   //Deleteing from Mongo database using Mongoose findByIdAndDelete(); method.

//   const cityName = req.params.id;
//   await City.findByIdAndDelete(cityName, () => {
//     return next(new AppError('City not found.', 404));
//     //we return so we don't send a response twice causing another error, "headers already sent" - error.
//   });

//   res.status(204).json({
//     status: 'success, confirmed deltetion of city data.',
//     data: null,
//   });

//   //FILE DATA Deletion method

//   // res.status(204).json({
//   //   status: 'success',
//   //   data: null,
//   // });
// });
