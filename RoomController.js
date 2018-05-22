const Helper = require('Helpers');
const EntityCreep = require('Entity.Creep');
const EntityStructure = require('Entity.Structure');
const EntityResource = require('Entity.Resource');

/**
 * A controller that controls the room and everything in it,
 * including creeps, structures and jobs.
 */
module.exports = class RoomController {
    
    constructor(roomController)
    {
        this.id = roomController.id;
        this.name = roomController.room.name;
        this.room = roomController.room;
        
        /**
         * Initiate the global job list if it hasn't already
         */
        if(Memory.jobInstructions === undefined) {
            Memory.jobInstructions = {};
        }
        
        /**
         * Initiate the job list for this room if it hasn't yet been created
         */
        if(Memory.jobInstructions[this.name] === undefined) {
            console.log('Creating new instruction room category: ', this.name);
            Memory.jobInstructions[this.name] = [];
        }
        
        /**
         * The maximum number of jobs a creep can have before it becomes too busy to take on new jobs
         */
        this.workIntensity = 1;
        
        this.spawns = this.getSpawns();
        this.structures = this.getStructuresAsEntities();
        this.creepEntities = this.getCreepsAsEntities();
        
        /**
         * Checks if the original assignee of each job is still active,
         * if not, deletes the assignee from the job
         */
        _.forEach(Memory.jobInstructions[this.name], (jobInstruction) => {
            _.remove(jobInstruction.assignees, (assigneeId) => {
                return !Game.getObjectById(assigneeId);
            });
        });
        

            

        
        /**
         * Get unassigned jobs
         */
        const unassignedJobInstructions = Helper.findUnassignedJobs(this.name);
        const assistanceJobInstructions = Helper.findAssistanceJobs(this.name);
        
        /**
         * Get inactive creeps to pickup on unassigned jobs
         */
        if(this.creepEntities.length) {
            if(unassignedJobInstructions.length) {
                
                for(let creepKey in this.creepEntities) {
                    
                    let creepEntity = this.creepEntities[creepKey];
                    
                    if(creepEntity.getJobs(this.name, true).length < this.workIntensity) {
                        let unassignedJobInstruction = unassignedJobInstructions[0];

                        if(unassignedJobInstruction.maxAssignees > unassignedJobInstruction.assignees.length) {
                            unassignedJobInstruction.assignees.push(creepEntity.creep.id);
                        }
                    }
                }

            } else {
                if(assistanceJobInstructions.length) {

                    for(let creepKey in this.creepEntities) {

                        let creepEntity = this.creepEntities[creepKey];

                        if(creepEntity.getJobs(this.name, true).length < this.workIntensity) {
                            let assistanceJobInstruction = assistanceJobInstructions[0];

                            if(assistanceJobInstruction.maxAssignees > assistanceJobInstruction.assignees.length) {
                                assistanceJobInstruction.assignees.push(creepEntity.creep.id);
                            }
                        }
                    }

                }
            }
        }
    
        /**
         * Lets get these creeps working!
         */
        for(let creepKey in this.creepEntities) {
            this.creepEntities[creepKey].work(this.name);
        }
    }
    
    /**
     * Assign structures in this room an entityStructure object
     */
    getStructuresAsEntities()
    {
        let structureEntities = [];
         
        // All structures in room
        let allStructuresInRoom = this.room.find(FIND_STRUCTURES);

        for(let structureKey in allStructuresInRoom) {
            let entity = new EntityStructure(allStructuresInRoom[structureKey], true);
            let entityNewJobs = entity.getJobs();
            Memory.jobInstructions[this.name] = Memory.jobInstructions[this.name].concat(entityNewJobs);
            structureEntities.push(entity);
        }
        
        /**
         * Assign construction sites an entityConstructionSite object
         */
        
        let allConstructionSitesInRoom = this.room.find(FIND_MY_CONSTRUCTION_SITES);
         
        for(let constructionSiteKey in allConstructionSitesInRoom) {
            let entity = new EntityStructure(allConstructionSitesInRoom[constructionSiteKey], false);
            let entityNewJobs = entity.getJobs();
            Memory.jobInstructions[this.name] = Memory.jobInstructions[this.name].concat(entityNewJobs);
            structureEntities.push(entity);
        }
        
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
    
    getSpawns()
    {
        return this.room.find(FIND_MY_SPAWNS);
    }
    
}