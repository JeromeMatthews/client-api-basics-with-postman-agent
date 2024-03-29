const User = require('../model/usermodel');
const catchAsync = require('../utils/catchAsync');
const CRUDfactory = require('../controllers/crudFunctionFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  //Allow user to update the user or account istelf.

  // Create error if user Posts password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use the route: /updateMyPassword',
        400
      )
    );
  }

  //Filter out unwanted field names, that are not a llowed to be updated.
  const filteredBody = filterObj(req.body, 'name', 'email');

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    user: updatedUser,
  });
});

exports.postNewUser = (req, res, next) => {
  res.status(500).json({
    status: 'Internal server error',
    message: 'This route is not yet defined.',
  });
};

exports.getUser = (req, res, next) => {
  res.status(500).json({
    status: 'Internal server error',
    message: 'This route is not yet defined.',
  });
};

exports.updateUser = (req, res, next) => {
  res.status(500).json({
    status: 'Internal server error',
    message: 'This route is not yet defined.',
  });
};

//Route that allows a logged in user to access information about themselves.
//It works by taking the current user's id from the request params object.
// In this case the params variable is called 'id' - it's assigned to the params field that would normally be assigned if the route to find a specfic user was requested. We shortcut this by just taking the information from the login. Then we assign this and pass it via next() to the getOne middleware that already has the code to find a specfic user.
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

//Admin level route - Get all users.
exports.getAllUsers = CRUDfactory.getAll(User);

//Admin level route - Get all users.
exports.getUser = CRUDfactory.getOne(User);

//Admin level route - Update users.
exports.updateUser = CRUDfactory.updateOne(User);

//Admin level deletion route. Actually removes the user from the server and database. Ultimately only accessible through the admin level authorization.

exports.deleteUser = CRUDfactory.deleteOne(User);

//-Client facing public route for a user to 'delete' their account from the server. Really only hides it and sets it to inactive.

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
