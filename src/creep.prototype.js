'use strict';

// TODO: need constants for container close to resources
// TODO: need function for container close to controller

Creep.prototype.getStructureWithLowEnergy = function () {
    let val;

    val = this.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN || structure.structureType === STRUCTURE_TOWER)
                && (structure.energy < structure.energyCapacity);
        }
    });
    if (val.length === 0) {
        val = this.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_CONTAINER)
                    && (structure.store[RESOURCE_ENERGY] < structure.storeCapacity);
            }
        });

    }
    return val;
};

Creep.prototype.getTransportLoadingStations = function () { 
    let targets = this.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (
                    (structure.structureType === STRUCTURE_CONTAINER && structure.id !== '587aa240349ed902205f7a6c')
                    || structure.structureType === STRUCTURE_STORAGE
                ) && _.sum(structure.store) > structure.storeCapacity / 3;
        }
    });

    // TODO: sorting for highest energy - not working, doesn't sort correctly => changed: need to test
    targets.sort((a, b) => _.sum(b.store) - _.sum(a.store) );
    return targets;
};

Creep.prototype.getTransportDeliveringStations = function () {
    let targets = this.getStructureWithLowEnergy();
    targets = _.filter(targets, c => c.structureType !== STRUCTURE_CONTAINER);
    return targets;
};

Creep.prototype.getControllerContainer = function () {
    let containers = this.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType === STRUCTURE_CONTAINER);
        }
    });
    console.log('Creep.getControllerContainer' + containers);
    return this.room.controller.pos.findClosestByPath(containers);
};

Creep.prototype.getClosestEnergyContainer = function () {
    let containers = this.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType === STRUCTURE_CONTAINER);
        }
    });
    return this.pos.findClosestByPath(containers);

};

Creep.prototype.transferEnergy = function (target) {
    const returnValue = this.transfer(target, RESOURCE_ENERGY);
    console.log('Creep.transferEnergy[creep: ' + this.name + '|'+this.memory.priority+'] for target ' + target + ' return - ' + returnValue);
    if (returnValue === 0) {
        // all fine
    }
    else if (returnValue === ERR_NOT_IN_RANGE) {
        this.moveTo(target);
        console.log('Creep.transferEnergy[creep: ' + this.name + '] move to target ' + target);
    }
    else {
        console.log('Creep.transferEnergy[creep: ' + this.name + '] for target '+target+' failed - ' + returnValue);
    }
};