// User Schema 
// Description: The Schema utilised for the User Collection in MongoDb
// Author(s) - Maral & Brendon
// Date - 18/10/19
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

//name
  //Username of this individual - presented to users to recognise who made posts
//email
  //The email address of user - data validated on account created - Unique.
//password
  //The password used to log this user in - data validated on account created.
//Date:
  //the Date.now when the account was created
//isDeleted:
  //a soft delete mechanism if this account has been removed from our system
//uploads
  //a count / sum of how many uploads this user has made - used for leaderboard
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
    // max: 255,
    // min: 3
    default: ""
  },
  email: {
    type: String,
    // required: true
    // max: 255,
    // min: 4
    default: ""
  },
  password: {
    type: String,
    // required: true,
    // max: 1024,
    // min: 6
    default: ""
  },
  date: {
    type: Date,
    default: Date.now
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  uploads: {
    type: Number,
    default: 0
  }
});

//Uses bcrypt to hash, store, and compare passwords securely without
//sending direct plain-text network requests.
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
