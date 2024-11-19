// backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('./Models/User'); // TODO ERR_REQUIRE_ESM
const Equipment = require('./Models/Equipment');

const app = express();
const PORT = process.env.PORT || 10000;
const secretKey = process.env.JWT_SECRET || 'secretkey';  // Replace with a secure key

app.use(cors({
    origin: ['http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
})

const users = [];
const saltRounds = 10;



const uri = process.env.MONGO_URI || "mongodb+srv://gymadmin:adminpass@main.6rs8v.mongodb.net/?"; //add mongodb url

// Set up default mongoose connection with increased timeout and logging
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,  // Increase the timeout to 30 seconds
}).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
});

app.post('/signup',
    body('username').trim().isLength({ min: 3 }).escape(),
    body('password').isLength({ min: 6 }).escape(),
    body('email').isLength({ min: 4 }).escape(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.error('Validation Error:', errors.array());  // Log validation errors
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password, email} = req.body;

        try {
            // Check if the username is already taken
            console.log('Checking if user exists:', username);
            const userExists = await User.findOne({ username });
            if (userExists) {
                console.error('User already exists:', username);
                return res.status(400).json({ message: 'Username already taken' });
            }

            console.log('Checking if user exists:', email);
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                console.error('User already exists:', email);
                return res.status(400).json({ message: 'Email already used' });
            }

            // Create a new user instance
            console.log('Hashing password for user:', username);
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            

            // Check if admin acct
            console.log('Checking if user is admin');
            const isAdmin = false;
            if ((username == 'gymadmin') && (email == 'gymadmin@gmail.com') {
                console.log('User is admin');
                isAdmin = true;
            }

            // Save the user to the database
            console.log('Saving new user to database:', username);
            const newUser = new User({ username, password: hashedPassword, email, isAdmin });
            await newUser.save();

            res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
            console.error('Signup Error:', error);  // Log the exact error
            res.status(500).json({ message: 'Error creating user' });
        }
    }
);


// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        //const user = users.find(user => user.username === username);
        const user = await User.findOne({ username })
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        //const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1h' });
        const token = jwt.sign({ id: user._id, username: user.username }, secretKey, { expiresIn: '1h' });
        res.json({ token });
    } catch(error) {
        res.status(500).json({message: 'Error during login', error});
    }
});

// Protection
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);
        //req.user = user;
        req.user = { id: user.id, username: user.username };
        next();
    });
}

app.post('/addEquipment', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const equipmentName = req.body;

        console.log('Checking admin credentials');
        if (userId != 'ADMIN_ID') // TODO: put admin's Id (not created yet)
            return res.status(400).json({message: 'User not admin'});

        console.log('Checking if equipment exists:', equipmentName);
        const equipmentExists = await Equipment.findOne({name});
        if (equipmentExists) {
            console.error('Equipment already exists:', equipmentName);
            return res.status(400).json({message: 'Equipment name already taken'});
        }
        
        console.log('Saving new user to database:', username);
        const newEquipment = new Equipment({name: equipmentName});
        await newEquipment.save();

        res.status(201).json({ message: 'Equipment created successfully' });
    } catch (error) {
        console.error('Equipment Add Error:', error);  // Log the exact error
        res.status(500).json({ message: 'Error creating equipment' });
    }
}

// Middleware: does a given piece of equipment exist? TODO test, verify
function doesEquipmentExist(req, res, next) {
    const equipmentName = req.headers['equipmentName'];
    const equipmentExists = Equipment.findOne({name: equipmentName});
    if (!equipmentExists) return res.sendStatus(400);

    next();
}

// Join queue for equipment
app.post('/join', authenticateToken, doesEquipmentExist, async (req, res) => {
    const desiredEquipmentName = req.headers['equipmentName'].split(" ")[1]; // TODO check
    
    // get the current username
    const currentUser = req.user.id;

    // ensure User is not already waiting in queue for equipment
    isQueued = Equipment.findOne({"name": desiredEquipmentName, "userQueue.userID": currentUser});
    if (isQueued) return res.status(403).json({message: 'User already queued'});

    // add user to equipment queue
    const desiredEquipment = Equipment.findOne({"name": desiredEquipmentName});
    desiredEquipment.userQueue.push(currentUser);
    desiredEquipment.save();
    return res.status(200);
});

// Leave queue for equipment
app.post('/renege', authenticateToken, doesEquipmentExist, async (req, res) => {
    const undesiredEquipmentName = req.headers['equipmentName'].split(" ")[1]; // TODO check

    // get the current user
    const currentUser = req.user.id;

    // ensure User is already waiting in queue for equipment
    const undesiredEquipment = Equipment.findOne({"name": undesiredEquipmentName, "userQueue.userID": currentUser});
    if (!undesiredEquipment) return res.status(403).json({message: 'User does not exist in queue'});

    // remove user to equipment queue
    userIdx = undesiredEquipment.userQueue.indexOf(currentUser);
    undesiredEquipment.userQueue.splice(userIdx, 1);
    undesiredEquipment.save();
    return res.status(200);
});
