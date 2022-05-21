const express = require('express');

const authcontroller = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authcontroller.protect,
    authcontroller.restrictTo('user'),reviewController.setTourUserIds,
    reviewController.createReview
  );

router.route('/:id').get(reviewController.getReview)
.patch(reviewController.updateReview)
.delete(reviewController.deleteReview);

module.exports = router;
