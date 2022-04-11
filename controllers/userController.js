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
