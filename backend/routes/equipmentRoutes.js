const express = require('express');
const router = express.Router();
const { broadcast } = require('../utils/websocket');
const { authenticateToken, checkAdmin } = require('../utils/auth');
const { checkAndUpdateEquipmentStatus } = require('../utils/cronJob');
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

// Add equipment (admin only)
router.post('/addEquipment', authenticateToken, checkAdmin, async (req, res) => {
    try {
        const { name: equipmentName } = req.body;

        // console.log('Checking if equipment exists:', equipmentName);
        const equipmentExists = await Equipment.findOne({ name: equipmentName });

        if (equipmentExists) {
            console.error('Equipment already exists:', equipmentName);
            return res.status(400).json({ message: 'Equipment name already taken' });
        }

        // console.log('Saving new equipment to database:', equipmentName);
        const newEquipment = new Equipment({ name: equipmentName });
        await newEquipment.save();
        broadcast({ type: 'add', equipment: newEquipment });
        await checkAndUpdateEquipmentStatus();
        res.status(201).json({ message: 'Equipment created successfully' });
    } catch (error) {
        console.error('Equipment Add Error:', error);  // Log the exact error
        res.status(500).json({ message: 'Error creating equipment' });
    }
});

// Delete equipment (admin only)
router.delete('/deleteEquipment', authenticateToken, checkAdmin, async (req, res) => {
    try {
        const { _id: equipmentId } = req.body;

        // console.log('Removing equipment from database:', equipmentId);
        await Equipment.deleteOne({ _id: equipmentId });
        broadcast({ type: 'delete', equipment: equipmentId });
        await checkAndUpdateEquipmentStatus();
        res.status(200).json({ message: 'Equipment removed successfully' });
    } catch (error) {
        console.error('Equipment Remove Error:', error);  // Log the exact error
        res.status(500).json({ message: 'Error removing equipment' });
    }
});

// Toggle equipment status (admin only)
router.put('/toggleStatus', authenticateToken, checkAdmin, async (req, res) => {
    try {
        const { _id: equipmentId } = req.body;

        // Find the equipment by its ID
        const equipment = await Equipment.findById(equipmentId);
        if (!equipment) {
            return res.status(404).json({ message: 'Equipment not found' });
        }

        // Toggle the status of the equipment
        equipment.status = !equipment.status;

        // Save the updated equipment
        await equipment.save();

        // Broadcast the change
        broadcast({ type: 'update', equipment });
        await checkAndUpdateEquipmentStatus();

        res.status(200).json({ message: 'Equipment status toggled successfully', equipment });
    } catch (error) {
        console.error('Equipment Toggle Status Error:', error);  // Log the exact error
        res.status(500).json({ message: 'Error toggling equipment status' });
    }
});

// Toggle equipment status (admin only)
router.put('/removeCurrentUser', authenticateToken, checkAdmin, async (req, res) => {
    try {
        const { _id: equipmentId } = req.body;

        // Find the equipment by its ID
        const equipment = await Equipment.findById(equipmentId);
        if (!equipment) {
            return res.status(404).json({ message: 'Equipment not found' });
        }

        // Set unlock time to now
        equipment.unlockTime = new Date();

        // Save the updated equipment
        await equipment.save();

        // Broadcast the change
        broadcast({ type: 'update', equipment });
        await checkAndUpdateEquipmentStatus();

        res.status(200).json({ message: 'Current user removed successfully', equipment });
    } catch (error) {
        console.error('Equipment Toggle Status Error:', error);  // Log the exact error
        res.status(500).json({ message: 'Error toggling equipment status' });
    }
});

// Join queue for equipment
router.post('/join', async (req, res) => {
    try {
        const { user: username, id: equipmentId } = req.body;
        // console.log(username, equipmentId);
        // Verify user exists
        const currentUser = await User.findOne({ username });
        if (!currentUser) return res.status(404).json({ message: 'User does not exist' });


        // Ensure User is not already waiting in queue for equipment
        let isQueued = false;
        if (currentUser.queuedEquipment != null) isQueued = true;
        const desiredEquipment = await Equipment.findOne({ _id: equipmentId });
        const currentEquipment = currentUser.currentEquipment;

        if (desiredEquipment.status === false) {
            return res.status(403).json({ message: 'Equipment is disabled' });
        }

        // Check if the user is in queue for another equipment but currentEquipment is not set
        if (isQueued && !currentEquipment) {
            const queuedEquipment = await Equipment.findOne({ _id: currentUser.queuedEquipment });
            const unlockTime = new Date(queuedEquipment.unlockTime);
            const now = new Date();
            const minutesRemaining = Math.ceil((unlockTime - now) / 60000);

            console.log(minutesRemaining, desiredEquipment.currentUser);
            if ((queuedEquipment.userQueue.length > 1) && !desiredEquipment.currentUser) {
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
        await checkAndUpdateEquipmentStatus();
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
        let isQueued = false;
        if (currentUser.queuedEquipment != null) isQueued = true;
        let isUsing = false;
        if (currentUser.currentEquipment != null) isUsing = true;

        const undesiredEquipment = await Equipment.findOne({ _id: equipmentId });
        const currentEquipment = currentUser.currentEquipment;
        //const undesiredName = undesiredEquipment.name;
        //const currentName = currentEquipment.name;
        const queuedEquipment = currentUser.queuedEquipment;
        /*
        if ((!isUsing || currentEquipment != undesiredEquipment._id) && (!isQueued || !(queuedEquipment.includes(undesiredEquipment._id)))) {
            return res.status(403).json({ message: `User is not using or queued for this equipment`});
        }
        */

        let userIdx = 0;
        // Remove user from equipment queue if in queue
        
        if (isQueued && queuedEquipment._id.equals(undesiredEquipment._id)) {
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
        else if (currentEquipment && currentEquipment.equals(undesiredEquipment._id)) {
            undesiredEquipment.currentUser = null;
            currentUser.currentEquipment = null;
            await undesiredEquipment.save();
            await currentUser.save();
        }

        else {
            return res.status(403).json({ message: `User is not using or queued for this equipment`});
        }

        broadcast({ type: 'update', equipment: undesiredEquipment });
        await checkAndUpdateEquipmentStatus();
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
