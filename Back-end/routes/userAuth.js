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

// router.get("/register", async (req, res) => {
//   res.render("register");
// });

//REGISTER
router.post("/register", async (req, res, next) => {
  //VALIDATE THE DATA BEFORE WE CREATE A USER

  const { body } = req;
  const { name, password } = body;
  let { email } = body;

  if (!name) {
    console.log(name);

    return res.send({
      success: false,
      message: "Error: Name cannot be blank"
    });
  }
  if (!email) {
    return res.send({
      success: false,
      message: "Error: Email cannot be blank"
    });
  }
  if (!password) {
    return res.send({
      success: false,
      message: "Error: Password cannot be blank"
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
          message: "Error: Account already exists"
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
  // const { error } = Joi.validate(req.body, schema);
  // const { error } = registerValidation(req.body);
  // if (error) return res.status(400).send(error.details[0].message);

  //Check if user already in database
  // const emailExists = await User.findOne({ email: req.body.email });
  // if (emailExists) return res.status(400).send("Email already exists");

  //Hash passwords
  // const salt = await bcrypt.genSalt(10); //complexity of string that gets generated is 10
  // const hashPassword = await bcrypt.hash(req.body.password, salt); //Hash password with salt

  //Create a new user
  // const user = new User({
  //   name: req.body.name,
  //   email: req.body.email,
  //   password: hashPassword
  // });

  // try {
  //   //Save the user
  //   const savedUser = user.save();
  //   //Send a response
  //   res.send({ user: user._id }); //Sends back user with just an id
  //   res.json("Registered!");
  //   res.render("/login");
  // } catch (err) {
  //   // res.redirect("/register");

  //   res.status(400).send(err);
  // }
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
      message: "Error: Email cannot be blank"
    });
  }
  if (!password) {
    return res.send({
      success: false,
      message: "Error: Password cannot be blank"
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
        console.log("thisss");
        return res.send({
          success: false,
          message: "Error: Invalid"
        });
      }

      const user = users[0];
      if (!user.validPassword(password)) {
        console.log("this");
        return res.send({
          success: false,
          message: "Error: Invalid"
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
          token: doc._id
        });
      });

      // const { error } = loginValidation(req.body);
      // if (error) return res.status(400).send(error.details[0].message);

      //Check if user in database (if email exists)
      // const user = await User.findOne({ email: req.body.email });
      // if (!user) return res.status(400).send("Email or password invalid");

      //Password is correct
      // const validPass = await bcrypt.compare(req.body.password, user.password);
      // if (!validPass) return res.status(400).send("Invalid password");

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
