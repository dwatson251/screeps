const JobBase = require('Job.Base');

/**
 * @namespace Job
 * 
 * Withdraws a specific resource from a source
 * 
 */
module.exports = class JobHarvest extends JobBase
{
    constructor(resource = RESOURCE_ENERGY) 
    {
        super();
        
        this.priority = 0;
        this.resource = resource;
        
        return this;
    }
    
    run() 
    {
        // @TODO: Suport multiple assignees
        
        const creep = this.assignees[0];
        
        if(creep.carry.energy < creep.carryCapacity) {
            
            var sources = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            
            if(creep.harvest(sources) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources);
            }
            
        } else {
            
            this.done();
        
        }
    }
}