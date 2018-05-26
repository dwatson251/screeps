/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('Helpers');
 * mod.thing == 'a thing'; // true
 */

module.exports = {

    ucFirst: function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },
    
    censor: function(censor) {
      var i = 0;
    
      return function(key, value) {
        if(i !== 0 && typeof(censor) === 'object' && typeof(value) == 'object' && censor == value) 
          return '[Circular]'; 
    
        if(i >= 29) // seems to be a harded maximum of 30 serialized objects?
          return '[Unknown]';
    
        ++i; // so we know we aren't using the original object anymore
    
        return value;  
      }
    },
    
    findJobInstructionInMemory: function(roomName, jobId)
    {
        return _.find(Memory.jobInstructions[roomName], (jobInstruction) => {
            return jobInstruction.id === jobId;
        });
    },
    
    addRequirement: function(structureId, requirementKey)
    {
        if(Memory.activeRequirements[structureId] === undefined) {
            Memory.activeRequirements[structureId] = [];    
        }
        
        Memory.activeRequirements[structureId].push(requirementKey);
    },
    
    removeRequirement: function(structure, requirementKey) 
    {
        if(!structure) {
            
        } else {
            if(requirementKey) {
                if(Memory.activeRequirements[structure.id].indexOf(requirementKey) !== -1) {
                    requirementIndex = Memory.activeRequirements[structure.id].indexOf(requirementKey);
                    Memory.activeRequirements[structure.id].splice(requirementIndex, 1);
                }
            }
        }
    },
    
    uid: function()
    {
        return Math.floor(new Date().valueOf() * Math.random());
    },
    
    /**
     * Return an array of jobs from the memory job object
     * that have not been assigned by a creep in a specified room.
     */
    findUnassignedJobs: function(roomName)
    {
        let unassignedJobs = _.filter(Memory.jobInstructions[roomName], function(job) {

            if(job.assignees === undefined) {
                job.assignees = [];
            }

            return job.assignees.length === 0;
        });
        
        return _.sortByOrder(unassignedJobs, ['priority'], ['desc']);
    },
    
    /**
     * Return a list of jobs in this room that have assignees, but the job 
     * allows multiple assignees and the assignee limit is not reached.
     */
    findAssistanceJobs: function(roomName)
    {
        let assistanceJobs = _.filter(Memory.jobInstructions[roomName], function(job) {

            if(job.assignees === undefined) {
                job.assignees = [];
            }

            return job.assignees.length < job.maxAssignees;
        });
        
        return _.sortByOrder(assistanceJobs, ['priority'], ['desc']);
    },
    
    /**
     * Gets all the jobs assigned to this creep
     */
    getCreepJobs: function(creepId)
    {
        let creepJobs = {};
        
        _.forEach(Memory.jobInstructions, (roomJobInstructions) => {
            Object.assign(creepJobs, _.filter(roomJobInstructions, (jobInstruction) => {
                return creepId === _.find(jobInstruction.assignees, (assigneeId) => {
                   return assigneeId === creepId;
                });
            }));
        });
        
        return creepJobs;
    },
    
    createJob: function(action, sourceId, params)
    {
        let sourceRoomName = null;
        
        if(typeof sourceId === 'string') {
            sourceRoomName = Game.getObjectById(sourceId).room.name;
        }
        
        if(sourceId instanceof Structure) {
            sourceRoomName = sourceId.room.name;
        }
        
        if(sourceId instanceof RoomPosition) {
            sourceRoomName = sourceId.roomName;
        }
    
        if(action && sourceRoomName) {
    
            Memory.jobInstructions[sourceRoomName].push({
                id: 'job-user-console-' + Game.time,
                job: action,
                source: sourceId,
                maxAssignees: 1,
                rolesRequired: ['labourer'],
                priority: 100,
                params: params
            });
    
            return true;
        } else {
            return false;
        }
    },
    
    resetJobs: function()
    {
        delete Memory.jobInstructions;
        delete Memory.activeRequirements;
    
        return true;
    },
};