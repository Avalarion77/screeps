var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
//JSON.stringify(console.log(creep.room.find(FIND_MY_STRUCTURES)));
        if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.say('harvesting');
	    }
	    if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.working = true;
	        creep.say('upgrading');
	    }

	    if(creep.memory.working) {
	        //console.log('debug upgrader - is working');
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        else {
            //console.log('debug upgrader - is not working');
            // TODO: first look in Spawn if anergy is available
            //var sources = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: s => s.structureType == ' })
            //var sources = creep.room.find(FIND_SOURCES);
            
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_CONTAINER) /*&& structure.energyAvailable > creep.carryCapacity*/); // || structure.structureType == STRUCTURE_SPAWN);
                    }
            });
            
            //console.log('debug upgrader - sources: ' + targets);
            if (targets.length > 0) {
                //console.log('debug upgrader - found targets');
                if(creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
            else {
                //console.log('debug upgrader - no targets');
                let sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                } 
            }
            
            
        }
	}
};

module.exports = roleUpgrader;