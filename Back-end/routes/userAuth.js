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
  //https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
  var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  var result = emailRegex.test(String(email).toLowerCase());
  if (result == false){
    return res.send({
      success: false,
      message: "Error: Please enter a valid email"
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
        return res.send({
          success: false,
          message: "Error: Invalid"
        });
      }

      const user = users[0];
      if (!user.validPassword(password)) {
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
          // token: userSession.userId,
          userIdToken: userSession.userId,
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
  const { userIdToken } = query;
  // Verify the token is one of a kind and it's  not deleted

  var userCount = await User.find({_id: userIdToken}).count()
  if (userCount > 0){
    res.json({result: "Success"});
  } else {
    res.json({result: "Fail"})
  }
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

// POST /api/user/incrementUpload
// Increment the upload counter
router.post('/incrementUpload', async (req, res) => {
  try {
      const user = await User.findOne({ _id: req.body.userId })

      if (user) { //if post exists based on id
          try {
              user.uploads = user.uploads + 1
              await user.save();
          } catch (error) {
              res.status(500).json(error)
          }
      }

      else {
          res.status(404).json('No post found');
      }

  } catch (err) {
      console.error(err);
      res.status(500).json('Server error')
  }
});

// GET /api/user/leaderboard
// Get the top 3 uploaders for the leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
      const users = await User.find({}).sort({uploads: -1}).limit(3)

      if (users) {
          return res.json(users)
      } else {
          res.status(404).json('Error');
      }
  } catch (err) {
      console.error(err);
      res.status(500).json('Server error');
  }
});

// GET /api/user/username/:id
// Get username by id
router.get('/username/:id', async (req,res) => {
  try {
      const user = await User.find({_id: req.params.id});
      if(user) {
          return res.json(user[0].name)
      } else {
          res.status(404).json('No user found');
      }
  } catch (err) {
      console.error(err);
      res.status(500).json('Server error');
  }
});

module.exports = router;