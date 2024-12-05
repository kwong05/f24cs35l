// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const Equipment = require('./models/Equipment');
const User = require('./models/User');

const userRoutes = require('./routes/userRoutes');
const equipmentRoutes = require('./routes/equipmentRoutes');

const app = express();
const PORT = process.env.PORT || 10000;

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
});

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

// Routes
app.use('/api/users', userRoutes);
app.use('/api/equipment', equipmentRoutes);


// HI KESHIV I REFORMATTED WITH CHATGPT TO UNDERSTAND BETTER SORRY
// Check for lapsed equipment and transfer to next user
cron.schedule('* * * * *', async () => { // activates every minute
    try {
        const currentTime = new Date().toISOString();
        console.log(`[${currentTime}] Cron job started`);

        // Find equipment whose unlock time has lapsed
        const readyEquipment = await Equipment.find({ unlockTime: { $lte: new Date() } });
        console.log(`[${currentTime}] Found ${readyEquipment.length} equipment(s) ready for update`);

        for (const readyE of readyEquipment) {
            const equipmentId = readyE._id;

            // Case 1: Equipment has a current user and a non-empty queue
            if (readyE.currentUser && readyE.userQueue.length > 0) {
                const user = await User.findById(readyE.currentUser);
                user.currentEquipment = null;
                await user.save();

                readyE.currentUser = readyE.userQueue.shift();
                const newUser = await User.findById(readyE.currentUser);
                newUser.currentEquipment = equipmentId;
                newUser.queuedEquipment = null;

                const now = new Date();
                now.setMinutes(now.getMinutes() + 15);
                readyE.unlockTime = now;

                await readyE.save();
                await newUser.save();
                console.log(`[${currentTime}] Equipment ${equipmentId}: User ${user._id} removed, User ${newUser._id} assigned, unlock time set to ${readyE.unlockTime}`);
            }
            // Case 2: Equipment has no current user but a non-empty queue
            else if (!readyE.currentUser && readyE.userQueue.length > 0) {
                readyE.currentUser = readyE.userQueue.shift();
                const newUser = await User.findById(readyE.currentUser);
                newUser.currentEquipment = equipmentId;
                newUser.queuedEquipment = null;

                const now = new Date();
                now.setMinutes(now.getMinutes() + 15);
                readyE.unlockTime = now;

                await readyE.save();
                await newUser.save();
                console.log(`[${currentTime}] Equipment ${equipmentId}: User ${newUser._id} assigned, unlock time set to ${readyE.unlockTime}`);
            }
            // Case 3: Equipment has a current user but an empty queue
            else if (readyE.currentUser && readyE.userQueue.length === 0) {
                const user = await User.findById(readyE.currentUser);
                user.currentEquipment = null;
                await user.save();

                readyE.currentUser = null;
                readyE.unlockTime = new Date();
                await readyE.save();
                console.log(`[${currentTime}] Equipment ${equipmentId}: User ${user._id} removed, unlock time reset`);
            }
            // Case 4: Equipment has no current user and an empty queue
            else {
                readyE.unlockTime = new Date();
                await readyE.save();
                console.log(`[${currentTime}] Equipment ${equipmentId}: No current user, unlock time reset`);
            }
        }

        console.log(`[${currentTime}] Cron job completed`);
    } catch (error) {
        console.error('Error in cron job:', error);
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


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
