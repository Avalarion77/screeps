var roleTransporter = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    var transportCapacity = creep.carryCapacity;
	    
	    /* collect energy */
	    if(creep.carry.energy < transportCapacity) {
            
            
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) &&
                        structure.energy > transportCapacity;
                }
            });
            
            
            var result = creep.harvest(targets[0]);
            if(result == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
            }
        }
        /* transport Energy */
        else {
            // find all Extensions & Spawn structures in this room
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.energy < structure.energyCapacity;
                }
            });
                
            // if targets available
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
        }
	}
};

module.exports = roleTransporter;