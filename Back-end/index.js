const express = require("express");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");
const app = express();

//Connect to DB
connectDB();

app.use(express.json({ extended: false }));

//Bodyparser
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.use(function(req, res) {
//   //res.setHeader("Content-Type", "text/plain");
//   // res.end(JSON.stringify(req.body, null, 0));
// });

//Enable CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, "
  );
  next();
});

//Define Routes
app.use("/api/post", require("./routes/post"));
app.use("/api/user", require("./routes/userAuth"));

const PORT = 80;

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
