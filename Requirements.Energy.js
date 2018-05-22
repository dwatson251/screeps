const Helper = require('Helpers');
const RequirementsBase = require('Requirements.Base');

module.exports = class RequirementsEnergy extends RequirementsBase
{
    constructor(structure) 
    {
        super();
        
        this.structure = structure;
        
        this.resolution = {
            job: 'transfer',
            source: this.structure.id,
        };
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
}