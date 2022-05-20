const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const apiFeatures = require('../utils/apiFeatures');

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    //To allow for nested Get reviews on City. (hack)
    let filter = {};
    if (req.params.cityId) filter = { city: req.params.cityId };


    //Execute query
const features = new apiFeatures(Model.find(filter).select('-__v'), req.query).filter().sort().limitFields().paginate();


    const doc = await features.query; // gets all Reviews in collection.

    res.status(200).json({
      status: 'success',
      totalDocuments: doc.length,
      data: {
        doc,
      },
    });

    if (!doc) {
      next(new AppError('Error: No review found', 404));
    }
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.body);

    if (!newDoc) {
      next(new AppError('Error - Could not create Document', 400));
    }

    res.status(201).json({
      status: 'success - new resource created',
      data: {
        doc: newDoc,
      },
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    //Deleteing from Mongo database using Mongoose findByIdAndDelete(); method.

    const cityName = req.params.id;
    const doc = await Model.findByIdAndDelete(cityName);

    if (!doc) {
      return next(new AppError('Document not found with this ID.', 404));
      //we return so we don't send a response twice causing another error, "headers already sent" - error.
    }

    res.status(204).json({
      status: 'success, confirmed deltetion of city data.',
      data: null,
    });

    //FILE DATA Deletion method

    // res.status(204).json({
    //   status: 'success',
    //   data: null,
    // });
  });
