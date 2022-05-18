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
      max: [5, 'A review may not be greater than 5 stars'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    city: {
      //Parent reference to the tour model.
      type: mongoose.Schema.ObjectId,
      ref: 'City',
      required: [true, 'Review must belong to a city'],
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

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'city',
  });

  next();
});

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
  });

  next();
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
