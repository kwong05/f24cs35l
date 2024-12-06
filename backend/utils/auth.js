const jwt = require('jsonwebtoken');
const config = require('./config');
const User = require('../models/User');

// Middleware to authenticate token
async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        const user = await User.findById(decoded.id).select('id username isAdmin');
        if (!user) return res.sendStatus(403);

        req.user = { id: user.id, username: user.username, isAdmin: user.isAdmin };
        next();
    } catch (err) {
        console.error('Token verification error:', err);
        return res.sendStatus(403);
    }
}

// Middleware to check if user is admin
function checkAdmin(req, res, next) {
    if (!req.user || !req.user.isAdmin) {
        console.error('User is not an admin', req.user);
        return res.sendStatus(403); // Forbidden
    }
    next();
}

module.exports = { authenticateToken, checkAdmin };