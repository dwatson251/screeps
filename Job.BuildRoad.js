const JobBase = require('Job.Base');
const Helper = require('Helpers');

/**
 * @namespace Job
 * 
 * A job specifically for creating a road from point A to point B
 * 
 */
module.exports = class JobBuildRoad extends JobBase
{
    constructor(target) 
    {
        super();
        
        this.priority = 0;
        
        this.target = Game.getObjectById(target);
        
        return this;
    }
    
    run() 
    {
        let roadPositions = this.source.pos.findPathTo(this.target);
        
        for(let roadPositionKey in roadPositions) {
            let roadPosition = roadPositions[roadPositionKey];
            let roomPosition = new RoomPosition(roadPosition['x'], roadPosition['y'], this.assignee.room.name);
            roomPosition.createConstructionSite(STRUCTURE_ROAD);
        }
        
        this.done();
    }
}