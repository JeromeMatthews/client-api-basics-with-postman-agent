const jwt = require('jsonwebtoken');
const User = require('./../model/usermodel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');




// STAGE 1 TOken issue for new and existing users:
//===============================================

//STEPS FOR NEW USERS -> TOKEN ISSUE PROCESS

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //STEPS FOR THE LOGIN EXISTING USERS -> TOKEN ISSUE PROCESS

  //1 Check if email and password is correct
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
    //We need to be a bit vague so in the event that this error is thrown in response to a hacker trying to access the protected areas of the application the error message will not give any hints.
  }

  //2 Check if user exists && password is correct
  //part - 1
  const user = await User.findOne({ email }).select('+password');
  //We're explictly showing the password field here as it's needed to check it.
  //Thar's done by using the select function and passing a + to the field name to show in the response object : select('+password')

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
    //- 401 = unauthorized

    //We can call the correct password function as it exists on the user document. That document is created by the result of the findOne() method query on the userSchema. The candidate password will come in from the request body, stored in password. The user password from the schema will be in user.password, which agin we can acces here since we used the select('+password') function.
  }
  //3 If everything is correct, send the token to the user/client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});


// STAGE 2 ROUTE PROTECTION:
//==========================

