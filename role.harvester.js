var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        /* Harvester get Energy */
        if(creep.memory.role == 'harvester2' || creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            var harvestResource = sources[0];
            if (creep.memory.role == 'harvester2') {
                harvestResource = sources[1];
            }
            var result = creep.harvest(harvestResource);
            if (result == OK) {
                // All fine
            } else if (result == ERR_NOT_IN_RANGE) {
                //console.log('debug harvester - not in range - resource: '+harvestResource);
                creep.moveTo(harvestResource);
            } else if (result == ERR_NOT_ENOUGH_RESOURCES) {
                // no more energy in resource
            } else {
                console.log('harvester[' + creep.name + '] harvest error: ' + result);
            }
        }
        /* Harvester transfer Energy */
        else {
            // find all Container & Extensions & Spawn structures in this room that has no full energy
	        let target = creep.getClosestEnergyContainer();
	        //console.log('harvester[' + creep.name + '] transfer target: ' + target);
	        // if targets available
	        //console.log('harvester[' + creep.name + '|' + creep.memory.role + ']: ' + target);
	        //console.log('harvester['+ creep.name+'] - : ' + target);
            if(target) {
                //console.log('harvester - bring energy to: ' + target);
                creep.transferEnergy(target);
            }
        }
    }
};

module.exports = roleHarvester;