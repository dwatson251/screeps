module.exports = class EntityStructure 
{
    constructor(resource)
    {
        this.requirementsToTest = {
            // 'MoveToEnergySource': require('Requirements.MoveToEnergySource'),
        };
        
        this.resource = resource;
        this.jobs = this.getRequirements();
    }
    
    /**
     * Test resources for their needs and requirements.
     * 
     * Requirements will create limbo-jobs
     */
    getRequirements() 
    {
        let requirements = [];
        
        Object.keys(this.requirementsToTest).forEach((requirementKey) => {
            let requirement = new this.requirementsToTest[requirementKey](this.resource);
            if(requirement.test()) {
                requirements.push(requirement.getResolution(requirementKey));
            }
        });
        
        return requirements;
    }
    
    getJobs()
    {
        return this.jobs;
    }
}