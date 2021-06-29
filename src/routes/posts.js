const router = require('express').Router();
const verify  = require('./verifyToken')
const {DB} = require('./../db')
const {createPostValidation} = require('../validation')

router.get('/', verify, async (req, res) => {
    const db = new DB();
    const sql = 'SELECT * FROM note';
    const results = await db.query(sql);
     let posts = [];

      await results.map((result) => {
        posts.push(JSON.parse(JSON.stringify()));
      });
      

      res.json({'posts': posts});
});

router.post('/', verify, async (req, res) => {
    const { error } = createPostValidation(req.body);

    if (error) {
        const response = error.details.map(function (err) {
            return err.message;
        }).join(', ');

        return res.status(400).send(response);
    }

    const db = new DB();
    const params = [req.body.title, req.body.text,req.body.userId];
    const sql = 'INSERT INTO note (title, text, userId) VALUES (?)';

    const result = await db.insert(sql, params);

    if (result.insertId) {
        res.json({'id': result.insertId});
    } else {
        res.json({'error': 'failed to insert'});
    }
})
 
module.exports = router;