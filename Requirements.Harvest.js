const Helper = require('Helpers');
const RequirementsBase = require('Requirements.Base');

module.exports = class RequirementsHarvest extends RequirementsBase
{
    constructor(structure) 
    {
        super();
        
        this.structure = structure;
        
        this.resolution = {
            job: 'harvest',
            source: this.structure.id,
        };
    }
    
    test(built) 
    {
        return true;
    }
}