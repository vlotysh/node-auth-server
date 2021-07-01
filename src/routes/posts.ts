import {Request, Response} from "express";
import ValidationError from "../validationError";
import {Post} from "../entity/Post";

const router = require('express').Router();
const verify  = require('./verifyToken')
const {DB} = require('../db')
const {createPostValidation} = require('../validation')

router.get('/', verify, async (req: Request, res: Response) => {
    const db = new DB();
    const sql = 'SELECT * FROM note';
    const results = await db.query(sql);
     let posts:any[] = [];

      await results.map((result: string) => {
        posts.push(JSON.parse(JSON.stringify(result)));
      });
      

      res.json({'posts': posts});
});

router.post('/', verify, async (req: Request, res: Response) => {
    const { error } = createPostValidation(req.body);

    if (error) {
        const response = error.details.map(function (err: ValidationError) {
            return err.message;
        }).join(', ');

        return res.status(400).send(response);
    }

    const db = new DB();
    const params = [req.body.title, req.body.text,req.body.userId];
    const post = new Post();
    post.title = req.body.title;
    post.text = req.body.text;
    post.userId = req.body.userId;
    const newPost = await post.save();
    res.json({'id': newPost.id});

   //const sql = 'INSERT INTO note (title, text, userId) VALUES (?)';

    /**const result = await db.insert(sql, params);

    if (result.insertId) {

    } else {
        res.json({'error': 'failed to insert'});
    }**/
})
 
module.exports = router;