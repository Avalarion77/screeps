const roleBuilder = {

    /** @param {Creep} creep **/
    run: function (creep) {

        setStatus(creep);

        // working
        const construction = creep.pos.findClosestByPath(creep.room.find(FIND_CONSTRUCTION_SITES));
        let returnValue;
        if (creep.memory.working) {
            if (creep.build(construction) === ERR_NOT_IN_RANGE) {
                creep.moveTo(construction);
            }
        }
        // need energy
        else {
            let sources = creep.getTransportLoadingStations();
            const source = creep.pos.findClosestByPath(sources);
            if (source != null) {
                returnValue = creep.withdraw(source, RESOURCE_ENERGY);
                if (returnValue === ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            } else {
                /*sources = creep.room.find(FIND_SOURCES);
                returnValue = creep.harvest(sources[0])
                if (returnValue == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                }*/
            }
        }
    }
};

function setStatus(creep) {
    if (creep.memory.working && creep.carry.energy === 0) {
        creep.memory.working = false;
        creep.say('harvesting');
    }
    if (!creep.memory.working && creep.carry.energy === creep.carryCapacity) {
        creep.memory.working = true;
        creep.say('building');
    }
}

module.exports = roleBuilder;