import {Request, Response} from "express";

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
// Import routes
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')

dotenv.config();

//connect to DB
mongoose.connect(
    process.env.MONGO_CONNECT,
    { useNewUrlParser: true}, 
    () => console.log('Connected to db')
);

function logResponseBody(req: Request, res: Response, next: any) {
    var oldWrite = res.write,
        oldEnd = res.end;

    var chunks:any[] = [];
  
    res.write = function (chunk: any) {
      chunks.push(chunk);

      // @ts-ignore
        return oldWrite.apply(res, arguments);
    };
  
    res.end = function (chunk: any) {
      if (chunk)
        chunks.push(chunk);
  
      var body = Buffer.concat(chunks).toString('utf8');
      console.log(req.path, body);
  
      // @ts-ignore
        oldEnd.apply(res, arguments);
    };
  
    next();
  }


//app.use(logResponseBody);

//Middleware

app.use(express.json());

//Route middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

app.listen(3000, () => console.log('Server up with TS!'))