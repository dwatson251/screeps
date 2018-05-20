const Helper = require('Helpers');

module.exports = class RequirementsIncreaseStructureController
{
    constructor(structure) 
    {
        this.structure = structure;
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
    
    getResolution(requirementKey)
    {
        return {
            id: 'job-' + this.structure.id + '-' + Game.time  + '-' + Helper.uid(),
            job: 'upgrade',
            requiredBy: requirementKey,
            source: this.structure.id,
        }
    }
}