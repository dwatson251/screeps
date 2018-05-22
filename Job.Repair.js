const JobBase = require('Job.Base');
const Helper = require('Helpers');

const WithdrawRequirement = require('Requirements.Withdraw');

/**
 * @namespace Job
 * 
 * Transfers a specified amount of a resource to a specific target
 * 
 */
module.exports = class JobRepair extends JobBase
{
    constructor() 
    {
        super();
        
        return this;
    }
    
    run() 
    {
        const creeps = this.assignees;
        
        if(this.source) {
            
            if(this.source.hits < this.source.hitsMax) {
        
                _.forEach(creeps, (creep) => {
                    
                    switch(creep.repair(this.source)) {
                        
                        case ERR_NOT_ENOUGH_RESOURCES:
                            
                            let withdrawRequirement = new WithdrawRequirement(creep);
                            let withdrawResolution = withdrawRequirement.getResolution();
                            withdrawResolution.assignees = [creep.id];
                            this.addJobDependency(withdrawResolution);
                            
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
                });
                
            } else {
                this.done();
            }
            
        } else {
            this.done();
        }
    }
}