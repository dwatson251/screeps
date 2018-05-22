const Helper = require('Helpers');
const RequirementsBase = require('Requirements.Base');

module.exports = class RequirementsWithdraw extends RequirementsBase
{
    constructor(creep) 
    {
        super();
        
        this.creep = creep;
        let closestSpawn = this.creep.pos.findClosestByPath(FIND_MY_SPAWNS);
        
        this.resolution = {
            job: 'withdraw',
            source: closestSpawn.id,
        }
    }
    
    test(built) 
    {
        return true;
    }
}