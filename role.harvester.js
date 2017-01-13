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
            // find all Container & Extensions & Spawn structures in this room that has no full energy
	        var targets = getStructureWithLowEnergy(creep.room);
	        // if targets available
            if(targets.length > 0) {
                //console.log('harvester - bring energy to: ' + targets[0]);
                transferEnergy(creep, targets[0]);
            }
        }
    }
};

function getStructureWithLowEnergy(room) {
    var val;
    
    //if (val.length == 0) {
        val = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN)
                    && (structure.energy < structure.energyCapacity);
            }
        });
    //}
    //if (val.length > 0) console.log('get targets 1 - ' + val + ' ' + val[0].store[RESOURCE_ENERGY] + ' ' + val[0].storeCapacity);
    if (val.length == 0) {
        val = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER)
                    && (structure.store[RESOURCE_ENERGY] < structure.storeCapacity);
            }
        });
    }
    //console.log('get targets 2 - ' + val);
    return val;
};

function transferEnergy(creep, target) {
    var returnValue = creep.transfer(target, RESOURCE_ENERGY);
    if (returnValue == 0) {
        // all fine
    }
    else if (returnValue == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
    }
    else {
        console.log('transferEnergy[creep: ' + creep.name + '] failed - ' + returnValue);
    }
};

module.exports = roleHarvester;