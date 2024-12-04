const Equipment = require('../models/Equipment');

async function addEquipment(req, res) {
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
        console.error('Equipment Add Error:', error);
        res.status(500).json({ message: 'Error creating equipment' });
    }
}

async function getEquipment(req, res) {
    try {
        const equipmentList = await Equipment.find({}, 'name');
        res.json(equipmentList);
    } catch (err) {
        console.error('Error retrieving equipment data:', err);
        res.status(500).json({ message: 'Error retrieving equipment data' });
    }
}

module.exports = {
    addEquipment,
    getEquipment
};