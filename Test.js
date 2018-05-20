module.exports = class Test
{
    constructor()
    {
        this.uid = '12345678';
        this.requirement = 'SomeRequirement';
    
        if(!Memory.testRequirements) {
            Memory.testRequirements = {};
        }
        
        this.mockRequirements();
    }
    
    mockRequirements()
    {
        this.addRequirement(this.uid, this.requirement);
    }
    
    addRequirement(uid, requirement)
    {
        if(!Memory.testRequirements[uid]) {
            Memory.testRequirements[uid] = [];
        }
        
        Memory.testRequirements[uid].push(requirement);
    }
}