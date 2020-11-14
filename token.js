const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const generateToken = (payload, options = {}) => {
    return jwt.sign(payload, process.env.TOKEN_SICRET, options)
};

module.exports.generateToken = generateToken;