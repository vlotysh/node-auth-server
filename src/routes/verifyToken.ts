/// <reference path="../../custom.d.ts" />

import {Request, Response} from "express";

const jwt = require('jsonwebtoken');

declare type nextCallBack = () => void;

module.exports = function(req: Request, res: Response, next: nextCallBack) {
    const token: string | undefined = req.header('Authorization');
    if (!token) {
        return  res.status(401).send('Access Denied!');
    }

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        console.log(verified);
        req.user = verified;
        next();
    } catch(err) {
        return  res.status(401).send({'error': 'Invalid token', 'now': Math.floor(Date.now() / 1000)});
    }
}