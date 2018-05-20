const Helper = require('Helpers');

module.exports = class RequirementsIncreaseStructureController
{
    constructor(structure) 
    {
        this.structure = structure;
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
    
    getResolution(requirementKey)
    {
        return {
            id: 'job-' + this.structure.id + '-' + Game.time + '-' + Helper.uid(),
            job: 'build',
            source: this.structure.id,
            requiredBy: requirementKey,
        }
    }
}