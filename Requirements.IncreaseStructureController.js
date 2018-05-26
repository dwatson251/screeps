const Helper = require('Helpers');
const RequirementsBase = require('Requirements.Base');

module.exports = class RequirementsIncreaseStructureController extends RequirementsBase
{
    constructor(structure) 
    {
        super();
        
        this.structure = structure;
        
        this.resolution = {
            job: 'upgrade',
            source: this.structure.id,
            maxAssignees: 1,
        }
    }
    
    test() 
    {
        if(this.structure.structureType === STRUCTURE_CONTROLLER && this.structure.progress !== undefined && this.structure.progressTotal !== undefined) {
            // @TODO: Fix this snag where if the controller downgrades this check fails...
            return true;
            // return this.structure.progress < this.structure.progressTotal || true;
        } else {
            return false;
        }
    }
}