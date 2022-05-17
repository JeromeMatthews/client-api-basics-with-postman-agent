const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
    },
    rating: {
      type: Number,
      default: 3,
      min: [1, 'A review may not be less than 1 star'],
      max: [1, 'A review may not be greater than 5 stars'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    tour: {
      //Parent reference to the tour model.
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      //Parent reference to the user model.
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },

  {
    //Options on the schema, adding virtual fields to the schema, set to true.
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const review = mongoose.model('Review', reviewSchema);
module.exports = review;
