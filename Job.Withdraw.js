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
        // @TODO: Add support for multiple assignees (Only register as done when all creeps have completed the task)
        
        /**
         * Checks whether the amount of resources available is too low to perform this job effectively,
         * and pushes an additional job to this creep.
         */
        _.forEach(this.assignees, (assignee) => {
            if(assignee.carryCapacity > Game.spawns['home'].energy && assignee.carryCapacity < Game.spawns['home'].energyCapacity) {
                /** Harvest 3x as much as we need */
                for(let i = 0; i < 3; i++) {
                    let harvestRequirement = new HarvestRequirement(Game.spawns['home']);
                    let harvestResolution = harvestRequirement.getResolution();
                    harvestResolution.assignees = [assignee.id];
                    this.addJobDependency(harvestResolution);
                }
            } else {
                /**
                 * Attempts to withdraw from a source of energy
                 */
                if(assignee.withdraw(this.source, this.resource) == ERR_NOT_IN_RANGE) {
                    assignee.moveTo(this.source);
                } else {
                    this.done();
                }
            }
        });
        
    }
}