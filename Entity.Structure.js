const Helper = require('Helpers');

const requirementsToTest = {
    // 'Energy': require('Requirements.Energy')
    'IncreaseStructureController': require('Requirements.IncreaseStructureController'),
    'Build': require('Requirements.Build'),
    'Repair': require('Requirements.Repair'),
};

module.exports = class EntityStructure 
{
    constructor(structure, built = true)
    {
        /**
         * Tests if the activeRequirements memory is set
         */
        if(!Memory.activeRequirements) {
            Memory.activeRequirements = {};
        }
        
        /**
         * Checks whether active requirements have been made for this structure:
         */
        if(!Memory.activeRequirements[structure.id]) {
            Memory.activeRequirements[structure.id] = [];
        }
        
        this.structure = structure;
        this.built = built;
        this.jobs = this.getRequirements();
    }
    
    /**
     * Test structures for their needs and requirements.
     * 
     * Requirements will create limbo-jobs
     */
    getRequirements() 
    {
        let requirements = [];
        
        Object.keys(requirementsToTest).forEach((requirementKey) => {
            let requirement = new requirementsToTest[requirementKey](this.structure);
            if(requirement.test(this.built)) {
                if(Memory.activeRequirements[this.structure.id].indexOf(requirementKey) === -1) {
                    Helper.addRequirement(this.structure.id, requirementKey);
                    requirements.push(requirement.getResolution(requirementKey));
                }
            }
        });
        
        return requirements;
    }
    
    getJobs()
    {
        return this.jobs;
    }
}