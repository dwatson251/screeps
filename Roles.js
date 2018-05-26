/**
 * Contains a list of roles and a ratio of their parts.
 * 
 * How big of a creep created depends on the energy investment amount.
 * 
 * Note: The integer of each part is not an amount of how many parts are required,
 * but instead a ratio. All of the ratios are added up and divided by the ratio
 * required.
 */
module.exports = {
    
    'harvester': {
        MOVE: 1,
        CARRY: 1
    },
    
    'labourer': {
        MOVE: 1,
        CARRY: 2,
        WORK: 2,
    },
    
    'ranged-attacker': {
        MOVE: 2,
        RANGED_ATTACK: 2,
        HEAL: 1,
    },
    
};