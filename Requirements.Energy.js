const Helper = require('Helpers');
const RequirementsBase = require('Requirements.Base');

module.exports = class RequirementsEnergy extends RequirementsBase
{
    constructor(structure) 
    {
        super();
        
        this.structure = structure;
        
        this.resolution = {
            job: 'deposit',
            priority: 5,
        };
    }
    
    test() 
    {
        /**
         * Ideally, we only want to perform this requirement check on one structure in the room, so we designate the controller for that job:
         */
        if(this.structure.structureType === STRUCTURE_CONTROLLER) {
            
            /**
             * Test returns true if the energy available is less than 75%
             */
            if(this.structure.room.energyAvailable < (this.structure.room.energyCapacityAvailable * 0.75)) {
                return true;
            } else {
                return false;
            }
        }
    }
}