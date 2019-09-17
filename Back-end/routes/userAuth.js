const router = require("express").Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { registerValidation, loginValidation } = require("../validation");
const config = require('config');

//REGISTER
router.post("/register", async (req, res) => {
  //VALIDATE THE DATA BEFORE WE CREATE A USER
  //   const { error } = Joi.validate(req.body, schema);
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Check if user already in database
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) return res.status(400).send("Email already exists");

  //Hash passwords
  const salt = await bcrypt.genSalt(10); //complexity of string that gets generated is 10
  const hashPassword = await bcrypt.hash(req.body.password, salt); //Hash password with salt

  //Create a new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword
  });

  try {
    //Save the user
    const savedUser = await user.save();
    //Send a response
    res.send({ user: user._id }); //Sends back user with just an id
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;

//LOGIN
router.post("/login", async (req, res) => {
  //VALIDATE THE DATA BEFORE WE CREATE A USER
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Check if user in database (if email exists)
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email or password invalid");

  //Password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Invalid password");

  //Create and assign a token
  const token = jwt.sign({ _id: user._id }, config.get('TOKEN_SECRET'));
  //res.header("auth-token", token).send(token); //can make multiple requests by using the token to s specific logged in user (cannot post unless user logged in)

  res.json("Logged in!");
});
