const express = require('express');
const router = express.Router();
const Equipment = require('../models/Equipment');

// get all the inputted equipment from the database to display it in frontend
router.get('/fetchEquipment', async (req, res) => {
    try {
        //console.log("DEBUG");
        const equipmentList = await Equipment.find({}, 'name'); // only get the names
        //console.log(equimentList);
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
router.post('/renege', async (req, res) => {

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

module.exports = router;