/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('Helpers');
 * mod.thing == 'a thing'; // true
 */

module.exports = {

    ucFirst: function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },
    
    censor: function(censor) {
      var i = 0;
    
      return function(key, value) {
        if(i !== 0 && typeof(censor) === 'object' && typeof(value) == 'object' && censor == value) 
          return '[Circular]'; 
    
        if(i >= 29) // seems to be a harded maximum of 30 serialized objects?
          return '[Unknown]';
    
        ++i; // so we know we aren't using the original object anymore
    
        return value;  
      }
    },
    
    addRequirement: function(structureId, requirementKey)
    {
        if(Memory.activeRequirements[structureId] === undefined) {
            Memory.activeRequirements[structureId] = [];    
        }
        
        Memory.activeRequirements[structureId].push(requirementKey);
    },
    
    removeRequirement: function(structure, requirementKey) 
    {
        if(!structure) {
            
        } else {
            if(requirementKey) {
                if(Memory.activeRequirements[structure.id].indexOf(requirementKey) !== -1) {
                    requirementIndex = Memory.activeRequirements[structure.id].indexOf(requirementKey);
                    Memory.activeRequirements[structure.id].splice(requirementIndex, 1);
                }
            }
        }
    },
    
    uid: function()
    {
        return Math.floor(new Date().valueOf() * Math.random());
    },
};