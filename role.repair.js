var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.say('harvesting');
	    }
	    if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.working = true;
	        creep.say('repairing');
	    }
        
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType != STRUCTURE_WALL && structure.hits < structure.hitsMax);
            }
        });

        // sorting for lowest hits
        targets.sort((a, b) => a.hits - b.hits);

        if (creep.memory.working) {
            var returnValue = creep.repair(targets[0]);
            if (returnValue == 0) {
                // all fine
            }
            else if (returnValue == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
            }
            else {
                console.log('Repairer working error: '+returnValue);
            }
            
        }
        // get energie
        else {
            var returnValue;
            var sources = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return ((structure.structureType == STRUCTURE_EXTENSION
                        || structure.structureType == STRUCTURE_CONTAINER
                        || structure.structureType == STRUCTURE_SPAWN));
                }
            });

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

module.exports = roleRepairer;