//User data structure
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
//User attributes stored in database
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    max: 10,
    min: 3,
    default: ""
  },
  email: {
    type: String,
    required: true,
    max: 50,
    min: 4,
    default: ""
  },
  password: {
    type: String,
    required: true,
    max: 20,
    min: 6,
    default: ""
  },
  date: {
    type: Date,
    default: Date.now
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
});

//Store user password in hashed form
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

//Check if hashed password matches with correct user
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
