const Helper = require('Helpers');
const RequirementsBase = require('Requirements.Base');

module.exports = class RequirementsSpawnCreep extends RequirementsBase
{
    constructor()
    {
        super();
        
        this.resolution = {
            job: 'spawn',
            source: this.structure.id,
        }
        
        return this.test();
    }
}