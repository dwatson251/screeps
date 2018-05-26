/**
 * A collection of collection of structures that can be placed in bulk from their
 * center of origin
 */
module.exports = {
    
    "enclosed-extension-single-exit": [
        [STRUCTURE_EXTENSION, STRUCTURE_EXTENSION, STRUCTURE_EXTENSION],
        [STRUCTURE_EXTENSION, STRUCTURE_ROAD, STRUCTURE_EXTENSION],
        [STRUCTURE_EXTENSION, STRUCTURE_ROAD, STRUCTURE_ROAD],
    ],
    
    // Game.helper.createJob('buildStructureCollection', (new RoomPosition(18, 18, 'E55S9')), ['road-arrow-up', 'north'])
    "road-arrow-up": [
        [null, null, STRUCTURE_ROAD, null, null],
        [null, STRUCTURE_ROAD, STRUCTURE_ROAD, STRUCTURE_ROAD, null],
        [STRUCTURE_ROAD, null, STRUCTURE_ROAD, null, STRUCTURE_ROAD],
        [null, null, STRUCTURE_ROAD, null, null],
        [null, null, STRUCTURE_ROAD, null, null],
    ],
    
    "my-username": [
        
    ]
};