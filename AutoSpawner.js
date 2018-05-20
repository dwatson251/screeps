/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('AutoSpawner');
 * mod.thing == 'a thing'; // true
 */
 
const EntityCreep = require('./Entity.Creep');

module.exports = {

    minHarvesters: 5,
    
    creeps: [],
    
    calculatePartCost: function(body)
    {
        return body.reduce(function (cost, part) {
            return cost + BODYPART_COST[part];
        }, 0);
    },

    run: function() {
        
        let currentHarvesters = _.filter(Game.creeps, (c) => {
            return c.memory.role === 'harvester';
        });
        
        if(this.minHarvesters > currentHarvesters.length) {
            
            if(Memory.entity === undefined) {
                Memory.entity = {};
            }
            
            let body = [MOVE, CARRY, WORK];
            
            // console.log('This creep will cost: ', this.calculatePartCost(body));
            
            if(Game.spawns['home'].energy >= this.calculatePartCost(body)) {
                Game.spawns['home'].spawnCreep(body, 'creep-' + Game.time, {
                    memory: {
                        role: 'harvester'
                    }
                });
            }
        }
    }
};