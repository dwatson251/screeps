const JobBase = require('Job.Base');

const DepositRequirement = require('Requirements.Deposit');

/**
 * @namespace Job
 * 
 * Withdraws a specific resource from a source
 * 
 */
module.exports = class JobTransfer extends JobBase
{
    constructor(resource = RESOURCE_ENERGY) 
    {
        super();
        
        this.priority = 0;
        this.resource = resource;
        
        return this;
    }
    
    run() 
    {
        // @TODO: Withdraw from different sources: Tombstone, energy source, spawn. Whichever is closest.
        // @TOOD: Get total energy of room by using .energyAvailable
        // Refactor me

        const assignee = this.assignees[0];
        let energyRequired = assignee.carryCapacity - _.sum(assignee.carry);
        
        /**
         * Return straight out of this job if the requiredEnergy is 0 or less
         */
        if(energyRequired <= 0) {
            /**
             * This creep cannot carry any more resources
             */
            return this.done();
        }
        
        /**
         * Get this creep to collect resources straight away if there just aren't enough available to fill this creeps
         * boots
         */
        if(assignee.room.energyAvailable < energyRequired) {
            return this.getMoreResources();
        }
        
        const allSources = Game.rooms[this.roomName].find(FIND_MY_STRUCTURES, {
            filter: (structure) => {
                return ((structure.structureType === STRUCTURE_SPAWN || structure.structureType === STRUCTURE_EXTENSION));
            }
        });
        
        const allSourcesSorted = _.sortBy(allSources, s => assignee.pos.getRangeTo(s));
        
        /**
         * Filter out uneccesary sources, by filtering until we have a list of sources that will adequeatley providethe required
         * energy
         */
        const requiredSources = _.filter(allSourcesSorted, (source) => {
            if(energyRequired > 0 && source.energy > 0) {
                energyRequired -= source.energy;
                return true;
            } else {
                return false;
            }
        });
       
        this.withdrawFromSource(requiredSources[0], this.resource);
    }
    
    /**
     * If no resources available, attempt to deposit existing resources (Prompting the harvesting of new ones!)
     */
    getMoreResources()
    {
        const assignee = this.assignees[0];
         
        for(let i = 0; i < 3; i++) {
            let depositRequirement = new DepositRequirement(this.source);
            let depositResolution = depositRequirement.getResolution();
            depositResolution.assignees = [assignee.id];
            this.addJobDependency(depositResolution);
        }
    }
    
    withdrawFromSource(source, resource)
    {
        const assignee = this.assignees[0];
        
        switch(assignee.withdraw(source, resource)) {
            case ERR_NOT_IN_RANGE:
                assignee.moveTo(source);
                break;
                
            default:
                break;
        }
    }
}