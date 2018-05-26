const JobBase = require('Job.Base');
const Helper = require('Helpers');

/**
 * @namespace Job
 * 
 * A job specifically for creating a road from point A to point B
 * 
 */
module.exports = class JobPlaceConstructionSite extends JobBase
{
    constructor(structureType, target) 
    {
        super();
        
        this.priority = 0;
        
        this.structureType = structureType;
        this.target = Game.getObjectById(target);
        
        return this;
    }
    
    run() 
    {
        const assignee = this.assignees[0];
        
        // @TODO: Remove hardcoded spawn
        let positions = this.source.pos.findPathTo(this.target, {
            costCallback: function(roomName, costMatrix) {
                
                _.forEach(Game.spawns['home'].room.find(FIND_STRUCTURES), (obstacle) => {
                    costMatrix.set(obstacle.pos.x, obstacle.pos.y, 255);
                });
                
                return costMatrix;
            },
        });
        
        for(let positionKey in positions) {
            let position = positions[positionKey];
            let roomPosition = new RoomPosition(position['x'], position['y'], assignee.room.name);
            roomPosition.createConstructionSite(this.structureType);
        }
        
        this.done();
    }
}