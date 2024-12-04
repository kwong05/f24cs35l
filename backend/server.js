// backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const Equipment = require('./models/Equipment');
const cron = require('node-cron');
const userRoutes = require('./routes/userRoutes'); // Import userRoutes
const equipmentRoutes = require('./routes/equipmentRoutes'); // Import equipmentRoutes

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
});

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

// Routes
app.use('/api/users', userRoutes);
app.use('/api/equipment', equipmentRoutes);

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
async function doesEquipmentExist(req, res, next) {
    const equipmentName = req.body;
    console.log("doesEquipmentExist called on " + equipmentName);
    const equipmentExists = await Equipment.findOne({ name: equipmentName });
    if (!equipmentExists) return res.sendStatus(400).json({ message: "doesEquipmentExist: requested equipment " + equipmentName + " does not exist" });

    next();
};

// Join queue for equipment
app.post('/join', authenticateToken, doesEquipmentExist, async (req, res) => {

    const desiredEquipmentName = req.body.equipmentName;
    const currentUser = req.body.username;

    // ensure User is not already waiting in queue for equipment
    isQueued = false;
    if (currentUser.queuedEquipment != null)
        isQueued = true;
    //isQueued = await Equipment.findOne({"name": desiredEquipmentName, "userQueue.userID": currentUser});
    if (isQueued) return res.status(403).json({ message: 'User already queued' });

    //check that the user's current equipment will run out of time before new equiupment is ready
    const desiredEquipment = await Equipment.findOne({ "name": desiredEquipmentName });
    const currentEquipment = currentUser.currentEquipment;
    if ((currentEquipment.unlockTime > desiredEquipment.unlockTime) && (desiredEquipment.userQueue == []))
        return res.status(403).json({ message: "User's current equipment will unlock after desired equipment" });

    // add user to equipment queue
    desiredEquipment.userQueue.push(currentUser);
    currentUser.equipmentQueue.push(desiredEquipment);
    await desiredEquipment.save();
    await currentUser.save();
    return res.status(200);
});

// Leave queue for equipment
app.post('/renege', authenticateToken, doesEquipmentExist, async (req, res) => {

    const undesiredEquipmentName = req.body.equipmentName;
    const currentUser = req.body.username;

    // ensure User is already waiting in queue for equipment
    const undesiredEquipment = await Equipment.findOne({ "name": undesiredEquipmentName, "userQueue.userID": currentUser });
    if (!undesiredEquipment) return res.status(403).json({ message: 'User does not exist in queue' });

    // remove user from equipment queue
    userIdx = undesiredEquipment.userQueue.indexOf(currentUser);
    undesiredEquipment.userQueue.splice(userIdx, 1);
    await undesiredEquipment.save();

    // remove equipment from user queue
    equipmentIdx = currentUser.queuedEquipment.indexOf(undesiredEquipment);
    currentUser.queuedEquipment = null;
    await currentUser.save();
    return res.status(200);
});

// Check for lapsed equipment and transfer to next user
cron.schedule('* * * * *', async () => { // activates every minute
    const readyEquipment = await Equipment.find((Date.now() - unlockTime) <= 0);
    for (const readyE of readyEquipment) {
        if ((readyE.currentUser != null) && (readyE.userQueue != [])) {
            user = readyE.currentUser;
            user.currentEquipment = null;
            await user.save();
            readyE.currentUser = readyE.userQueue.shift(); // new currentUser is first index of userQueue array
            newUser = readyE.currentUser;
            newUser.currentEquipment = newUser.queuedEquipment; // newUser's current equipment set to first in queue
            const now = new Date();
            now.setMinutes(now.getMinutes() + 15);
            readyE.unlockTime = now; // set new unlockTime for 15 minutes from now
            await readyE.save();
            await newUser.save();
        } else if ((readyE.currentUser == null) && (readyE.userQueue != [])) {
            readyE.currentUser = readyE.userQueue.shift(); // new currentUser is first index of userQueue array
            newUser = readyE.currentUser;
            newUser.currentEquipment = newUser.queuedEquipment; // newUser's current equipment set to first in queue
            const now = new Date();
            now.setMinutes(now.getMinutes() + 15);
            readyE.unlockTime = now; // set new unlockTime for 15 minutes from now
            await readyE.save();
            await newUser.save();
        } else if ((readyE.userQueue == []) && (readyE.currentUser != null)) {
            user = readyE.currentUser;
            user.currentEquipment = null;
            await user.save();
            readyE.unlockTime = Date.now();
            await readyE.save();
        } else {
            readyE.unlockTime = Date.now();
            await readyE.save();
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
