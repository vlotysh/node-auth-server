const router = require('express').Router();
const User = require('../model/User');
const { registerValidation, loginValidation } = require('../validation')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const {generateToken} = require('../token');
dotenv.config();

router.post('/register', async (req, res) => {
    const { error } = registerValidation(req.body);

    if (error) {
        const response = error.details.map(function (err) {
            return err.message;
        }).join(', ');

        return res.status(400).send(response);
    }

    //Check user exist
    const emailExist = await User.findOne({'email': req.body.email});

    if (emailExist) {
        return res.status(400).send('Email already exist');
    }

    const salt = await bcrypt.genSalt(10);
    const hasPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hasPassword,
    });

    try {
        const savedUser = await user.save();
        res.send({'userId': user.id});
    } catch (err) {
        res.statusCode(400).send(err);
    }
});

router.post('/login', async (req, res) => {
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

    const experation = Math.floor(Date.now() / 1000) + (60); // * 60 * 24 * 7); //7d
    const payload = {_id: existedUser.id, email: existedUser.email};

    const token = generateToken(payload, {'expiresIn': '1m'});
    const refreshToken = generateToken(payload);

    res.header('auth-token', token).send({'token': token, 'refreshToken': refreshToken, 'expiresIn': experation});
});

router.post('/refresh', async (req, res) => {
    const refreshToken = req.body.refreshToken;

    try {
        const payload = jwt.verify(refreshToken, process.env.TOKEN_SICRET);

        delete payload.iat;
        delete payload.exp;

        const experation = Math.floor(Date.now() / 1000) + (60); // * 60 * 24 * 7); //7d
        const newToken = generateToken(payload, {'expiresIn': '1m'});
        const newRefreshToken = generateToken(payload);

        return res.header('auth-token', newToken).send({'token': newToken, 'refreshToken': newRefreshToken, 'expiresIn': experation});
    } catch(err) {
        res.send(err);
    }
})

module.exports = router;

