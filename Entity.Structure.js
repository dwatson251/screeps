const Helper = require('Helpers');

const requirementsToTest = [
    {
        name: 'Energy',
        requirement: require('Requirements.Energy'),
        interval: 16,
    },
    {
        name: 'Progress',
        requirement: require('Requirements.Progress'),
        interval: 10,
    },
    {
        name: 'Repair',
        requirement: require('Requirements.Repair'),
        interval: 21,
    }
];

module.exports = class EntityStructure 
{
    constructor(structure, buildingCompleted = true)
    {
        /**
         * Checks whether active requirements have been made for this structure:
         */
        if(!Memory.activeRequirements[structure.id]) {
            Memory.activeRequirements[structure.id] = [];
        }
        
        this.structure = structure;
        this.buildingCompleted = buildingCompleted;
    }
    
    /**
     * Test structures for their needs and requirements.
     */
    getRequirements() 
    {
        let requirements = [];
        
        _.forEach(requirementsToTest, (requirementToTest) => {
            
            /** 
             * Check this requirement at a particular interval
             */
            if((Game.time % (requirementToTest.interval + 1)) !==  requirementToTest.interval) {
                return;
            }
                
            /**
             * Test whether this requirement is already in progress, we don't need to recreate it otherwise!
             */
            if(this.alreadyHasRequirement(requirementToTest.name)) {
                return;
            }
                
            /**
             * Create a new instance of whatever the requirement to test is
             */
            const requirement = new requirementToTest.requirement(this.structure);
            
            /**
             * Test whether the requirement rules pass - If they do, it looks like we'll have a job on our hands.
             */
            if(requirement.test(this.buildingCompleted)) {
                Helper.addRequirement(this.structure.id, requirementToTest.name);
                requirements.push(requirement.getResolution(requirementToTest.name));
            }
        });
        
        return requirements;
    }
    
    /**
     * Each requirement will return a resolution; a job.
     * 
     * This method returns all of the new jobs required this tick.
     */
    getJobs()
    {
        return this.getRequirements();
    }
    
    /**
     * Requirements may pass tests several times before the job is completed,
     * so this method ensures that the requirement does not duplicate and use 
     * up extra memory.
     */
    alreadyHasRequirement(requirementName)
    {
        return Memory.activeRequirements[this.structure.id].indexOf(requirementName) !== -1;
    }
}