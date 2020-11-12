const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
// Import routes
const authRoute = require('./routes/auth')

dotenv.config();

//connect to DB
mongoose.connect(
    process.env.MONGO_CONNECT,
    { useNewUrlParser: true}, 
    () => console.log('Connected to db')
);

function logResponseBody(req, res, next) {
    var oldWrite = res.write,
        oldEnd = res.end;
  
    var chunks = [];
  
    res.write = function (chunk) {
      chunks.push(chunk);
  
      return oldWrite.apply(res, arguments);
    };
  
    res.end = function (chunk) {
      if (chunk)
        chunks.push(chunk);
  
      var body = Buffer.concat(chunks).toString('utf8');
      console.log(req.path, body);
  
      oldEnd.apply(res, arguments);
    };
  
    next();
  }
  

app.use(logResponseBody);

//Middleware

app.use(express.json());


//Route middlewares
app.use('/api/user', authRoute);

app.listen(3000, () => console.log('Server up!'))