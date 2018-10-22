const roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {

        let returnValue;
        if (creep.memory.working && creep.carry.energy === 0) {
            creep.memory.working = false;
            creep.say('harvesting');
        }
        if (!creep.memory.working && creep.carry.energy === creep.carryCapacity) {
            creep.memory.working = true;
            creep.say('repairing');
        }

        // check if any container needs repairs
        let targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_CONTAINER && structure.hits < structure.hitsMax);
            }
        });
        // if no container needs repair find other target
        if (targets === 0) {
            targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType !== STRUCTURE_WALL && structure.hits < structure.hitsMax);
                }
            });
        }

        // sorting for lowest hits
        targets.sort((a, b) => a.hits - b.hits);
        let target = creep.pos.findClosestByPath(targets);
        if (creep.memory.working) {
            returnValue = creep.repair(target);

            if (target === null) {
                console.log('no targets to repair');
                // repair walls
                let walls = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType === STRUCTURE_WALL && structure.hits < structure.hitsMax);
                    }
                });

                // sorting for lowest hits
                walls.sort((a, b) => a.hits - b.hits);

                let wall = creep.pos.findClosestByPath(walls);
                returnValue = creep.repair(wall);

                if (returnValue === 0) {
                    // all fine
                } else if (returnValue === ERR_NOT_IN_RANGE) {
                    creep.moveTo(wall);
                } else {
                    console.log('Repairer[' + creep.name + '] => wall: [' + wall + ']; working error: ' + returnValue);
                }

            } else if (returnValue === 0) {
                // all fine
            } else if (returnValue === ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            } else {
                console.log('Repairer[' + creep.name + '] => target: [' + target + ']; working error: ' + returnValue);
            }

        }
        // get energie
        else {
            let sources = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > creep.carryCapacity);
                }
            });

            if (sources.length === 0) {
                sources = creep.room.find(FIND_SOURCES);
                returnValue = creep.harvest(sources[0]);

                if (returnValue === 0) {
                    // all fine
                } else if (returnValue === ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                } else {
                    console.log('repairer[' + creep.name + '] harvest energy: ' + returnValue);
                }
            } else {
                returnValue = creep.withdraw(sources[0], RESOURCE_ENERGY);

                if (returnValue === 0) {
                    // all fine
                } else if (returnValue === ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                } else {
                    console.log('repairer[' + creep.name + '] withdraw energy: ' + returnValue);
                }
            }

        }
    }
};

module.exports = roleRepairer;
