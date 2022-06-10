const mongoose = require('mongoose');
const slugify = require('slugify');

const citySchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
    },

    slug: String,

    Description: {
      type: String,
      required: true,
      unique: true,
    },

    Cityimage: [String],

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
      type: Number,
      requried: true,
      unique: true,
    },
    Population: {
      metric: {
        type: String,
        requried: true,
      },

      value: {
        type: Number,
        requried: true,
      },
    },

    cityguides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        //with this the user model import is not required, mongoose will know where to look for User.
      },
    ],
  },
  {
    //Ensures virutal fields are shown in the output to the client.
    //Virtual fields are fields not stored in the database. They are calculated using some other value.
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Uses the pre-middleware function on the city model to create slugs - human-readable strings for the citydocument entries in the database.
//We need this as we don't expect users to search for cities by their id's, that's isn't practical in a real world application.
citySchema.pre('save', function (next) {
  this.slug = slugify(this.Name, { lower: true });
  next();
});

//Child referencing
/*Allows us to populate any fields where they are referenced in a given schema.
Whenever a query is sent to find a given resource on the database. 

If there are fields with objectId references on them, then populate them with the appropriate data. In this case we populate the cityguides field using the reference given to the User collection. 
*/

citySchema.pre(/^find/, function (next) {
  this.populate({
    path: 'cityguides',
    select: 'name role email',
    //The above select says to remove the V and passwordChangedAt fields from the end user output.
  });

  next();
});

citySchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'city',
  localField: '_id',
});

const city = mongoose.model('City', citySchema);

module.exports = city;
