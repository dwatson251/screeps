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
        // @TODO: Remove hardcoded spawn
        
        /**
         * Checks whether the amount of resources available is too low to perform this job effectively,
         * and pushes an additional job to this creep.
         */
        if(this.assignee.carryCapacity > Game.spawns['home'].energy && this.assignee.carryCapacity < Game.spawns['home'].energyCapacity) {
            /** Harvest 4x as much as we need */
            for(let i = 0; i < 4; i++) {
                let harvestRequirement = new HarvestRequirement(Game.spawns['home']);
                let harvestResolution = harvestRequirement.getResolution();
                harvestResolution.assignee = this.assignee.id;
                this.assignee.memory.jobs.unshift(harvestResolution);
            }
        } else {
            /**
             * Attempts to withdraw from a source of energy
             */
            if(this.assignee.withdraw(this.source, this.resource) == ERR_NOT_IN_RANGE) {
                this.assignee.moveTo(this.source);
            } else {
                this.done();
            }
        }
        
    }
}