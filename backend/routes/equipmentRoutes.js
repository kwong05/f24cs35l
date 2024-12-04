const express = require('express');
const router = express.Router();
const { addEquipment, getEquipment } = require('../controllers/equipmentController');
const authenticateToken = require('../middlewares/authenticateToken');
const isAdmin = require('../middlewares/isAdmin');

router.post('/addEquipment', authenticateToken, isAdmin, addEquipment);
router.get('/equipment', getEquipment);

module.exports = router;