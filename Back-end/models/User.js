//User data structure
//Author(s) - Maral
//Date - 19/10/19

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
//User attributes stored in database
const userSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
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

//This code is based on a solution by "Keith, the Coder" on Youtube
//See https://youtu.be/s1swJLYxLAA

//Store user password in hashed form
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

//Check if hashed password matches with correct user
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
