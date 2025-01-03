const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { authenticateToken, checkAdmin } = require('../utils/auth');
const config = require('../utils/config');

const User = require('../models/User');


const secretKey = process.env.JWT_SECRET;  // Replace with a secure key

// Fetch user details by user IDs
router.post('/fetchUserDetails', async (req, res) => {
    try {
        const { userIds } = req.body;
        const users = await User.find({ _id: { $in: userIds } });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving user details' });
    }
});


// get user's favorite list
router.get('/fetchFavorites', async (req, res) => {
    try {
        const { username } = req.query;
        const user = await User.findOne({ username }); //get the user object from their name

        // get the users favorite list
        res.json(user.favoritesList);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving favorites list data' });
    }
});

router.post('/grantAdmin', authenticateToken, checkAdmin, async (req, res) => {
    try {
        const { username } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.isAdmin = true;
        await user.save();
        res.status(200).json({ message: 'Admin status granted' });
    } catch (error) {
        console.error('Grant Admin Error:', error);
        res.status(500).json({ message: 'Error granting admin status' });
    }
});

// get user's current machine 
router.get('/fetchCurrentEquipment', async (req, res) => {
    try {
        const { username } = req.query;
        const user = await User.findOne({ username }); //get the user object from their name

        // get the user's current machine
        res.json({ currentEquipment: user.currentEquipment });
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving current equipment data' });
    }
});

//get user's queued equipment
router.get('/fetchQueuedEquipment', async (req, res) => {
    try {
        const { username } = req.query;
        const user = await User.findOne({ username }); //get the user object from their name

        // get the user's current machine
        res.json({ queuedEquipment: user.queuedEquipment });
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving equipment queue data' });
    }
});

// Update user's favorite list
router.post('/updateFavorites', async (req, res) => {
    try {
        const { username, favorites } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.favoritesList = favorites;
        await user.save();

        res.status(200).json({ message: 'Favorites list updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating favorites list' });
    }
});

// User registration route
router.post('/signup', [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if this is the first user
        const isFirstUser = (await User.countDocuments({})) === 0;
        const newUser = new User({ username, password: hashedPassword, isAdmin: isFirstUser });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', isAdmin: isFirstUser });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user' });
    }
});

// User login route
router.post('/login', [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ id: user._id, username: user.username }, secretKey, { expiresIn: '1h' });
        const isAdmin = user.isAdmin;
        res.json({ token, isAdmin });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Error logging in user' });
    }
});

module.exports = router;
