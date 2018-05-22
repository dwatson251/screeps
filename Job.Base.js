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
        this.roomName = null;
        this.dependencyOf = null;
        this.assignee = null;
        this.assignees = [];
        this.priority = 0;
        this.source = null;
        this.requiredBy = null;
        this.maxAssignees = 1;
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
         * Remove the job from the job list
         */
        _.remove(Memory.jobInstructions[this.roomName], function(jobInstruction) {
            return jobId === jobInstruction.id;
        });
        
        /**
         * If this job was a dependency for another job, remove this job
         * from the parents job dependency list
         */
        if(this.dependencyOf) {
            
            let jobDependencyOf = Helper.findJobInstructionInMemory(this.roomName, this.dependencyOf);
        
            if(jobDependencyOf !== undefined && jobDependencyOf.dependencies !== undefined && jobDependencyOf.dependencies.length) {
                _.remove(jobDependencyOf.dependencies, function(jobInstruction) {
                    return jobId === jobInstruction;
                });
            }
        }
                
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
    
    setRoomName(roomName)
    {
        this.roomName = roomName;
        
        return this;
    }
    
    setSource(source)
    {
        this.source = Game.getObjectById(source);
        
        return this;
    }
    
    setMaxAssignees(maxAssignees)
    {
        this.maxAssignees = maxAssignees;
        
        return this;
    }
    
    addAssignee(assigneeId) 
    {
        if(this.assignees.length < this.maxAssignees) {
            this.assignees.push(assigneeId);
        }
        
        return this;
    }
    
    setAssignees(assignees = []) 
    {
        _.forEach(assignees, (assignee) => {
           this.assignees.push(Game.getObjectById(assignee)); 
        });
        
        return this;
    }
    
    setRequiredBy(requiredBy) 
    {
        this.requiredBy = requiredBy;
        
        return this;
    }
    
    setDependencyOf(dependencyOf)
    {
        this.dependencyOf = dependencyOf;
        
        return this;
    }
    
    addJobDependency(jobInstruction)
    {
        let jobInstructionInMemory = Helper.findJobInstructionInMemory(this.roomName, this.id);
        
        jobInstruction.dependencyOf = this.id;
        
        if(!jobInstructionInMemory.dependencies) {
            jobInstructionInMemory.dependencies = [];
        }
        
        Memory.jobInstructions[this.roomName].push(jobInstruction);
        
        jobInstructionInMemory.dependencies.unshift(jobInstruction.id);
    }
}