/**
 * @namespace Job
 * 
 * Transfers a specified amount of a resource to a specific target
 * 
 */
class JobTransfer {
    
    this.priority = 0;
    this.amountTransferred = 0;
    
    constructor(target, parts) {
        
        this.target = target;
    }
    
    run() 
    {
        if(creep.transfer(this.target, this.resource) == ERR_NOT_IN_RANGE) {
            if(this.amountTransferred < this.amount) {
                creep.moveTo(this.target);
            }
        }
    }
    
}