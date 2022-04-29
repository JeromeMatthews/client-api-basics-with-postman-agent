const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email addres'],
  },
  photo: {
    type: String,
  },
  password: { type: String, required: true, minLength: 8, select: false },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      //remember that is only works on the save() function
      validator: function (el) {
        return el === this.password; // abc === xyz
      },
      message: 'Passwords are not the same.',
    },
  },
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken:{ 
    type: String,
  },
  passwordResetExpires: {
    type: String
  },
  role: {
    type: String,
    enum: ['admin', 'city-guide', 'user'],
    default: 'user',
  },
});

//To encrypt the password we make us of the Javascript implementation of the bcrypt library. Bcryptjs. We use the asynchronous function version as we're working with asynchronous codes in node. The function is on the mongoose middleware: pre action, of the Document middleware.

//Middleware types: Document, Query, Aggregation, and Model - DQAM, Each can be attached in either pre, or post.
userSchema.pre('save', async function (next) {
  //Will only run is password was modified:
  if (!this.isModified('password')) return next();
  //Hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  //second parameter is the cost for SALTing the password, how cpu intensive the encryption algorithm should be. We're using the asynchronous version of the hash function.

  //Delete passwordConfirm field.
  this.passwordConfirm = undefined;
  //NOTE: We can do this becuase the required field on passwordConfirm will enforce an entry into the passwordConfirm field, but it is not necessary to be persisted to the database. It's role in confirming the input of what is found in password is finished here. So can be emptied.
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  //Return true if the passwords being compared are the same and false if they are different. The user password has to be passed in as the field is currently set to be unaccessible with select:false. So we can't reference it directly using this.passowrd as you would normally be able to. Given that this is a instance of the userSchema and its properties.
  return await bcrypt.compare(candidatePassword, userPassword);
  //we need the .compare function to unhash the userPasword and copmare with the candidatePassword - the entered one. We would not be able to otherwise. This is for step 2 - part 2 checking to see if the password is correct.
};

userSchema.methods.changedPassword = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(changedTimeStamp, JWTTimestamp);
    return JWTTimestamp < changedTimeStamp;
  }

  //False means not changed:
  return false;
};


//================================================================
//Step 2 of the forgotPassword method Generate a new random token for the user to sign in with. 
userSchema.methods.createPasswordResetToken = function() {
const resetToken = crypto.randomBytes(32).toString('hex');

this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
return resetToken;
}

const user = mongoose.model('User', userSchema);
module.exports = user;
