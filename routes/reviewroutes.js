const express = require('express');

const authcontroller = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true });

router.use(authcontroller.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authcontroller.restrictTo('user'),reviewController.setTourUserIds,
    reviewController.createReview
  );

router.route('/:id').get(reviewController.getReview)
.patch(authcontroller.restrictTo('user', 'admin'),reviewController.updateReview)
.delete(authcontroller.restrictTo('user','admin'),reviewController.deleteReview);

module.exports = router;
