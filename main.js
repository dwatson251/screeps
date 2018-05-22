const RoomController = require('RoomController');
const AutoSpawner = require('AutoSpawner');

const Job = require('JobFactory');
const Helper = require('Helpers');
const Test = require('Test');

// @TODO: BONUS: Detect when a screep is about to die, and offload it's resources
// @TODO: If we have extra jobs, spawn creeps to do them!
// @TODO: Create creeps based on job requirements and pick creeps based on parts for the jobs
// @TODO: Add a creep "assign" job, to assign a creep to a new room/controller
// @TODO: Add roads to exits
// @TODO: Build ramparts and walls programmitically (Using that circle algorith or sth)
// @TODO: Optimise the CPU usage by only checking for requirements at so many intervals per room (Each room could have a special ID and a modulus is applied to rooms.length)
// @TODO: Order jobs by priority
// @TODO: Detect when to stop upgrading

module.exports.loop = function () 
{
    const emergencyMode = false;
    
    Game.createJob = function(action, sourceId, params) {

        let sourceRoomName = Game.getObjectById(sourceId).room.name;
    
        if(action && sourceRoomName) {
    
            Memory.jobInstructions[sourceRoomName].push({
                id: 'job-user-console-' + Game.time,
                job: action,
                source: sourceId,
                params: params
            });
    
            return true;
        } else {
            return false;
        }
    };
    
    Game.resetJobs = function()
    {
        delete Memory.jobInstructions;
        delete Memory.activeRequirements;
    
        return true;
    };

    if(emergencyMode) {
        return;
    }
    
    /**
     * Reset the underworked creeps memory object
     */
    Memory.underworkedCreeps = [];
    
    /**
     * Limits the amount of CPU we can use on purpose
     * 
     * !!
     */
    this.cpuLimiter = 5;
    
    /**
     * Spawn a creep if we need to!
     */
    AutoSpawner.run();
    
    for(roomKey in Game.rooms) {
        let room = Game.rooms[roomKey];
        new RoomController(room.controller);
    }
}