const Review = require('../model/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const review = await Review.find(); // gets all Reviews in collection.

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
  const newReview = await review.create(req.body);

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
