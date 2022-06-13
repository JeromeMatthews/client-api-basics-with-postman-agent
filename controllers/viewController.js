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

exports.getCity = catchAsync(async (req, res, next) => {
  const city = await City.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!city) {
    next(new AppError('No city with the name you requested was found', 404));
  }

  res.status(200).render('city', {
    title: `${city.slug}`,
    city: city,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  res.status(200).render('login', {});
});
