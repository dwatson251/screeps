const Helper = require('Helpers');
const Job = require('JobFactory');

const HarvestRequirement = require('Requirements.Harvest');

module.exports = class EntityCreep 
{
    constructor(creep)
    {
        this.creep = creep;
        this.role = 'harvester';
        
        this.randomMessage = [
            '🔥',
            '💣',
        ];
        
        // this.creep.say(this.randomMessage[Math.floor(Math.random() * this.randomMessage.length)], true);
        
        if(Math.ceil(Math.random() * 10) === Game.time % 10) {
            this.creep.say(this.randomMessage[Math.floor(Math.random() * this.randomMessage.length)], true);
        }
    }
    
    getJobs(roomName, ignoreDependencyJobs = false)
    {
        /**
         * If the job instructions for this room are not set, set them up and return an empty array
         */
        if(Memory.jobInstructions === undefined) {
            Memory.jobInstructions = {};
            return [];
        }
        
        if(Memory.jobInstructions[roomName] === undefined) {
            Memory.jobInstructions[roomName] = [];
            return [];
        }
        
        /**
         * Returns jobs that has an assignee that match this creeps id
         */
        let jobs = _.filter(Memory.jobInstructions[roomName], (jobInstruction) => {
            return this.creep.id === _.find(jobInstruction.assignees, (assignee) => {
                return this.creep.id === assignee;
            });
        });

        if(ignoreDependencyJobs) {
            jobs = _.filter(jobs, (job) => {
                /**
                 * Returns false for jobs that have dependencies, if the ignoreDependencyJobs flag is set to true.
                 */
                return !(ignoreDependencyJobs && job.dependencyOf);
            });
        }

        return jobs;
    }
    
    work(roomName)
    {
        let creepsJobs = this.getJobs(roomName);
        
        if(creepsJobs.length) {
            
            let nextJob = this.getDependencies(roomName, creepsJobs[0]);
            
            let job = new Job(roomName, nextJob);
            return job.run();
            
        } else {
                
            return this.idle(roomName);
        }
    }
    
    /**
     * Given a job that has dependencies (Don't worry, this method will check that too), this method
     * will drill down until it finds a job without dependencies.
     */
    getDependencies(roomName, parentJob)
    {
        if(!parentJob.dependencies || !parentJob.dependencies.length) {
            return parentJob;
        }
        
        const dependencyJob = Helper.findJobInstructionInMemory(roomName, parentJob.dependencies[0]);
        
        return this.getDependencies(roomName, dependencyJob);
    }
    
    /**
     * Checks if the the assignee creep has died on us
     */
    isAlive()
    {
       return !!Game.getObjectById(this.creep);
    }
    
    idle(roomName) 
    {
        // @TODO: Remove hardcoded spawn
        let harvestRequirement = new HarvestRequirement(Game.spawns['home']);
        let harvestResolution = harvestRequirement.getResolution();
        harvestResolution.assignees = [this.creep.id];
        Memory.jobInstructions[roomName].push(harvestResolution);
    }
}