const express = require("express");
const connectDB = require("./config/db");

const app = express();

//Connect to DB
connectDB();

app.use(express.json({ extended: false }));

//Enable CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//Define Routes
app.use("/api/post", require("./routes/post"));
app.use("/api/user", require("./routes/userAuth"));

const PORT = 80;

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
