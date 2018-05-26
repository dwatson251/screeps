const Helper = require('Helpers');
const RequirementsBase = require('Requirements.Base');

module.exports = class RequirementsHarvest extends RequirementsBase
{
    constructor() 
    {
        super();
        
        this.resolution = {
            job: 'deposit'
        };
    }
    
    test(built) 
    {
        return true;
    }
}