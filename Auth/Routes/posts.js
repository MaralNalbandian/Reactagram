const router = require("express").Router();
const verify = require("./verifyToken");

//Posts only if user logged in
router.get("/", verify, (req, res) => {
  res.send(req.user);
  User.findbyOne({ _id: req.user });
  //   res.json({
  //     posts: {
  //       title: "my first post",
  //       description: "Random data"
  //     }
  //   });
});

module.exports = router;
