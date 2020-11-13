const router = require('express').Router();
const User = require('../model/User');
const { registerValidation, loginValidation } = require('../validation')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

    res.send('Loged in');
});

module.exports = router;

