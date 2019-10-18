const router = require("express").Router();
const User = require("../models/User");
const UserSession = require("../models/UserSession");
const bodyParser = require("body-parser");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

/*This code is based on a solution by "Keith, the Coder" on Youtube
See https://youtu.be/s1swJLYxLAA
*/

//REGISTER
router.post("/register", async (req, res, next) => {
  const { body } = req;
  const { name, password } = body;
  let { email } = body;

  //Validate user details before creating user
  if (!name) {
    return res.send({
      success: false,
      message: "Name cannot be blank"
    });
  }
  if (name.length < 3) {
    return res.send({
      success: false,
      message: "Please enter a valid name"
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
  if (password.length <= 6) {
    return res.send({
      success: false,
      message: "Password must be more than 6 characters"
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

  /*Steps:
  1. Verify email doesn't exist
  2. Save
  */

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
          message: "Account already exists"
        });
      }

      //Save the user in database
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
});

//LOGIN
router.post("/login", (req, res, next) => {
  const { body } = req;
  const { password } = body;
  let { email } = body;

  //Validate user details before signing user in
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

      //Sign in user with the correct details
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

  // Verify the token and set as deleted
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