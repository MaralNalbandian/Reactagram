const router = require("express").Router();
const User = require("../models/User");
const UserSession = require("../models/UserSession");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// const { registerValidation, loginValidation } = require("../validation");
const config = require("config");
const bodyParser = require("body-parser");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

//This code is based on a solution by "Keith, the Coder" on Youtube
//See https://youtu.be/s1swJLYxLAA

//REGISTER

//This code is based on a solution by "Tyler McGinnis" on TylerMcginnis.com
//See https://tylermcginnis.com/validate-email-address-javascript/
// function emailIsValid(email) {
//   return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
// }

router.post("/register", async (req, res, next) => {
  const { body } = req;
  const { name, password } = body;
  let { email } = body;

  if (!name) {
    return res.send({
      success: false,
      message: "Name cannot be blank"
    });
  }
  if (name.length < 3) {
    return res.send({
      success: false,
      message: "Name cannot be blank"
    });
  }

  if (!email) {
    return res.send({
      success: false,
      message: "Email cannot be blank"
    });
  }

  if (/\S+@\S+\.\S+/.test(email) == false) {
    return res.send({
      success: false,
      message: "Please enter a valid email"
    });
  }

  if (!password) {
    return res.send({
      success: false,
      message: "Password cannot be blank"
    });
  }
  if (password.length < 6) {
    return res.send({
      success: false,
      message: "Password must be more than 6 characters"
    });
  }

  email = email.toLowerCase();

  //Steps:
  //1. Verify email doesn't exist
  //2. Save

  User.find(
    {
      email: email
    },
    (err, previousUsers) => {
      if (err) {
        console.log("prev problem");
        return res.send({
          success: false,
          message: "Error: Server error"
        });
      } else if (previousUsers.length > 0) {
        return res.send({
          success: false,
          message: "Account already exists"
        });
      }

      //Save the user
      const newUser = new User();

      newUser.name = name;
      newUser.email = email;
      newUser.password = newUser.generateHash(password);

      newUser.save((err, user) => {
        if (err) {
          console.log("hash problem");
          return res.send({
            success: false,
            message: "Error: Server error"
          });
        }
        return res.send({
          success: true,
          message: "Signed up"
        });
      });
    }
  );
});

module.exports = router;

//LOGIN
// router.post("/login", async (req, res) => {
router.post("/login", (req, res, next) => {
  //VALIDATE THE DATA BEFORE WE CREATE A USER

  const { body } = req;
  const { password } = body;
  let { email } = body;

  if (!email) {
    return res.send({
      success: false,
      message: "Email cannot be blank"
    });
  }
  if (!password) {
    return res.send({
      success: false,
      message: "Password cannot be blank"
    });
  }

  email = email.toLowerCase();

  User.find(
    {
      email: email
    },
    (err, users) => {
      if (err) {
        return res.send({
          success: false,
          message: "Error: Server error"
        });
      }
      if (users.length != 1) {
        return res.send({
          success: false,
          message: "Invalid"
        });
      }

      const user = users[0];
      if (!user.validPassword(password)) {
        return res.send({
          success: false,
          message: "Invalid"
        });
      }

      //Otherwise correct user
      const userSession = new UserSession();
      userSession.userId = user._id;
      userSession.save((err, doc) => {
        if (err) {
          return res.send({
            success: false,
            message: "Error: Server error"
          });
        }
        return res.send({
          success: true,
          message: "Valid sign in",
          // token: userSession.userId,
          userIdtoken: userSession.userId,
          token: doc._id
        });
      });

      //Create and assign a token
      // const token = jwt.sign({ _id: user._id }, config.get("TOKEN_SECRET"));
      //res.header("auth-token", token).send(token); //can make multiple requests by using the token to s specific logged in user (cannot post unless user logged in)
    }
  );
});

router.get("/verify", async (req, res, next) => {
  //Get token
  const { query } = req;
  const { token } = query;
  // Verify the token is one of a kind and it's  not deleted

  UserSession.find(
    {
      _id: token,
      isDeleted: false
    },
    (err, sessions) => {
      if (err) {
        return res.send({
          success: false,
          message: "Error: Server error"
        });
      }
      if (sessions.length != 1) {
        return res.send({
          success: false,
          message: "Error: Invalid"
        });
      } else {
        return res.send({
          success: true,
          message: "Good"
        });
      }
    }
  );
});

router.get("/logout", async (req, res, next) => {
  //Get token
  const { query } = req;
  const { token } = query;
  // Verify the token is one of a kind and it's  not deleted

  UserSession.findOneAndUpdate(
    {
      _id: token,
      isDeleted: false
    },
    {
      $set: { isDeleted: true }
    },
    null,
    (err, sessions) => {
      if (err) {
        return res.send({
          success: false,
          message: "Error: Server error"
        });
      }

      return res.send({
        success: true,
        message: "Good"
      });
    }
  );
});
