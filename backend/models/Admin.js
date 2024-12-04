const mongoose = require('mongoose');
const Gym = require('./Gym');

const AdminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gyms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Gym' }]
});

const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;