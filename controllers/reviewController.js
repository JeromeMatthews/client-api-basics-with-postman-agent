const Review = require('../model/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if(req.params.cityId) filter = {city: req.params.cityId};

  const review = await Review.find(filter).select('-__v'); // gets all Reviews in collection.

  res.status(200).json({
    status: 'success',
    totalReviews: review.length,
    data: {
      review,
    },
  });

  if (!review) {
    next(new AppError('Error: No review found', 404));
  }
});

exports.createReview = catchAsync(async (req, res, next) => {
  //Allow Nested routes
  if (!req.body.city) req.body.city = req.params.cityId;
  if (!req.body.user) req.body.user = req.user.id;

  const newReview = await Review.create(req.body);

  if (!newReview) {
    next(new AppError('Error - Could not create review', 400));
  }

  res.status(201).json({
    status: 'success - new review created',
    data: {
      review: newReview,
    },
  });
});
