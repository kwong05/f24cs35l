const User = require('../models/User');

// This is only used in cronJob.js

// imagine a User that is actively using equipment A and wants to use equipment B

// Find the next available User in an Equipment queue and splice the queue, based on whether or not they are already using some Equipment
// Otherwise, return undefined
async function nextAvailableUser(eqQueue) {
    console.log("called.")
    // find the next user that is available to use equipment
    let currentUserID = undefined;
    for (let i = 0; i < eqQueue.length; i++) {
        let nextUserID = eqQueue[i];
        let nextUser = User.findById(nextUserID);

        // eligible user found; modify queue, return ID
        if (nextUser.currentEquipment = null) {
            console.log("user " + nextUser.username + " is eligible");
            currentUserID = nextUserID;
            eqQueue.splice(i, 1);
            break;
        }
        else {
            console.log("user " + nextUser.username + " is ineligible");
        };
    }
    console.log("end.");
    return currentUserID;
}

module.exports = { nextAvailableUser };