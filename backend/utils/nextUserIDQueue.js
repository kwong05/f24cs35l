const User = require('../models/User');

// This is only used in cronJob.js

// imagine a User that is actively using equipment A and wants to use equipment B

// Return an array of IDs of eligible Users, based on whether or not they are already using some Equipment
function nextAvailableUsers(equipmentQueue) {    
    let eligibleQueue = equipmentQueue;

    for (let i = 0; i < eligibleQueue.length; i++) {
        let nextUserID = eligibleQueue[i];
        let nextUser = User.findById(nextUserID);

        // eligible user found; modify queue, return ID
        if (!!nextUser.currentEquipment) {
            console.log("user " + nextUser.username + " is eligible");
            break;
        }
        else {
            console.log("user " + nextUser.username + " is ineligible");
            eligibleQueue.splice(i, 1);
        };
    }
    return eligibleQueue;
}

module.exports = { nextAvailableUsers };