'use strict';

// TODO: need constants for container close to resources
// TODO: need function for container close to controller

Creep.prototype.getStructureWithLowEnergy = function() {
    let val;

    val = this.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN || structure.structureType === STRUCTURE_TOWER) &&
                (structure.energy < structure.energyCapacity);
        }
    });
    if (val.length === 0) {
        val = this.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_CONTAINER) &&
                    (structure.store[RESOURCE_ENERGY] < structure.storeCapacity);
            }
        });

    }
    return val;
};

Creep.prototype.getStartingLoadingStations = function() {
    console.log('TEST: ' + this.room.find(FIND_STRUCTURES, {filter: (s) => s.structureType === STRUCTURE_SPAWN}));

    let targets = this.room.find(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType === STRUCTURE_SPAWN
    });

    // TODO: sorting for highest energy - not working, doesn't sort correctly => changed: need to test
    targets.sort((a, b) => _.sum(b.energy) - _.sum(a.energy));
    return targets;
};

Creep.prototype.getTransportLoadingStations = function() {
    let targets = this.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (
                structure.structureType === STRUCTURE_CONTAINER ||
                structure.structureType === STRUCTURE_STORAGE
            ) && _.sum(structure.store) > structure.storeCapacity / 3;
        }
    });

    // TODO: sorting for highest energy - not working, doesn't sort correctly => changed: need to test
    targets.sort((a, b) => _.sum(b.store) - _.sum(a.store));
    return targets;
};

Creep.prototype.getTransportDeliveringStations = function() {
    let targets = this.getStructureWithLowEnergy();
    // TODO: filter fixen - not working
    //targets = _.filter(targets, c => c.structureType !== STRUCTURE_CONTAINER);
    return targets;
};

Creep.prototype.getControllerContainer = function() {
    let containers = this.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType === STRUCTURE_CONTAINER);
        }
    });
    return this.room.controller.pos.findClosestByPath(containers);
};

Creep.prototype.getClosestEnergyContainer = function() {
    let containers = this.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType === STRUCTURE_CONTAINER);
        }
    });
    return this.pos.findClosestByPath(containers);

};

Creep.prototype.transferEnergy = function(target) {
    const returnValue = this.transfer(target, RESOURCE_ENERGY);
    if (returnValue === 0) {
        // all fine
    } else if (returnValue === ERR_NOT_IN_RANGE) {
        this.moveTo(target);
    } else {
        console.log('3 Creep.transferEnergy[creep: ' + this.name + '] for target ' + target + ' failed - ' + returnValue);
    }
};
