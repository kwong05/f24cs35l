const express = require('express');
const router = express.Router();
const { addEquipment, getEquipment } = require('../controllers/equipmentController');
const authenticateToken = require('../middlewares/authenticateToken');
const isAdmin = require('../middlewares/isAdmin');

router.post('/addEquipment', authenticateToken, isAdmin, addEquipment);
router.get('/equipment', getEquipment);

module.exports = router;

// get all the inputted equipment from the database to display it in frontend
app.get('/api/fetchEquipment', async (req, res) => {
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
