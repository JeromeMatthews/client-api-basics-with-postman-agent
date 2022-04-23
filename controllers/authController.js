const { promisify } = require('util');
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
    passwordChangedAt: req.body.passwordChangedAt,
  });

  const token = signToken(newUser._id);

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
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // 1 Getting token and check if it exists:
  // typically the common practice is to send the token with request in the http headers. So to do this we need to know how to set headers. In the protect route we'll check to see if the token exists in the header under the field name: authorization with a value of Bearer = Example: authorization:Bearer 'vsdfaf3w3w56gb5uj56b' -  where the space is the way to differentiate the token string from the field.

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in. Please lo gain access', 401)
    );
  }

  //2 Verification of the token: Esursing no-one has manipulated the token.
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);

  //3 Check if the user still exists:
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no longer exists.', 401)
    );
  }

  //4 Check if user has changed password after the JWT has been issued:
  //this part will be on the user model, using an instance method.
  if (currentUser.changedPassword(decoded.iat)) {
    return next(
      new AppError(
        'User has recently changed their password, please login again',
        401
      )
    );
  }
  /// GRANT ACCESS TO PROTECTED ROUTE:
  req.user = currentUser;
  next();
  // remember, since this is not the final endpoint for a given route it must have nex()); at the end of the middleware function or the application will stall. Since no response would have been sent back from the sever.
});




//AUTHORIZATION middleware - users, roles, permission,password reseting
//================================================================
exports.restrictTo =  (...roles) => {
  //... will spread out all the array elements of the the roles array and make them available to use in the closure below:
    return(req, res, next) => {
    // Roles refer to the different types of user roles allowed in the application. This app can have user, city-guide, and admin. 
    //This function accesses the roles array through closures so whilr it does not possess the roles it self, since the function that wraps it does, it can access roles that way. 
    if(!roles.includes(req.user.role)){
      return next(new AppError('You do not have permission to perform this action',403));
    }  
    //we call the .includes function to check if any of the passed roles from roles exists on the user object coming from the request object, this request object is passed to the restrictTo function by the next() at the end of protect. So we canmake use of all the user fields and the JWT.
    next();
    //pass on the access to the subsequent route once the role check is complete.
    }
}