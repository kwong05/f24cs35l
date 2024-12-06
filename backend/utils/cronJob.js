const cron = require('node-cron');
const Equipment = require('../models/Equipment');
const User = require('../models/User');
const { broadcast } = require('./websocket'); // Import broadcast function

// Function to check for lapsed equipment and transfer to next user
const checkAndUpdateEquipmentStatus = async () => {
    try {
        const readyEquipment = await Equipment.find({ unlockTime: { $lte: new Date() } });
        for (const readyE of readyEquipment) {
            const equipmentId = readyE._id;

            // Case 1: Equipment has a current user and a non-empty queue
            if (readyE.currentUser && readyE.userQueue.length > 0) {
                const user = await User.findById(readyE.currentUser);
                user.currentEquipment = null;
                await user.save();

                readyE.currentUser = readyE.userQueue.shift();
                const newUser = await User.findById(readyE.currentUser);
                newUser.currentEquipment = equipmentId;
                newUser.queuedEquipment = null;

                const now = new Date(readyE.unlockTime);
                now.setMinutes(now.getMinutes() + 15);
                readyE.unlockTime = now;

                await readyE.save();
                await newUser.save();
                broadcast({ type: 'update', equipment: readyE });
                // console.log(`[${currentTime}] Equipment ${equipmentId}: User ${user._id} removed, User ${newUser._id} assigned, unlock time set to ${readyE.unlockTime}`);
            }
            // Case 2: Equipment has no current user but a non-empty queue
            else if (!readyE.currentUser && readyE.userQueue.length > 0) {
                readyE.currentUser = readyE.userQueue.shift();
                const newUser = await User.findById(readyE.currentUser);
                newUser.currentEquipment = equipmentId;
                newUser.queuedEquipment = null;

                const now = new Date(readyE.unlockTime);
                now.setMinutes(now.getMinutes() + 15);
                readyE.unlockTime = now;

                await readyE.save();
                await newUser.save();
                broadcast({ type: 'update', equipment: readyE });
                // console.log(`[${currentTime}] Equipment ${equipmentId}: User ${newUser._id} assigned, unlock time set to ${readyE.unlockTime}`);
            }
            // Case 3: Equipment has a current user but an empty queue
            else if (readyE.currentUser && readyE.userQueue.length === 0) {
                const user = await User.findById(readyE.currentUser);
                user.currentEquipment = null;
                await user.save();

                readyE.currentUser = null;
                readyE.unlockTime = new Date();
                await readyE.save();
                broadcast({ type: 'update', equipment: readyE });
                // console.log(`[${currentTime}] Equipment ${equipmentId}: User ${user._id} removed, no new user assigned`);
            }
            // Case 4: Equipment has no current user and an empty queue
            else {
                readyE.unlockTime = new Date();
                await readyE.save();
                broadcast({ type: 'update', equipment: readyE });
                // console.log(`[${currentTime}] Equipment ${equipmentId}: No current user, no new user assigned`);
            }
        }
    } catch (error) {
        console.error('Error in cron job:', error);
    }
};

// Schedule the cron job to run every 10 seconds
cron.schedule('* * * * * *', checkAndUpdateEquipmentStatus);

module.exports = { checkAndUpdateEquipmentStatus };