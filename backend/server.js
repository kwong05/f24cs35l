// backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Equipment = require('./models/Equipment');
const cron = require('node-cron');

const userRoutes = require('./routes/userRoutes'); // Import userRoutes
const equipmentRoutes = require('./routes/equipmentRoutes'); // Import equipmentRoutes

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