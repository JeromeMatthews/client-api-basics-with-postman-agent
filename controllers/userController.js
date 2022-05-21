const User = require('../model/usermodel');
const express = require('express');
const catchAsync = require('../utils/catchAsync');
const router = express.Router();
const CRUDfactory = require('../controllers/crudFunctionFactory');

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
