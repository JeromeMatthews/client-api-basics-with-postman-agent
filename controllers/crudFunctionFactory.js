const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');


exports.deleteOne  = Model =>  catchAsync(async (req, res, next) => {
    //Deleteing from Mongo database using Mongoose findByIdAndDelete(); method.
  
    const cityName = req.params.id;
    const doc =  await Model.findByIdAndDelete(cityName);

    if(!doc) {
        return next(new AppError('Document not found with this ID.', 404));
        //we return so we don't send a response twice causing another error, "headers already sent" - error.
    }
  
    res.status(204).json({
      status: 'success, confirmed deltetion of city data.',
      data: null,
    });
  
    //FILE DATA Deletion method
  
    // res.status(204).json({
    //   status: 'success',
    //   data: null,
    // });
  });
