const Helper = require('Helpers');
const Job = require('JobFactory');

module.exports = class EntityCreep 
{
    constructor(creep)
    {
        this.creep = creep;
        this.role = 'harvester';
        
        if(!this.creep.memory.jobs) {
            this.creep.memory.jobs = [];
        }
    }
    
    restoreJobs(originalJobs) 
    {
        /**
         * Force the originalJobs to be an array even if we pass in one value:
         */
        if(typeof originalJobs !== 'object') {
            originalJobs = [originalJobs];
        }    
        
        this.jobs = originalJobs;
    }
    
    work()
    {
        if(this.creep.memory.jobs.length) {
            let job = new Job(this.creep.memory.jobs[0]);
            job.run();
        }
    }
    
    /**
     * Checks if the the assignee creep has died on us
     */
    isAlive()
    {
       return !!Game.getObjectById(this.assignee);
    }
}