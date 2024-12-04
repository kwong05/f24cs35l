const mongoose = require('mongoose');
const Equipment = require('./Equipment');

const GymSchema = new mongoose.Schema({
    name: { type: String, required: true },
    equipments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' }]
});

const Gym = mongoose.model('Gym', GymSchema);

module.exports = Gym;