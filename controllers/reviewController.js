const Review = require('../model/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const CRUDfactory = require('../controllers/crudFunctionFactory');

exports.setTourUserIds = (req, res, next) => {
  //Allow Nested routes
  if (!req.body.city) req.body.city = req.params.cityId;
 //If no tour, use the one coming from the request object

  if (!req.body.user) req.body.user = req.user.id;
   //What's actually being past from the proect route. req.user = currentUser.
    //If no user, use the one coming from the request object

  next();// Hand over control to the middleware for CRUD operations.
}



exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.cityId) filter = { city: req.params.cityId };

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

exports.createReview = CRUDfactory.createOne(Review);

exports.deleteReview = CRUDfactory.deleteOne(Review);
