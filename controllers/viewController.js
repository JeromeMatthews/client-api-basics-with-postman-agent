const City = require('../model/cityModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getCityCollection = catchAsync(async (req, res, next) => {
  const cities = await City.find();

  res.status(200).render('cityCollection', {
    title: 'All Cities - Cities API',
    cities: cities,
  });
});
