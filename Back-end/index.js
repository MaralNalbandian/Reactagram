const express = require('express');
const connectDB = require('./config/db')
const cors = require('cors');
const app = express();

//Connect to DB
connectDB();

app.use(express.json({ extended: false}));

//Enable CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, PUT, GET, OPTIONS")
  res.header("Access-Control-Request-Method", "PUT")
  next();
});

//Define Routes
app.use('/api/post', require('./routes/post'));

app.use(cors()); 

const PORT = 80;

app.listen(PORT, () => console.log(`Server running on ${PORT}`))
