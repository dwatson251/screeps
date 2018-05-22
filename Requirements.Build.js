const Helper = require('Helpers');
const RequirementsBase = require('Requirements.Base');

module.exports = class RequirementsIncreaseStructureController extends RequirementsBase
{
    constructor(structure) 
    {
        super();
        
        this.structure = structure;
        
        this.resolution = {
            job: 'build',
            source: this.structure.id,
            maxAssignees: 5,
        };
    }
    
    test(built) 
    {
        if(!built) {
            if(this.structure.progress !== undefined && this.structure.progressTotal !== undefined) {
                return this.structure.progress < this.structure.progressTotal;
            } else {
                return false;
            }
        }
    }
}