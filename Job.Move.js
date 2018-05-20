const Helper = require('Helpers');

/**
 * @namespace Job
 * 
 * Transfers a specified amount of a resource to a specific target
 * 
 */
module.exports = class JobMove
{
    constructor(target) 
    {
        this.assignee = null;
        this.priority = 0;
        this.amountTransferred = 0;
        this.completed = false;
        
        this.target = Game.getObjectById(target);
    }
    
    run() 
    {
        // TODO: Remove hardcoded source
        // let source = this.assignee.creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        let source = Game.spawns['home'];
        
        if(!source.pos.inRangeTo(this.assignee.creep, 1)) {
            this.assignee.creep.moveTo(source);
        } else {
            this.completed = true;
        }
    }
}