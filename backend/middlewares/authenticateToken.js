const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || 'secretkey';

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = { id: user.id, username: user.username };
        next();
    });
}

module.exports = authenticateToken;