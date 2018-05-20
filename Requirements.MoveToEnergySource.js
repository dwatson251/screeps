const Helper = require('Helpers');

module.exports = class RequirementsMoveToEnergySource
{
    constructor(poi) 
    {
        this.poi = poi;
    }
    
    test() 
    {
        return true;
    }
    
    getResolution(requirementKey = '')
    {
        /**
         * Returns data required to create a new job
         */
        return {
            id: 'job-' + this.poi.id + '-' + Game.time + '-' + Helper.uid(),
            job: 'move',
            requiredBy: requirementKey,
            params: [
                /** Target */
                this.poi.id,
            ]
        }
    }
}