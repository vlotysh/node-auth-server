const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/User');

const {loginValidation } = require('../validation')
const {generateToken} = require('../token');


exports.login = async (req, res) => {
    const { error } = loginValidation(req.body);

    if (error) {
        const response = error.details.map(function (err) {
            return err.message;
        }).join(', ');

        return res.status(400).send(response);
    }

    const email = req.body.email;
    const password = req.body.password;
    const existedUser = await User.findOne({'email': email});

    if (!existedUser) {
        return res.status(400).send('Email or password is wrong');
    }

    //password validation

    const validPass = await bcrypt.compare(password, existedUser.password);

    if (!validPass) {
        return res.status(400).send('Invalid password');
    }

    const payload = {_id: existedUser.id, email: existedUser.email};
    const {token, refreshToken, tokenExperation} = generatesTokens(payload);

    res.header('auth-token', token).send({'token': token, 'refreshToken': refreshToken, 'expiresIn': tokenExperation, 'now': Math.floor(Date.now() / 1000)});
}

exports.refresh = async (req, res) => {
    const oldRefreshToken = req.body.refreshToken;

    try {
        const payload = jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        delete payload.iat;
        delete payload.exp;
        const {token, refreshToken, tokenExperation} = generatesTokens(payload);

        res.header('auth-token', token).send({'token': token, 'refreshToken': refreshToken, 'expiresIn': tokenExperation, 'now': Math.floor(Date.now() / 1000)});
} catch(err) {
        res.send(err);
    }
} 

function generatesTokens(payload) {
    console.log(process.env.REFRESH_TOKEN_LIFE);
    const tokenExperation = Math.floor(Date.now() / 1000) + parseInt(process.env.TOKEN_LIFE);
    const refreshTokenExperation = Math.floor(Date.now() / 1000) + parseInt(process.env.REFRESH_TOKEN_LIFE);


    const token = generateToken(payload, process.env.TOKEN_SECRET, {'expiresIn': parseInt(process.env.TOKEN_LIFE)});
    const refreshToken = generateToken(payload , process.env.REFRESH_TOKEN_SECRET, {'expiresIn': parseInt(process.env.REFRESH_TOKEN_LIFE)});

    return {
        token,
        refreshToken,
        tokenExperation
    }
}
