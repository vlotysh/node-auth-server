const router = require('express').Router();
const verify  = require('./verifyToken')
const {DB} = require('./../db')

router.get('/', verify, (req, res) => {
    res.json({
        posts: {
            title: "first post"
        }
    });
});

router.post('/', verify, async (req, res) => {
    const db = new DB();

    //const params = {'text': req.body.text, 'userId': req.body.userId};

    const params = [req.body.text,req.body.userId];
    const sql = 'INSERT INTO note (text, userId) VALUES (?, ?)';

    const result = await db.insert(sql, params);

    if (result.insertId) {
        res.json({'id': result.insertId});
    } else {
        res.json({'error': 'failed to insert'});
    }

    
})
 
module.exports = router;