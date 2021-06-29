const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../model/User');
const dotenv = require('dotenv');
const { registerValidation } = require('../validation');
const { DB } = require('../db');

exports.register = async (req, res) => {
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
        const db = new DB();
        const sql = 'INSERT INTO users (name, email, password) VALUES (?)';
    
        const result = await db.insert(sql, [req.body.name, req.body.email, hasPassword]);

        res.send({'userId': result});
    } catch (err) {
        res.status(400).send(err);
    }

}