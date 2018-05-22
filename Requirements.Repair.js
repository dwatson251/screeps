const Helper = require('Helpers');
const RequirementsBase = require('Requirements.Base');

module.exports = class RequirementsRepair extends RequirementsBase
{
    constructor(structure) 
    {
        super();
        
        this.structure = structure;
        
        this.resolution = {
            job: 'repair',
            source: this.structure.id,
        }
    }
    
    test(built) 
    {
        if(built) {
            if(this.structure.hits !== undefined && this.structure.hitsMax !== undefined) {
                return this.structure.hits < this.structure.hitsMax;
            } else {
                return false;
            }
        }
    }
}