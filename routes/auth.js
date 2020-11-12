const router = require('express').Router();
const User = require('../model/User');
const { registerValidation } = require('../validation')
var bcrypt = require('bcryptjs');

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
        res.send(savedUser);
    } catch (err) {
        res.statusCode(400).send(err);
    }
});

router.post('/login', (req, res) => {
    res.send('Login');
});

module.exports = router;

