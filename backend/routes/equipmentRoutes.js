const express = require('express');
const router = express.Router();
const { broadcast } = require('../utils/websocket');
const Equipment = require('../models/Equipment');
const User = require('../models/User');

// get all the inputted equipment from the database to display it in frontend
router.get('/fetchEquipment', async (req, res) => {
    try {
        const equipmentList = await Equipment.find({});
        // send names as a json
        res.json(equipmentList);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving equipment data' });
    }
});

router.post('/addEquipment', async (req, res) => {
    try {
        const { name: equipmentName } = req.body;

        console.log('Checking if equipment exists:', equipmentName);
        const equipmentExists = await Equipment.findOne({ name: equipmentName });

        if (equipmentExists) {
            console.error('Equipment already exists:', equipmentName);
            return res.status(400).json({ message: 'Equipment name already taken' });
        }

        console.log('Saving new equipment to database:', equipmentName);
        const newEquipment = new Equipment({ name: equipmentName });
        await newEquipment.save();

        res.status(201).json({ message: 'Equipment created successfully' });
    } catch (error) {
        console.error('Equipment Add Error:', error);  // Log the exact error
        res.status(500).json({ message: 'Error creating equipment' });
    }
});

router.post('/removeEquipment', async (req, res) => {
    try {
        const { name: equipmentName } = req.body;

        console.log('Removing equipment from database:', equipmentName);
        await Equipment.deleteOne({ name: equipmentName });

        res.status(200).json({ message: 'Equipment removed successfully' });
    } catch (error) {
        console.error('Equipment Remove Error:', error);  // Log the exact error
        res.status(500).json({ message: 'Error removing equipment' });
    }
});

// Join queue for equipment
router.post('/join', async (req, res) => {
    try {
        const { user: username, id: equipmentId } = req.body;
        console.log(username, equipmentId);
        // Verify user exists
        const currentUser = await User.findOne({ username });
        if (!currentUser) return res.status(404).json({ message: 'User does not exist' });

        // Ensure User is not already waiting in queue for equipment
        let isQueued = false;
        if (currentUser.queuedEquipment != null) isQueued = true;
        const desiredEquipment = await Equipment.findOne({ _id: equipmentId });
        const currentEquipment = currentUser.currentEquipment;

        // Check if the user is in queue for another equipment but currentEquipment is not set
        if (isQueued && !currentEquipment) {
            const queuedEquipment = await Equipment.findOne({ _id: currentUser.queuedEquipment });
            const unlockTime = new Date(queuedEquipment.unlockTime);
            const now = new Date();
            const minutesRemaining = Math.ceil((unlockTime - now) / 60000);

            console.log(minutesRemaining, desiredEquipment.currentUser);
            if (minutesRemaining > 15 && !desiredEquipment.currentUser) {
                // Allow the user to use the desired equipment
                currentUser.currentEquipment = desiredEquipment._id;
                currentUser.queuedEquipment = null;
                desiredEquipment.currentUser = currentUser._id;

                await desiredEquipment.save();
                await currentUser.save();

                broadcast({ type: 'update', equipment: desiredEquipment });

                return res.status(200).json({ message: 'User assigned to equipment successfully' });
            }
        }

        if (isQueued) return res.status(403).json({ message: 'User already queued' });

        // Check that the user's current equipment is not the same as the desired equipment
        if (currentEquipment && currentEquipment.equals(desiredEquipment._id)) {
            return res.status(403).json({ message: 'User is already using this equipment' });
        }

        // Check that the user's current equipment will run out of time before new equipment is ready
        if (currentEquipment && currentEquipment.unlockTime > desiredEquipment.unlockTime && desiredEquipment.userQueue.length === 0) {
            return res.status(403).json({ message: "User's current equipment will unlock after desired equipment" });
        }

        // Add user to equipment queue
        desiredEquipment.userQueue.push(currentUser._id);
        currentUser.queuedEquipment = desiredEquipment._id;

        await desiredEquipment.save();
        await currentUser.save();

        broadcast({ type: 'update', equipment: desiredEquipment });

        return res.status(200).json({ message: 'User added to queue successfully' });
    } catch (error) {
        console.error('Join Queue Error:', error);  // Log the exact error
        res.status(500).json({ message: 'Error joining queue' });
    }
});

// Leave queue for equipment
router.post('/renege', async (req, res) => {
    try {
        // Parse from req JSON
        const { user: username, id: equipmentId } = req.body;
        console.log(username, equipmentId);
        // Verify user exists
        const currentUser = await User.findOne({ username });
        if (!currentUser) return res.status(404).json({ message: 'User does not exist' });

        // Check that the user's current/queued equipment is the same as the undesired equipment
        const undesiredEquipment = await Equipment.findOne({ _id: equipmentId });
        const currentEquipment = currentUser.currentEquipment;
        const queuedEquipment = currentUser.queuedEquipment;
        if ((!currentEquipment || currentEquipment != undesiredEquipment._id) && (!queuedEquipment || (queuedEquipment && !(queuedEquipment.includes(undesiredEquipment._id))))) {
            return res.status(403).json({ message: 'User is not using or queued for this equipment' });
        }

        const userIdx = 0;
        // Remove user from equipment queue if in queue
        if (queuedEquipment && queuedEquipment.includes(undesiredEquipment._id)) {
            userIdx = undesiredEquipment.userQueue.indexOf(currentUser._id);
            if (userIdx > -1) {
                undesiredEquipment.userQueue.splice(userIdx, 1);
            }
            await undesiredEquipment.save();

            // Remove equipment from user queue
            currentUser.queuedEquipment = null;
            await currentUser.save();
        }

        // Remove user from equipment if currently using
        if (currentEquipment && currentEquipment.equals(undesiredEquipment._id)) {
            undesiredEquipment.currentUser = null;
            currentUser.currentEquipment = null;
            await undesiredEquipment.save();
            await currentUser.save();
        }

        broadcast({ type: 'update', equipment: undesiredEquipment });

        return res.status(200).json({ message: 'User removed from queue successfully' });
        /*
        const { equipmentName: undesiredEquipmentName, username: currentUsername } = req.body;

        // Verify user exists
        const currentUser = await User.findOne({ username });
        if (!currentUser) return res.status(404).json({ message: 'User does not exist' });

        // Ensure User is already waiting in queue for equipment
        const undesiredEquipment = await Equipment.findOne({ name: undesiredEquipmentName, userQueue: currentUser._id });
        if (!undesiredEquipment) return res.status(403).json({ message: 'User does not exist in queue' });

        // Remove user from equipment queue
        const userIdx = undesiredEquipment.userQueue.indexOf(currentUser._id);
        if (userIdx > -1) {
            undesiredEquipment.userQueue.splice(userIdx, 1);
        }
        await undesiredEquipment.save();

        // Remove equipment from user queue
        currentUser.queuedEquipment = null;
        await currentUser.save();

        return res.status(200).json({ message: 'User removed from queue successfully' });
        */
    } catch (error) {
        console.error('Renege Queue Error:', error);  // Log the exact error
        res.status(500).json({ message: 'Error leaving queue' });
    }
});

module.exports = router;