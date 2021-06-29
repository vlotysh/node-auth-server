const router = require('express').Router();
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const {login, refresh} = require('./authentication');
const {register} = require('./register');

dotenv.config();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh)

module.exports = router;

