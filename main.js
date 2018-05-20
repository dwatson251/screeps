const roomController = require('RoomController');
const AutoSpawner = require('AutoSpawner');

const Job = require('JobFactory');
const EntityCreep = require('Entity.Creep');
const EntityStructure = require('Entity.Structure');
const EntityResource = require('Entity.Resource');
const Helper = require('Helpers');
const Test = require('Test');

module.exports.loop = function () 
{
    // return;
    
    /** @TODO: Abstract structures and resoures in to one class, POI perhaps? */
    this.structures = [];
    this.resources = [];
    this.creepEntities = [];
    
    // @TODO: If a screep dies, reassign the job back in to unassignedJobs / BONUS: Detect when a screep is about to die, and offload it's resources
    
    /**
     * Reset the underworked creeps memory object
     */
    Memory.underworkedCreeps = [];
    
    /**
     * Initiate the job list
     */
    if(!Memory.jobInstructions) {
        Memory.jobInstructions = [];
    }
    
    /**
     * The maximum number of jobs a creep can have before it becomes too busy to take on new jobs
     * 
     * !!
     */
    this.workIntensity = 1;
    
    /**
     * Limits the amount of CPU we can use on purpose
     * 
     * !!
     */
    this.cpuLimiter = 5;
    
    /**
     * If we were unable to perform a particular job, add it to the job queue:
     * 
     * !!
     */
    this.job_queue = [];
    
    /**
     * Assign structures an entityStructure object
     */
    for(structureKey in Game.structures) {
        let entity = new EntityStructure(Game.structures[structureKey], true);
        Memory.jobInstructions = entity.getJobs().concat(Memory.jobInstructions.concat());
        this.structures.push(entity);
    }
    
    /**
     * Assign construction sites an entityConstructionSite object
     */
    for(constructionSiteKey in Game.constructionSites) {
        let entity = new EntityStructure(Game.constructionSites[constructionSiteKey], false);
        Memory.jobInstructions = entity.getJobs().concat(Memory.jobInstructions.concat());
        this.structures.push(entity);
    }
    
    // let resourceLocation = Game.spawns['home'].pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    // let resource = new EntityResource(resourceLocation);
    // Memory.jobInstructions = resource.getJobs().concat(Memory.jobInstructions.concat());
    // this.resources.push(resource);
    
    /**
     * Assign creeps an EntityCreep object
     */
    for(creepKey in Game.creeps) {
        
        let creepEntity = new EntityCreep(Game.creeps[creepKey]);
        
        this.creepEntities.push(creepEntity);
    }
    
    /**
     * Checks if the original assignee of each job is still active,
     * if not, deletes the assignee to be put back in to the unassigned job
     * pool
     */
    for(let jobInstructionKey in Memory.jobInstructions) {
        let jobInstruction = Memory.jobInstructions[jobInstructionKey];
        if(!Game.getObjectById(jobInstruction.assignee)) {
            jobInstruction.assignee = null;
        }
    }
    
    /**
     * Spawn a creep if we need to!
     */
    AutoSpawner.run();
    
    /**
     * Filter jobs already picked up by creeps:
     * @TODO: Filter duplicate jobs
     */
    Memory.unassignedJobInstructions = _.filter(Memory.jobInstructions, function(job) {
        return !job.assignee;
    });
    
    /**
     * Get inactive creeps to pickup on unassigned jobs
     */
    if(this.creepEntities.length) {
        if(Memory.unassignedJobInstructions.length) {
            
            for(creepKey in this.creepEntities) {
                
                let creepEntity = this.creepEntities[creepKey];
                
                if(creepEntity.creep.memory.jobs.length < this.workIntensity) {
                    
                    let unassignedJobInstruction = _.find(Memory.unassignedJobInstructions, function(unassignedJobInstruction) {
                        return !unassignedJobInstruction.assignee;
                    });
                    
                    if(unassignedJobInstruction) {
                        unassignedJobInstruction.assignee = creepEntity.creep.id;
                        creepEntity.creep.memory.jobs.unshift(unassignedJobInstruction);
                    }
                }
                
            }
            
        }
    }

    /**
     * Lets get these creeps working!
     */
    for(let creepKey in this.creepEntities) {
        this.creepEntities[creepKey].work();
    }
    
    Game.createJob = function(action, sourceId, params) {
        if(action) {
            
            Memory.jobInstructions.push({
                id: 'job-user-console-' + Game.time,
                job: action,
                source: sourceId,
                params: params
            });
            
            return true;
        } else {
            return false;
        }
    }
}