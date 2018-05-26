/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('AutoSpawner');
 * mod.thing == 'a thing'; // true
 */
 
const EntityCreep = require('./Entity.Creep');

module.exports = class AutoSpawner {

    constructor()
    {
        this.maxCreeps = 5;
    
        this.names = require('Names');
        this.roles = require('Roles');
    }
    
    calculatePartCost(body)
    {
        return _.reduce(body, (cost, part) => {
            return cost + BODYPART_COST[part];
        }, 0);
    }

    createCreep() {
    
        const totalAvailableEnergy = _.sum(Game.rooms['E55S9'].find(FIND_MY_STRUCTURES), (structure) => {
            if(structure.structureType === STRUCTURE_SPAWN || structure.structureType === STRUCTURE_EXTENSION) {
                return structure.energy;
            } else {
                return 0;
            }
        });
    
        if(this.maxCreeps > Object.keys(Game.creeps).length) {
            
            let body = this.getOptimalParts('labourer', 400);
            
            if(body) {
                if(totalAvailableEnergy >= this.calculatePartCost(body)) {
    
                    const randomNameKey = Math.floor(Math.random() * this.names.length);
                    const randomName = this.names[randomNameKey];
    
                    Game.spawns['home'].spawnCreep(body, randomName, {
                        memory: {
                            'role': 'labourer',
                        }
                    });
                }
            }
        }
    }
    
    getOptimalParts(role, investment) 
    {
        let roleParts = {};
        let fundsRemaining = investment;
        let partsDistribution = {};
        let optimalParts = [];
        
        /**
         * Eval the role list so that the keys for each part are correct:
         */
        _.forEach(this.roles[role], (ratio, part) => {
            roleParts[eval(part)] = ratio;
        });
        
        /**
         * Ensure we get at least one of each part
         */
        _.forEach(roleParts, (ratio, part) => {
            
            fundsRemaining -= BODYPART_COST[part];
            optimalParts.push(part);
            
            /**
             * Add the part to the partsDistribution object.
             * Because we do not include the initial base parts,
             * we set this value at 0 by default.
             */
            partsDistribution[part] = 0;
        });
        
        /**
         * If we have just enough energy to make one
         * of every part, return the optimal parts now
         */
        if(fundsRemaining === 0) {
            return optimalParts;
        }
        
        /**
         * If the fundsRemaining is in the negative by this point,
         * no can do - we need more cash
         */
        if(fundsRemaining < 0) {
            return false;
        }
        
        /**
         * Work out percentages based on the ratios specified
         */
        const totalRatioValue = _.reduce(roleParts, (result, partRatio) => {
            return result + partRatio;
        });
        
        /**
         * Work out the correct fund distribution for each part, based on 
         * the ratios provided:
         */
        _.forEach(roleParts, (ratio, part) => {
            let value = (totalRatioValue / fundsRemaining) * ratio;
            partsDistribution[part] = Math.floor(value / BODYPART_COST[part]);
        });
        
        console.log('New creep parts distribution: ', JSON.stringify(partsDistribution));
        
        /**
         * Tally up the amount of parts we can afford, and fill up the optimal parts
         * array
         */
        _.forEach(partsDistribution, (count, part) => {
            for(let i = 0; i < count; i++) {
                optimalParts.push(part);
            }
        });
        
        return optimalParts;
    }
};