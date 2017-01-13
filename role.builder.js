var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.say('harvesting');
	    }
	    if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.working = true;
	        creep.say('building');
	    }

        var construction = creep.room.find(FIND_CONSTRUCTION_SITES);
	    if(creep.memory.working) {
            if(creep.build(construction[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(construction[0]);
            }
	    }
        // need energy
        else {
	        var sources = getStructureWithEnergy(creep);
            if (sources.length == 0) {
                sources = creep.room.find(FIND_SOURCES);
                returnValue = creep.harvest(sources[0])
                if (returnValue == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                }
            } else {
                returnValue = creep.withdraw(sources[0], RESOURCE_ENERGY)
                if (returnValue == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                }
            }
        }
	}
};

function getStructureWithEnergy(creep) {
    var val;
    val = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_CONTAINER)
                && (structure.store[RESOURCE_ENERGY] > creep.carryCapacity);
        }
    });
 
    if (val.length == 0) {
        val = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN)
                    && (structure.energy > creep.carryCapacity);
            }
        });
    }
    return val;
};

module.exports = roleBuilder;