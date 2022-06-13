const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('./../model/usermodel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
// STAGE 1 TOken issue for new and existing users:
//===============================================

//STEPS FOR NEW USERS -> TOKEN ISSUE PROCESS

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

//Code refactor for responses and issuing the JWT to the client:
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // recevies the cookie, store and send along with any requests, does not allow for any manipulation of the cookie at all, preventing the possibility of XSS attacks - (Cross Site Scripting attacks)
  };

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }
  //Security best practice: sercure tokens sent through HTTPS only protocol.
  res.cookie('jwt', token, cookieOptions);

  //Remove the password from the output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};
// }

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });

  const token = signToken(newUser._id);

  createSendToken(newUser, 201, res);
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
  createSendToken(user, 200, res);
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
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
    //assign the token based on the token issued by the server to the client cookie storage
  }

  if (!token) {
    return next(
      new AppError('You are not logged in. Please log in to gain access', 401)
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
  // remember, since this is not the final endpoint for a given route it must have next()); at the end of the middleware function or the application will stall. Since no response would have been sent back from the sever.
});




//AUTHENTICATION - Verification of cookie token - for the frontend. So user can access rendered pages.

//Only for rendered pages, no errors can be generated here:
exports.isLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      // 1) Verification of token -
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 3) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 4) Check if the user changed password after the token was issued.
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      //If all checks out, then There is a logged in User. We assign the data decoded from the cookie token in the currentUser variable to the locals.user variable and pass it to the next middleware. Locals will be how we allow the rendered pug templates on the frontend to access the data stored in decoded JWT cookie.
      res.locals.user = currentUser;
      return next(); // Go to next middleware, which is the getAllTours route middleware.
    }
  } catch (err) {
    //If there's is no cookie with a JWT We skip all the above code.
    return next();
  }
  return next();
};


//AUTHORIZATION middleware - users, roles, permission,password reseting
//================================================================
exports.restrictTo = (...roles) => {
  //... will spread out all the array elements of the the roles array and make them available to use in the closure below:
  return (req, res, next) => {
    // Roles refer to the different types of user roles allowed in the application. This app can have user, city-guide, and admin.
    //This function accesses the roles array through closures so whilr it does not possess the roles it self, since the function that wraps it does, it can access roles that way.
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    //we call the .includes function to check if any of the passed roles from roles exists on the user object coming from the request object, this request object is passed to the restrictTo function by the next() at the end of protect. So we can make use of all the user fields and the JWT.
    next();
    //pass on the access to the subsequent route once the role check is complete.
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //Get User based on POSTed email:
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('There is no user with email address', 404));
  }

  //Generate a random  reset token:
  //We build this on the instance method of the model. Calling User this instance of it will have the function available.
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // have to use save to be able to persit the change to the database. The validateBeforeSave: false will allow the requirements for submitting the forgot password route to be sent to the server without having to complete all the validation steps. deactivates all the validators.

  //Send it to the user's email address
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetUrl}. \nIf you didn't forget your password, please ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token. (only valid for 10 minutes)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Your password reset token has been sent to the email.',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    // need to ensure the save methods is called so the modified token and expiry fields are updated.

    return next(new AppError('There was an error sending the email'), 500);
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //1Get the user based on the token.
  // -- With the token having some level of encryption we can only compare it to the one stored in the database by encrypting it as well.
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  //grabs the token from the req.params object where the :/parameter lives. reminder - we can call it anything, and in this case we named it token, as it holds the token for the user.

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  //with the token in the same state as the one stored in the database we can compare to find a match for a given user:

  //2 Checks if the token has expired or not
  //The second query: passwordResetExpires: {$gt: Date.now() - is checking that the time given to use the token has not already expired. Using the query: $gt: Date.now() - Where the query evaluates if the date in the field is lesser than or greater than the current date. If the date lesser than the current date, that means the reset token has expired.

  if (!user) {
    return next(
      new AppError('The token has already expired, or is invalid', 400)
    );
  }

  //Set the new password:
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  //Then clear the Reset password token and token expiration fields:
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  //Then await the save of the password to the database:
  await user.save();
  // ensuring  the changes persist to the database. By using the save() method.

  // 3) Update changedPasswordAt property for the user
  //done in the User schema

  // 4) Log the user in, send JWT
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //Get the User from the collection, the user data at this point would have been carried forwward from the response object after passing the login authentication middleware. So we reach into the user object for the id.

  const user = await User.findById(req.user.id).select('+password');
  //Since, by default the password field is set to not show in query results we have to explictly call for it using the select function with a + operator to let Mongo know that we want to have the password field in the query results.

  //Now check if the user send the correct password in the POST request to verify that they know the current password for the user.
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is incorrect', 401));
  }

  //Otherwise update the password field:
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save(); // Again, we use the save method to presit the changes to the database, and ensure that the validators ccan be run on the entered password data.

  // Log user in, send JWT
  createSendToken(user, 200, res);
});
