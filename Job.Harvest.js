const JobBase = require('Job.Base');

const HarvestRequirement = require('Requirements.Harvest');

/**
 * @namespace Job
 * 
 * Withdraws a specific resource from a source
 * 
 */
module.exports = class JobTransfer extends JobBase
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
        var creep = this.assignee;
        
        if(creep.carry.energy < creep.carryCapacity) {
            
            var sources = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            
            if(creep.harvest(sources) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources);
            }
        } else {
            if(this.source.energy < this.source.energyCapacity) {
                
                switch(creep.transfer(this.source, this.resource)) {
                    
                    case ERR_NOT_IN_RANGE:
                        creep.moveTo(this.source);
                        break;
                        
                    case OK:
                        this.done();
                        
                    default:
                        this.done();
                    
                }
            }
        }
    }
}