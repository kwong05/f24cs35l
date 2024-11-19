const mongoose = require('mongoose');

// TODO maybe add equipment reservation list to User?
const equipmentSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},    // name of the equipment - may or may not be unique
    currentUser: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },                     // which user is currently using the machine?
    userQueue: {type: [mongoose.Schema.Types.ObjectId], ref: 'User', required: true},                       // which users are currently waiting for the machine?
    unlockTime: {type: Date, required: true, default: Date.now()}   // when the equipment will next be available
});

module.exports = mongoose.model('Equipment', equipmentSchema);
