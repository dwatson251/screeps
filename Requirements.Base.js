const Helper = require('Helpers');

module.exports = class RequirementsBase
{
    constructor() 
    {
        this.resolution = {};
    }
    
    test() 
    {
        return true;
    }
    
    getResolution(requirementKey = '')
    {
        return Object.assign({}, {
            id: 'job-' + Game.time  + '-' + Helper.uid(),
            requiredBy: requirementKey,
            maxAssignees: 1,
            assignees: [],
            rolesRequired: ['labourer'],
        }, this.resolution);
    }
}