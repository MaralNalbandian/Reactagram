const express = require("express");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");
const cors = require('cors')
const app = express();

//Connect to DB
connectDB();

app.use(express.json({ extended: false }));

//Bodyparser
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Enable CORS
//Allow the front end to make requests to the back-end as defined below.
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, PUT, DELETE, GET, OPTIONS")
  res.header("Access-Control-Request-Method", "PUT, DELETE")
  next();
});

//Define Routes
app.use("/api/post", require("./routes/post"));
app.use("/api/user", require("./routes/userAuth"));

app.use(cors());

const PORT = 80;

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
