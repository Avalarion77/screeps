var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {

        /* Harvester get Energy */
	    if(creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            var harvestResource = sources[0];
            // creep has a tagetId
            if (creep.memory.targetId) {
                harvestResource = creep.room.find(FIND_SOURCES, {filter: (res) => {return (res.id == creep.memory.targetId)}})[0];
            } 
            // creep has no targetId -> set first reseource
            else 
            {
                creep.memory.targetId = harvestResource.id;
            }
            var result = creep.harvest(harvestResource);
            if(result == ERR_NOT_IN_RANGE) {
                //console.log('debug harvester - not in range - resource: '+harvestResource);
                creep.moveTo(harvestResource);
            }
            else if(result == ERR_NOT_ENOUGH_RESOURCES) {
                //console.log('debug harvester - not path or resource');
                //console.log('debug harvester - harvestResource.id == sources[0].id: '+ harvestResource + harvestResource.id +' == '+ sources[0].id+' == '+ sources[1].id);
               
               
                if (harvestResource.id == sources[0].id) {
                    creep.memory.targetId = sources[1].id;
                    creep.moveTo(sources[1]);
                }
                else {
                    creep.memory.targetId = sources[0].id;
                    creep.moveTo(sources[0]);
                }
                
            }
        }
        /* Harvester transfer Energy */
        else {
            // find all Extensions & Spawn structures in this room
	        var targets = getExtensionsAndSpawnsWithLowEnergy(creep.room);
	        //console.log('debug harvester - creep.room ' + creep.room)
	        //console.log('debug harvester - getExtensions ' + targets)
	        //var targets = getContainersWithLowEnergy(creep.room);
                
	        // if targets available

            if(targets.length > 0) {
                //console.log('harvester - bring energy to: ' + targets[0]);
                transferEnergy(creep, targets[0]);
            }
        }
    },
    test: function (room) {
        getContainersWithLowEnergy(room);
    }
};

function getExtensionsAndSpawnsWithLowEnergy(room) {
    return room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_CONTAINER)
                && structure.energy < structure.energyCapacity;
        }
    });
};

function getContainersWithLowEnergy(room) {
    return room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType == STRUCTURE_CONTAINER &&
                structure.energy < structure.energyCapacity;
        }
    });
};

function transferEnergy(creep,target) {
    if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
    }
};

module.exports = roleHarvester;