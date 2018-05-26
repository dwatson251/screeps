const JobBase = require('Job.Base');

const HarvestRequirement = require('Requirements.Harvest');

/**
 * @namespace Job
 * 
 * Withdraws a specific resource from a source
 * 
 */
module.exports = class JobDeposit extends JobBase
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
        const creep = this.assignees[0];
        
        const closestDepositSource = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: (structure) => {
                return ((structure.structureType === STRUCTURE_SPAWN || structure.structureType === STRUCTURE_EXTENSION) && structure.energy < structure.energyCapacity);
            }
        });
        
        switch(creep.transfer(closestDepositSource, this.resource)) {
            
            case ERR_NOT_IN_RANGE:
                creep.moveTo(closestDepositSource);
                break;
                
            case ERR_NOT_ENOUGH_RESOURCES:
                let harvestRequirement = new HarvestRequirement(creep);
                let harvestResolution = harvestRequirement.getResolution();
                harvestResolution.assignees = [creep.id];
                this.addJobDependency(harvestResolution);
                break;
                
            case OK:
            default:
                this.done();
                break;
            
        }
    }
}