const User = require('../model/usermodel');
const express = require('express');
const catchAsync = require('../utils/catchAsync');
const router = express.Router();

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: users,
  });
});


exports.updateMe = catchAsync(async (req, res, next) => {
//Allow user to update the user or account istelf.

  // Create error if user Posts password data
  if(req.body.password || req.body.passwordConfirm) {
    return next( new AppError('This route is not for password updates. Please use the route: /updateMyPassword',400));
  }



//Filter out unwanted field names, that are not a llowed to be updated.
const filteredBody = filterObj(req.body, 'name', 'email');


const  updatedUser= await User.findByIdAndUpdate(req.user.id, filteredBody, {
  new: true, runValidators: true
}); 

res.status(200).json({
  status: 'success',
  user: updatedUser
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

exports.deleteUser = (req, res, next) => {
  res.status(500).json({
    status: 'Internal server error',
    message: 'This route is not yet defined.',
  });
};


exports.deleteMe = catchAsync (async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {active: false});
res.status(204).json({
  status: 'success',
  data: null,
});

});