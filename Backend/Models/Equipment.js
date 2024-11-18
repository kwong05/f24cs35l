const mongoose = require('mongoose');
const User = require('./User');

// TODO maybe add equipment reservation list to User?
const equipmentSchema = new mongoose.Schema({
    equipmentName: {type: String, required: true, unique: true},    // name of the equipment - may or may not be unique
    currentUser: {type: User, required: false},                     // which user is currently using the machine?
    userQueue: {type: [User], required: true},                       // which users are currently waiting for the machine?
    unlockTime: {type: Date, required: true, default: Date.now()}   // when the equipment will next be available
});

module.exports = mongoose.model('Equipment', equipmentSchema)
