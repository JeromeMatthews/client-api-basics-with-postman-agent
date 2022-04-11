
const jwt = require('jsonwebtoken');
const User = require('./../model/usermodel');
const catchAsync = require('./../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name, 
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  const token = jwt.sign({ id: newUser.id},process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  res.status(201).json({
    status: 'success',
    token, 
    data: {
      user: newUser,
    },
  });
});


exports.login = (req,res, next) => {
  const { email, password } = req.body; 

  //STEPS FOR THE LOGIN -> TOKEN ISSUE PROCESS

  //1 Check if email and password is correct
  if(!email || !password){
    next(new AppError('Please provide email and password', 400));
  }

  //2 Check if user exists && password is correct

  //3 If everything is correct, send the token to the user/client
  const token = '';
  res.status(200).json({
    status: 'success',
    token
  });
}