/**
 * @namespace Job
 * 
 * Transfers a specified amount of a resource to a specific target
 * 
 */
module.exports = class JobTransfer 
{
    constructor(target, resource = RESOURCE_ENERGY) 
    {
        this.assignee = null;
        this.priority = 0;
        this.amountTransferred = 0;
        this.completed = false;
        
        this.target = target;
        this.resource = resource;
    }
    
    run() 
    {
        if(this.assignee.transfer(this.target, this.resource) == ERR_NOT_IN_RANGE) {
            this.assignee.moveTo(this.target);
        }
        
        if(this.amountTransferred > this.amount) {
            this.completed = true;
        }
    }
}