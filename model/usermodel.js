const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
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
  password: { type: String, required: true, minLength: 8 },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      //remember that is only works on the save() function
      validator: function (el) {
        return el === this.password; // abc === xyz
      },
      message: 'Passwords are not the same.'
    },
  },
});

//To encrypt the password we make us of the Javascript implementation of the bcrypt library. Bcryptjs. We use the asynchronous function version as we're working with asynchronous codes in node. The function is on the mongoose middleware: pre action, of the Document middleware.

//Middleware types: Document, Query, Aggregation, and Model - DQAM, Each can be attached in either pre, or post.
userSchema.pre('save', async function(next) {

  //Will only run is password was modified:
  if(!this.isModified('password')) return next();
//Hash password with cost of 12 
this.password = await bcrypt.hash(this.password, 12) 
//second parameter is the cost for SALTing the password, how cpu intensive the encryption algorithm should be. We're using the asynchronous version of the hash function. 

//Delete passwordConfirm field.
this.passwordConfirm = undefined;
//NOTE: We can do this becuase the required field on passwordConfirm will enforce an entry into the passwordConfirm field, but it is not necessary to be persisted to the database. It's role in confirming the input of what is found in password is finished here. So can be emptied. 
})
const user = mongoose.model('User', userSchema);
module.exports = user;
