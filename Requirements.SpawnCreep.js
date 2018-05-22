const Helper = require('Helpers');
const RequirementsBase = require('Requirements.Base');

module.exports = class RequirementsSpawnCreep extends RequirementsBase
{
    this.assignee = null;
    this.entityRequired = 'structure';
    
    constructor()
    {
        super();
        
        this.resolution = {
            job: 'repair',
            source: this.structure.id,
        }
        
        return this.test();
    }
}