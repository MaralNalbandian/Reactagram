// User Session 
// Description: The Schema utilised for the UserSession Collection in MongoDb
// Used whenever a user is deemed to be logged in, so that they REMAIN logged in until they log out.
// Essentially prevents users from: logging in, refreshing and being logged out again.
// Author(s) - Maral & Brendon
// Date - 18/10/19
const mongoose = require("mongoose");

//userId
  //Unique id to identify this user - compared against the User.js schema to recognise which user is reacting, uploading etc.
//timestamp
  //the date that this user session was created
//isDeletd
  //If this user has logged out since this session was created. - Effect: Is this user logged out? True : False
const userSessionSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: ""
  },
  timestamp: {
    type: Date,
    default: Date.now()
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("UserSession", userSessionSchema);
