import {Request, Response} from "express";
import ValidationError from "../validationError";

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/UserMongo');
const {loginValidation } = require('../validation')
const {generateToken} = require('../token');

exports.login = async (req: Request, res: Response) => {
    const { error } = loginValidation(req.body);

    if (error) {
        const response = error.details.map(function (err: ValidationError) {
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

exports.refresh = async (req: Request, res: Response) => {
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

function generatesTokens(payload: object) {
    console.log(process.env.REFRESH_TOKEN_LIFE);
    let tokenLife:string = process.env.TOKEN_LIFE!;
    let tokenExperation: number;
    tokenExperation = Math.floor(Date.now() / 1000) + parseInt(tokenLife);
    const refreshTokenExperation = Math.floor(Date.now() / 1000) + parseInt(tokenLife);

    const token = generateToken(payload, process.env.TOKEN_SECRET, {'expiresIn': parseInt(tokenLife)});
    const refreshToken = generateToken(payload , process.env.REFRESH_TOKEN_SECRET, {'expiresIn': parseInt(tokenLife)});

    return {
        token,
        refreshToken,
        tokenExperation
    }
}
