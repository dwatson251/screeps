const Helper = require('Helpers');
const EntityCreep = require('Entity.Creep');
const EntityStructure = require('Entity.Structure');
const EntityResource = require('Entity.Resource');

/**
 * A controller that controls the room and everything in it,
 * including creeps, constrollers, structures and jobs.
 */
module.exports = class RoomEntity {
    
    constructor(room)
    {
        this.room = room;
        
        /**
         * Initiate the job list for this room if it hasn't yet been created
         */
        if(Memory.jobInstructions[this.room.name] === undefined) {
            console.log('Creating new instruction room category: ', this.room.name);
            Memory.jobInstructions[this.room.name] = [];
        }
        
        /**
         * Get an idea of the owned objects in this room.
         */
        this.ownedStructures = this.getStructuresAsEntities();
        
        /**
         * The maximum number of jobs a creep can have before it becomes too busy to take on new jobs
         * (Excluding dependency jobs)
         * 
         * !!
         */
        this.workIntensity = 1;
        
        /**
         * Create a new entity for all existing creeps
         */
        this.creepEntities = this.getCreepsAsEntities();
        
        /**
         * Checks if the original assignee of each job is still alive,
         * if not, deletes the assignee from the job
         */
        this.unassignDeadCreeps();
        
        /**
         * Assigns creeps to next available jobs
         */
        this.assignJobs();
    
        /**
         * Lets get these creeps working!
         */
        for(let creepKey in this.creepEntities) {
            this.creepEntities[creepKey].work(this.room.name);
        }
    }
    
    /**
     * Assign structures in this room an entityStructure object
     */
    getStructuresAsEntities()
    {
        let structureEntities = [];
        
        const structureTypes = {
            'structure': this.room.find(FIND_STRUCTURES),
            'construction': this.room.find(FIND_MY_CONSTRUCTION_SITES),
        };
        
        _.forEach(structureTypes, (structures, structureType) => {
            _.forEach(structures, (structure) => {
               
                /**
                 * If the structure type is a construction, we can set this flag to false.
                 */
                const buildingConstructed = (structureType !== 'construction');
                
                /**
                 * Create a new structure entity - this will check the structures requirements
                 */
                const entity = new EntityStructure(structure, buildingConstructed);
                
                /** 
                 * Get this structures proposed jobs:
                 */
                Memory.jobInstructions[this.room.name] = Memory.jobInstructions[this.room.name].concat(entity.getJobs(this.room.name));
               
                /**
                 * Add this structure to the structureEntities return, so it can be added to the room controller
                 */
                structureEntities.push(entity);
               
            });
        });
        
        return structureEntities;
    }
    
    /**
     * Assign creeps an EntityCreep object
     */
    getCreepsAsEntities()
    {
        let creepEntities = [];
        
        let creepsInRoom = this.room.find(FIND_MY_CREEPS);
        
        for(let creepKey in creepsInRoom) {
            let creepEntity = new EntityCreep(creepsInRoom[creepKey]);
            creepEntities.push(creepEntity);
        }
        
        return creepEntities;
    }
    
    addJobInstruction(jobInstruction)
    {
        return Memory.jobInstructions[this.room.name].push(jobInstruction);
    }
    
    unassignDeadCreeps()
    {
        _.forEach(Memory.jobInstructions[this.room.name], (jobInstruction) => {
            _.remove(jobInstruction.assignees, (assigneeId) => {
                return !Game.getObjectById(assigneeId);
            });
        });
    }
    
    /**
     * Assigns creeps job instructions
     */
    assignJobs()
    {
        /**
         * First, check if there are any creeps at all!
         */
        if(!this.creepEntities.length) {
            return;
        }
        
        /**
         * Define the variable that will hold the next required job.
         */
        let nextJob = null;
        
        /**
         * Get unassigned job instructions
         * 
         * These are jobs that have 0 assignees
         */
        const unassignedJobInstructions = Helper.findUnassignedJobs(this.room.name);
        
        /**
         * Check whether there are any unassigned jobs.
         * 
         * If there are not any jobs, check for jobs that creeps
         * could help out on
         */
        if(unassignedJobInstructions.length) {
            
            /**
             * Set the next job to the very first unnassigned job instruction in the list
             */
            nextJob = unassignedJobInstructions[0];
            
        } else {
            
            /**
             * If no unassigned jobs were found, search for jobs that creeps
             * could help out on
             */
            const assistanceJobInstructions = Helper.findAssistanceJobs(this.room.name);
            
            if(assistanceJobInstructions.length) {
                
                nextJob = assistanceJobInstructions[0];
            }
        }
        
        /**
         * If by this point there are no appointable jobs, exit out of this
         * method
         */
        if(!nextJob) {
            return false;
        }
        
        const idealCreep = this.getMostIdealCreep(nextJob);
        
        if(idealCreep) {
            nextJob.assignees.push(idealCreep.creep.id);
        }
    }
    
    /**
     * Given a job instruction, picks out an ideal creep for the job.
     * 
     * This could be based on whether they are currently free, whether they match
     * the roles required for the job, or how close they are to the source of
     * the job.
     */
    getMostIdealCreep(jobInstruction)
    {
        /**
         * Check whether this jobInstruction contains any required roles.
         * 
         * Required roles are in order from most desirable to least desirable,
         * but if a creep isn't in the list, we can't assign the job at all!
         * 
         * A job must now have at least one required role.
         */
        if(!jobInstruction.rolesRequired) {
            return false;
        }
        
        /**
         * Find ideal creeps
         */
        const idealCreeps = _.filter(this.creepEntities, (creep) => {
            
            /**
             * Get all jobs that this creep has (excluding dependency jobs) and
             * check if the length of them is less than the desired work intensity.
             * 
             * If this creep is overworked, it is definately not an ideal candidate
             */
            if(creep.getJobs(this.room.name, true).length >= this.workIntensity) {
                return false;
            }
            
            /**
             * Don't include creeps that are already assigned to this job:
             */
            if(_.includes(jobInstruction.assignees, creep.id)) {
                return false;
            }

            /**
             * Find creeps that match any of the job instructions required roles
             */
            return _.includes(jobInstruction.rolesRequired, creep.role);
        });
        
        /**
         * Do not do any further computation if there were no ideal creeps:
         */
        if(!idealCreeps.length) {
            return false;
        }
        
        /**
         * Sort the creeps in to an order of most ideal to least ideal:
         */
        idealCreeps.sort((creepEntityA, creepEntityB) => {
           return jobInstruction.rolesRequired.indexOf(creepEntityA.role) - jobInstruction.rolesRequired.indexOf(creepEntityB.role);
        });
        
        /**
         * Return the most ideal creep
         */
        return idealCreeps[0];
    }
}