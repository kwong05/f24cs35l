const express = require('express');
const router = express.Router();
const { addEquipment, getEquipment } = require('../controllers/equipmentController');
const authenticateToken = require('../middlewares/authenticateToken');
const isAdmin = require('../middlewares/isAdmin');

router.post('/addEquipment', authenticateToken, isAdmin, addEquipment);
router.get('/equipment', getEquipment);

module.exports = router;

// get all the inputted equipment from the database to display it in frontend
app.get('/fetchEquipment', async (req, res) => {
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

app.post('/addEquipment', async (req, res) => {
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

app.post('/removeEquipment', async (req, res) => {
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