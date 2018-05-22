const JobBase = require('Job.Base');
const Helper = require('Helpers');

const WithdrawRequirement = require('Requirements.Withdraw');

/**
 * @namespace Job
 * 
 * Transfers a specified amount of a resource to a specific target
 * 
 */
module.exports = class JobBuild extends JobBase
{
    constructor() 
    {
        super();
        
        return this;
    }
    
    run() 
    {
        if (this.source) {

            _.forEach(this.assignees, (assignee) => {

                switch (assignee.build(this.source)) {

                    case ERR_NOT_ENOUGH_RESOURCES:

                        let withdrawRequirement = new WithdrawRequirement(assignee);
                        let withdrawResolution = withdrawRequirement.getResolution();
                        withdrawResolution.assignees = [assignee.id];
                        this.addJobDependency(withdrawResolution);

                        break;

                    case ERR_NOT_IN_RANGE:
                        assignee.moveTo(this.source);
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
    }
}