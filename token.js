const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const generateToken = (payload, secret , options = {}) => {
    return jwt.sign(payload, secret, options)
};

module.exports.generateToken = generateToken;