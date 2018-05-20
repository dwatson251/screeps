const Helper = require('Helpers');

module.exports = class RequirementsHarvest
{
    constructor(structure) 
    {
        this.structure = structure;
    }
    
    test(built) 
    {
        return true;
    }
    
    getResolution(requirementKey)
    {
        return {
            id: 'job-' + this.structure.id + '-' + Game.time + '-' + Helper.uid(),
            job: 'harvest',
            source: this.structure.id,
            requiredBy: requirementKey,
        }
    }
}