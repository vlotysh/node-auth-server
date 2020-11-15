const jwt = require('jsonwebtoken');

module.exports =function(req, res, next) {
    const token = req.header('auth-token');
    if (!token) {
        return  res.status(401).send('Access Denined');
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