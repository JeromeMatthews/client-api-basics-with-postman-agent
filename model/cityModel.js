const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
    unique: true,
  },
  Landarea: {
    metric: {
      type: String,
      required: true,
    },

    value: {
      type: Number,
      required: true,
    },
  },
  Elevation: {
    metric: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      requried: true,
    },
  },
  Founded: {
    type: String,
    requited: true,
    unique: true,
  },
  Population: {
    metric: {
      type: String,
      required: true,
    },

    value: {
      type: Number,
      required: true,
    },
  },
});

const city = mongoose.model('city', citySchema);

module.exports = city;
