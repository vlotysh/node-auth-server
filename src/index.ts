import {Request, Response} from "express";
import "reflect-metadata";
import { createConnection } from "typeorm";
import {Post} from "./entity/Post";
import {User} from "./entity/User";

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
// Import routes
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')

dotenv.config();

createConnection({
    type: "mysql",
    host: process.env.MYSQL_HOST,
    port: 3306,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    entities: [
        Post,
        User
    ],
    synchronize: false,
    logging: false
}).then(connection => {
    console.info('At work typeorm!!!')
    // here you can start to work with your entities
}).catch(error => console.error(error));

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