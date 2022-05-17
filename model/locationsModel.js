const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  hemisphere: {
    type: String,
    required: [true, 'Please specify a hemisphere where this city is located'],
  },
  region: {
    type: String,
    required: [
      true,
      'Please specify a which geographical region this city is located in',
    ],
  },
  country: {
    type: String,
    required: [true, 'Please specify a country where this city is located'],
  },
  countryCode: {
    type: Number,
  },
  geolocation: {
    //GeoJSON
    type: {
      type: String,
      default: 'Point',
      enum: ['Point'],
    },
    coordinates: [Number],
    /*longditude first, then latitude
    Vertical meridiean point - longditude, and the latitude is a horizontal degree*/
  },

  timezone: {
    code: {
      type: String,
    },
    description: {
      type: String,
    },
  },
});

const location = mongoose.model('Location', locationSchema);

module.exports = location;
