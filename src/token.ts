const jwt = require('jsonwebtoken');

const generateToken = (payload: object, secret: string, options = {}) => {
    return jwt.sign(payload, secret, options)
};

module.exports.generateToken = generateToken;