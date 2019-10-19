//User Session data structure
//Author(s) - Maral
//Date - 19/10/19

const mongoose = require("mongoose");
//User Session attributes stored in database
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
