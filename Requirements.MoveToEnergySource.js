const Helper = require('Helpers');
const RequirementsBase = require('Requirements.Base');

module.exports = class RequirementsMoveToEnergySource extends RequirementsBase
{
    constructor(poi) 
    {
        super();
        
        this.poi = poi;
        
        this.resolution = {
            job: 'move',
            source: this.poi.id,
        };
    }
    
    test() 
    {
        return true;
    }
}