const Helper = require('Helpers');

/**
 * @namespace Job
 * 
 * Transfers a specified amount of a resource to a specific target
 * 
 */
module.exports = class JobBase
{
    constructor() 
    {
        this.id = null;
        this.assignee = null;
        this.priority = 0;
        this.source = null;
        this.requiredBy = null;
    }
    
    /**
     * Removes all traces of this job existing. This job is now completed:
     * 
     * Traces of this job may be stored in up to 3 places:
     * 1) The creeps own memory
     * 2) The jobInstructions memory object
     * 3) the activeRequirements memory object
     */
    done()
    {
        let jobId = this.id;
        
        /**
         * Remove the job from the creeps job memory:
         */
        _.remove(this.assignee.memory.jobs, function(jobInstruction) {
            return jobId === jobInstruction.id;
        });
        
        /**
         * Remove the job from the job list
         */
        _.remove(Memory.jobInstructions, function(jobInstruction) {
            return jobId === jobInstruction.id;
        });
                
        /**
         * Remove the job requirement
         */
        Helper.removeRequirement(this.source, this.requiredBy);
    }
    
    run()
    {
        /**
         * Should be overridden by your actual job
         */
        return this.done();
    }
    
    setId(id)
    {
        this.id = id;
        
        return this;
    }
    
    setSource(source)
    {
        this.source = Game.getObjectById(source);
        
        return this;
    }
    
    setAssignee(assigneeId) 
    {
        this.assignee = assigneeId;
        
        return this;
    }
    
    setRequiredBy(requiredBy) 
    {
        this.requiredBy = requiredBy;
        
        return this;
    }
}