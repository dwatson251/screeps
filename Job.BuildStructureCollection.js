const JobBase = require('Job.Base');
const Helper = require('Helpers');

const structureCollections = require('StructureCollections');

/**
 * @namespace Job
 * 
 * Builds a collection of structures, where the point of origin is the center
 * 
 */
module.exports = class JobBuildStructureCollection extends JobBase
{
    constructor(type, direction = 'north') 
    {
        super();
        
        this.direction = direction;
        
        this.collection = this.changeDirection(structureCollections[type], this.direction);
    
        return this;
    }
    
    run() 
    {
        this.position = this.source;
        
        /**
         * Stores various bits of information about where the structures should start building,
         * assuming the center of origin is set to (roughly) the center of the collection.
         * 
         * These calculations also prefer if the collection is a perfect square, with
         * and odd number for it's width and height.
         */
        this.structureHeight = this.collection.length;
        this.structureLength = this.collection[0].length;
        
        this.realStartX = this.position.x - Math.ceil(this.structureLength / 2);
        this.realStartY = this.position.y - Math.ceil(this.structureHeight / 2);
        
        this.realStartingPoint = new RoomPosition(this.realStartX, this.realStartY, this.roomName);
        
        /**
         * Work out the placement points of each sub-structure:
         */
        this.placementPoints = this.getPlacementPoints();
        
        if(!this.isPlacementFeasible()) {
            console.log('[WARN] Placement was not possible due to obstacles in the way.');
            return this.done();
        }
        
        _.forEach(this.placementPoints, (placementPointRow) => {
            _.forEach(placementPointRow, (placementPointCol) => {
                
                /**
                 * Create a construction site at the specified placement point:
                 */
                placementPointCol.position.createConstructionSite(placementPointCol.structure);
                
            });
        });
        
        return this.done();
    }
    
    /**
     * Points a structure to a specific direction:
     * 
     * North, West, South, East
     */
    changeDirection(structure, direction = 'north')
    {
        switch(direction) {
            
            case 'west':
                structure = this.rotate90Left(structure);
                break;
                
            case 'south':
                structure = this.rotate180(structure);
                break;
                
            case 'east':
                structure = this.rotate90Right(structure);
                break;
            
        }
        
        return structure;
    }
    
    /**
     * Works out placement points
     */
    getPlacementPoints()
    {
        /**
         * An object containing all of the room positions required for all the the sub-structures in this collection
         */
        let placementPoints = [];
        
        _.forEach(this.collection, (collectionRow, offsetY) => {
            
            let row = [];
            
            _.forEach(collectionRow, (collectionColumn, offsetX) => {
                
                let column = {
                    'structure': collectionColumn,
                    'position' : new RoomPosition(this.realStartingPoint.x + offsetX, this.realStartingPoint.y + offsetY, this.roomName),
                };
                
                row.push(column);
                
            });
            
            placementPoints.push(row);
        });
        
        return placementPoints;
    }
    
    /**
     * Checks the position and surrounding area for obstacles, like walls or
     * other exisiting structures based on location selected.
     * 
     * Will ignore structures already placed IF the structure type being placed
     * in that position matches the type we are trying to place, or it is null.
     */
    isPlacementFeasible(placementPoints = this.placementPoints)
    {
        let feasibility = true;
        
        _.forEach(placementPoints, (placementPointRow) => {
            _.forEach(placementPointRow, (placementPointCol) => {
                
                /** 
                 * Look at each proposed placement point and check to see if:
                 * 
                 * a) The space has terrain of the 'plain' type
                 * b) A construction site or structure in this place is the same type as the one we are trying to place
                 */
                const objectsAtPosition = placementPointCol.position.look();
                
                _.forEach(objectsAtPosition, (object) => {
                   
                   /**
                    * Feasibility for this placementPointCol only applies
                    * if this sub-structure is not null
                    */
                    if(placementPointCol.structure !== null) {
                   
                       /**
                        * Fulfills (a)
                        */
                        if(object.type === 'terrain' && object.terrain !== 'plain') {
                            feasibility = false;
                        }
                       
                       /**
                        * Fulfills (b)
                        */
                       if((object.type === 'structure' || object.type === 'construction_site') && object.structure.structureType !== placementPointCol.structure) {
                           feasibility = false;
                       }
                    }
                    
                });
            });
        });
        
        return feasibility;
    }
    
    rotate90Left(m) 
    {
        m = this.transpose(m);
        m = this.reverseRows(m);
        return m;
    }

    rotate90Right(m) 
    {
        m = this.reverseRows(m);
        m = this.transpose(m);
        return m;
    }

    rotate180(m) 
    {
        m = this.reverseCols(m);
        m = this.reverseRows(m);
        return m;
    }
    
        transpose3(m) 
    {
        var result = new Array(m[0].length);
        for (var i = 0; i < m[0].length; i++) {
            result[i] = new Array(m.length - 1);
            for (var j = m.length - 1; j > -1; j--) {
                result[i][j] = m[j][i];
            }
        }
        return result;
    }
    
    transpose(m) 
    {
        if (m.length === m[0].length) {
            return this.transpose(m);
        } else {
            return this.transpose3(m);
        }
    }
    
    reverseRows(m) 
    {
        //for (var i = 0, k = m.length - 1; i < k; ++i, --k) {
        //    var x = m[i];
        //    m[i] = m[k];
        //    m[k] = x;
        //}
        //return m;
        return m.reverse();
    }

    reverseCols(m)
    {
        for (var i = 0; i < m.length; i++) {
            //for (var j = 0, k = m[i].length - 1; j < k; ++j, --k) {
            //    var x = m[i][j];
            //    m[i][j] = m[i][k];
            //    m[i][k] = x;
            //}
            m[i].reverse();
        }
        return m;
    }
}