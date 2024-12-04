const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    currentEquipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: false },
    queuedEquipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: false },
    favoritesList: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: false }
});

module.exports = mongoose.model('User', userSchema);
