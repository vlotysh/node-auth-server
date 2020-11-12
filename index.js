const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

//connect to DB
mongoose.connect(
    process.env.MONGO_CONNECT,
    { useNewUrlParser: true}, 
    () => console.log('Connected to db')
);

// Import routes
const authRoute = require('./routes/auth')

//Route middlewares
app.use('/api/user', authRoute);

app.listen(3000, () => console.log('Server up!'))