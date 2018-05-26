const Helper = require('Helpers');
const RequirementsBase = require('Requirements.Base');

module.exports = class RequirementsProgress extends RequirementsBase
{
    constructor(structure) 
    {
        super();
        
        this.structure = structure;
        
        this.resolution = {
            job: 'progress',
            source: this.structure.id,
            maxAssignees: 1,
        };
    }
    
    test(built) 
    {
        /**
         * Always return true if this structure is a contoller
         */
        if(this.structure.structureType === STRUCTURE_CONTROLLER) {
            return true;
        }
        
        if(!built) {
            if(this.structure.progress !== undefined && this.structure.progressTotal !== undefined) {
                return this.structure.progress < this.structure.progressTotal;
            } else {
                return false;
            }
        }
    }
}