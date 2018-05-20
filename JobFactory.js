const Helper = require('Helpers');

/**
 * @namespace Job
 * 
 * Transfers a specified amount of a resource to a specific target
 * 
 */
module.exports = class JobFactory 
{
    constructor(jobInstruction) 
    {
        if(jobInstruction.job === undefined) {
            console.log('A job type was not specified');
            return false;    
        }
        
        if(jobInstruction.assignee === undefined) {
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
        job.setAssignee(Game.getObjectById(jobInstruction.assignee));
        job.setSource(jobInstruction.source);
        
        /**
         * If this job was requiredBy a particular requirement, add it
         * to the job object
         */
        if(jobInstruction.requiredBy !== undefined) {
            job.setRequiredBy(jobInstruction.requiredBy);
        }
        
        return job;
    }
}