const JobBase = require('Job.Base');
const Helper = require('Helpers');

const WithdrawRequirement = require('Requirements.Withdraw');

/**
 * @namespace Job
 * 
 * Transfers a specified amount of a resource to a specific target
 * 
 */
module.exports = class JobUpgrade extends JobBase
{
    constructor() 
    {
        super();
        
        return this;
    }
    
    run() 
    {
        
        /**
         * @TODO: Add dependencies, so that if we're out of energy, it will run a different job
         */
        
        /**
         * Add completed clause to this job
         */
        let creep = this.assignee;
        
        if(this.source) {
            switch(creep.upgradeController(this.source)) {
                
                case ERR_NOT_ENOUGH_RESOURCES:
                    
                    // @TODO: Remove hardcoded spawn point
                    let withdrawRequirement = new WithdrawRequirement(Game.spawns['home']);
                    let withdrawResolution = withdrawRequirement.getResolution();
                    withdrawResolution.assignee = creep.id;
                    this.assignee.memory.jobs.unshift(withdrawResolution);
                    
                    break;
                    
                case ERR_NOT_IN_RANGE:
                    creep.moveTo(this.source);
                    break;
                    
                case ERR_INVALID_TARGET:
                    this.done();
                    break;
                
                default:
                    break;
            }
        } else {
            this.done();
        }
    }
}