const express = require('express');
const router = express.Router();
const authcontroller = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');




router
  .route('/')
  .get(authcontroller.protect, authcontroller.restrictTo('user'), reviewController.getAllReviews)
  .post(reviewController.createReview);





module.exports = router;
