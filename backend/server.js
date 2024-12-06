// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { body, validationResult } = require('express-validator');

const config = require('./utils/config');
const { setupWebSocket, broadcast } = require('./utils/websocket');

const userRoutes = require('./routes/userRoutes');
const equipmentRoutes = require('./routes/equipmentRoutes');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors({
    origin: [config.frontendUrl],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});

const uri = config.mongoUri; //add mongodb url

// Set up default mongoose connection with increased timeout and logging
mongoose.connect(uri, {
    serverSelectionTimeoutMS: 30000,  // Increase the timeout to 30 seconds
}).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
});


// WebSocket server setup
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

setupWebSocket(server); // Set up WebSocket

// Routes
app.use('/api/users', userRoutes);
app.use('/api/equipment', equipmentRoutes);

// Cron job
require('./utils/cronJob');




// Protection
function authenticateToken(req, res, next) {
    // const authHeader = req.headers['authorization'];
    // const token = authHeader && authHeader.split(' ')[1];

    // if (!token) return res.sendStatus(401);

    // jwt.verify(token, secretKey, (err, user) => {
    //     if (err) return res.sendStatus(403);
    //     req.user = { id: user.id, username: user.username };
    //     next();
    // });
};

function isAdmin(req, res, next) {
    // const userId = req.user.id;
    // console.log('Checking admin credentials');
    // if (userId != 'ADMIN_ID') // TODO: put admin's Id (not created yet)
    //     return res.status(400).json({ message: 'User not admin' });
    // next();
}

// TODO for doesEquipmentExist, /join, /renege: test functions
// Middleware: does a given piece of equipment exist?
// async function doesEquipmentExist(req, res, next) {
//     const equipmentName = req.body;
//     console.log("doesEquipmentExist called on " + equipmentName);
//     const equipmentExists = await Equipment.findOne({ name: equipmentName });
//     if (!equipmentExists) return res.sendStatus(400).json({ message: "doesEquipmentExist: requested equipment " + equipmentName + " does not exist" });

//     next();
// };
