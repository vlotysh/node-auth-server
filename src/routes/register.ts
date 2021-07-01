import {Request, Response} from "express";
import ValidationError from "../validationError";
import {User} from "../entity/User";

const bcrypt = require('bcryptjs');
const UserMongo = require('../model/UserMongo');
const { registerValidation } = require('../validation');
const { DB } = require('../db');

exports.register = async (req: Request, res: Response) => {
    const { error } = registerValidation(req.body);

    if (error) {
        const response = error.details.map(function (err: ValidationError) {
            return err.message;
        }).join(', ');

        return res.status(400).send(response);
    }

    //Check user exist
    const emailExist = await UserMongo.findOne({'email': req.body.email});

    if (emailExist) {
        return res.status(400).send('Email already exist');
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const mongoUser = new UserMongo({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
    });

    try {
        await mongoUser.save();

        const user = new User();
        user.name = req.body.name;
        user.email = req.body.email;
        user.password = hashPassword;
        const savedUser = await user.save();
        res.send({'userId': savedUser.id});
       // res.send({'userId': savedUser.id});
        //const db = new DB();
        //const sql = 'INSERT INTO users (name, email, password) VALUES (?)';

       // const result = await db.insert(sql, [req.body.name, req.body.email, hashPassword]);

       // res.send({'userId': result});
    } catch (err) {
        res.status(400).send(err);
    }

}