const Helper = require('Helpers');

/**
 * @namespace Job
 * 
 * Transfers a specified amount of a resource to a specific target
 * 
 */
module.exports = class JobFactory 
{
    constructor(roomName, jobInstruction) 
    {
        if(jobInstruction.job === undefined) {
            console.log('A job type was not specified');
            return false;    
        }
        
        if(!jobInstruction.assignees.length) {
            console.log('A job must have an assignee');
            return false;
        }
        
        if(!jobInstruction.params || !jobInstruction.params.length) {
            jobInstruction.params = [];
        }
        
        /**
         * Create the job object
         */
        const newJob = require('Job.' + Helper.ucFirst(jobInstruction.job));
        let job = new newJob(...jobInstruction.params);
        
        job.setId(jobInstruction.id);
        job.setAssignees(jobInstruction.assignees);
        job.setSource(jobInstruction.source);
        job.setMaxAssignees(jobInstruction.maxAssignees);
        job.setRoomName(roomName);
        
        /**
         * If this job was requiredBy a particular requirement, add it
         * to the job object
         */
        if(jobInstruction.requiredBy !== undefined) {
            job.setRequiredBy(jobInstruction.requiredBy);
        }
        
        /**
         * If this job is a dependency of another job, state the ID of it here:
         */
        if(jobInstruction.dependencyOf !== undefined) {
            job.setDependencyOf(jobInstruction.dependencyOf);
        }
        
        /**
         * If this job has a priority, set it here:
         */
        if(jobInstruction.priority) {
            job.setPriority(jobInstruction.priority);
        }
        
        return job;
    }
}