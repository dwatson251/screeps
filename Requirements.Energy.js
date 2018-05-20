const Helper = require('Helpers');

module.exports = class RequirementsEnergy 
{
    constructor(structure) 
    {
        this.structure = structure;
    }
    
    test() 
    {
        return true;
        
        if(this.structure.energy !== undefined && this.structure.energyCapacity !== undefined) {
            return this.structure.energy < this.structure.energyCapacity;
        } else {
            return false;
        }
    }
    
    getResolution()
    {
        /**
         * Returns data required to create a new job
         */
        return {
            id: 'job-' + this.structure.id + '-' + Game.time + '-' + Helper.uid(),
            job: 'transfer',
            params: [
                /** Target */
                this.structure.id,
                
                /** Resource */
                RESOURCE_ENERGY
            ]
        }
    }
}