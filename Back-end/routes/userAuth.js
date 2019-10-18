const router = require("express").Router();
const User = require("../models/User");
const UserSession = require("../models/UserSession");
const bodyParser = require("body-parser");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

/*This code is based on a solution by "Keith, the Coder" on Youtube
See https://youtu.be/s1swJLYxLAA
*/

/*Validate user details before creating user account via API (register)
 *@params: name: Input in required name textfield
 *@params: email: Input in required email textfield
 *@params: password: Input in required password textfield
 *
 *@return: message
 */
router.post("/register", async (req, res, next) => {
  //Get name, email & password from request body
  const { body } = req;
  const { name, password } = body;
  let { email } = body;

  //Check if user has entered name text
  if (!name) {
    return res.send({
      success: false,
      message: "Name cannot be blank"
    });
  }

  //Check if the name user enters is more more than 2 characters
  if (name.length < 3) {
    return res.send({
      success: false,
      message: "Please enter a valid name"
    });
  }

  //Check if user has entered email text
  if (!email) {
    return res.send({
      success: false,
      message: "Email cannot be blank"
    });
  }

  //Check if the email the user enters is valid
  if (/\S+@\S+\.\S+/.test(email) == false) {
    return res.send({
      success: false,
      message: "Please enter a valid email"
    });
  }
  //Check if user has entered password text
  if (!password) {
    return res.send({
      success: false,
      message: "Password cannot be blank"
    });
  }
  //Check if length of the password entered is more than 6 characters
  if (password.length <= 6) {
    return res.send({
      success: false,
      message: "Password must be more than 6 characters"
    });
  }
  //https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
  var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  var result = emailRegex.test(String(email).toLowerCase());
  if (result == false) {
    return res.send({
      success: false,
      message: "Error: Please enter a valid email"
    });
  }

  email = email.toLowerCase();

  /*
   *Verify email associated with user doesn't exist in database
   *
   *@return: message
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

        //Check if user already exists
      } else if (previousUsers.length > 0) {
        return res.send({
          success: false,
          message: "Account already exists"
        });
      }

      //Create new User and save
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

module.exports = router;

/*Verify user details before signing in user (login)
 *@params: email: Input in required email textfield
 *@params: password: Input in required password textfield
 *
 *@return: message
 *@return: userIdtoken: assigned to specific user to specify the user that is logged in
 *@return: token: random token assigned to verify if user logged in/out
 */

router.post("/login", (req, res, next) => {
  //Get email & password from request body
  const { body } = req;
  const { password } = body;
  let { email } = body;

  //Check if user has entered email text
  if (!email) {
    return res.send({
      success: false,
      message: "Email cannot be blank"
    });
  }

  //Check if user has entered password text
  if (!password) {
    return res.send({
      success: false,
      message: "Password cannot be blank"
    });
  }

  email = email.toLowerCase();

  //Find user and verify password
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
      //Check if there's more than one of the user - which should be impossible
      if (users.length != 1) {
        return res.send({
          success: false,
          message: "Invalid"
        });
      }

      //Check if user password is correct
      const user = users[0];
      if (!user.validPassword(password)) {
        return res.send({
          success: false,
          message: "Invalid"
        });
      }

      //Verify user details and assign token
      const userSession = new UserSession(); //Create user session
      userSession.userId = user._id; //User session identified by Id
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
          userIdtoken: userSession.userId,
          token: doc._id //Document id in user session to identify the current session token
        });
      });
    }
  );
});

router.get("/verify", async (req, res, next) => {
  //Get the token
  const { query } = req;
  const { userIdToken } = query;
  // Verify the token is one of a kind and it's  not deleted

  //Verify the token is one of a kind and is not deleted
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
  var userCount = await User.find({ _id: userIdToken }).count();
  if (userCount > 0) {
    res.json({ result: "Success" });
  } else {
    res.json({ result: "Fail" });
  }
});

router.get("/logout", async (req, res, next) => {
  //Get token
  const { query } = req;
  const { token } = query;

  //Verify the token and set as deleted
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
router.post("/incrementUpload", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });

    if (user) {
      //if post exists based on id
      try {
        user.uploads = user.uploads + 1;
        await user.save();
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      res.status(404).json("No post found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
});

// GET /api/user/leaderboard
// Get the top 3 uploaders for the leaderboard
router.get("/leaderboard", async (req, res) => {
  try {
    const users = await User.find({})
      .sort({ uploads: -1 })
      .limit(3);

    if (users) {
      return res.json(users);
    } else {
      res.status(404).json("Error");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
});

// GET /api/user/username/:id
// Get username by id
router.get("/username/:id", async (req, res) => {
  try {
    const user = await User.find({ _id: req.params.id });
    if (user) {
      return res.json(user[0].name);
    } else {
      res.status(404).json("No user found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
});

module.exports = router;
