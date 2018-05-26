const EntityRoom = require('Entity.Room');
const AutoSpawner = require('AutoSpawner');

const Helper = require('Helpers');

/**
 * An object containing known allies, or, if possible, a list
 * of other opponents allies.
 * 
 * Intelligence like this may come in handy during combat or negotiations
 */
const allies = {
    'dnlwtsn': ['Divitto', 'HDMI'],
    'Divitto': ['HDMI'],
    'HDMI': ['Divitto'],
};

// @TODO: BONUS: Detect when a screep is about to die, and offload it's resources
// @TODO: If we have extra jobs, spawn creeps to do them!
// @TODO: Create creeps based on job requirements and pick creeps based on parts for the jobs
// @TODO: Add a creep "assign/ newRoom" job, to assign a creep to a new room/controller
// @TODO: Add roads to exits
// @TODO: Build ramparts and walls programmitically (Using that circle algorith or sth)
// @TODO: Order jobs by priority
// @TODO: Detect when to stop upgrading
// @TODO: Remove hardcoded mentions of spawns
// @TODO: On detection of unknown unit, greet, and detect whether friend or foe
// @TODO: Optimise withdraw script -> Only attempt to collect resources from a spawn if it is closer than harvesting a source
// @TODO: After sorting jobs by priority, if two jobs have the same priority, pick the closest
// @TODO: Fix multiple assignee bug
// @TODO: Fix autospawner part creator
// @TOOD: Add a structure collection builder with checks to see where it can be built, and rotation based on center of origin

module.exports.loop = function () 
{
    Game.helper = Helper;

    /**
     * If the console is generating errors, preventing any console commands,
     * set this to true so that normal script execution is interupted.
     */
    const emergencyMode = false;
    
    if(emergencyMode) {
        return;
    }
    
    /**
     * Spawn a creep if we need to!
     */
    (new AutoSpawner()).createCreep();

    /**
     * Initiate the global job list if it hasn't already
     */
    if(Memory.jobInstructions === undefined) {
        Memory.jobInstructions = {};
    }
    
    /**
     * Tests if the activeRequirements memory is set
     */
    if(!Memory.activeRequirements) {
        Memory.activeRequirements = {};
    }
    
    /**
     * Initialise each room under our control
     */
    _.forEach(Game.rooms, (room) => {
        new EntityRoom(room);
    });
}