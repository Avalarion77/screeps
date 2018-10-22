const roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        /* Harvester get Energy */
        if (creep.memory.role === 'harvester2' || creep.carry.energy < creep.carryCapacity) {
            const sources = creep.room.find(FIND_SOURCES);
            let harvestResource = sources[0];
            if (creep.memory.role === 'harvester2') {
                harvestResource = sources[1];
            }
            const result = creep.harvest(harvestResource);
            if (result === OK) {
                // All fine
            } else if (result === ERR_NOT_IN_RANGE) {
                //console.log('debug harvester - not in range - resource: '+harvestResource);
                creep.moveTo(harvestResource);
            } else if (result === ERR_NOT_ENOUGH_RESOURCES) {
                // no more energy in resource
            } else {
                console.log('harvester[' + creep.name + '] harvest error: ' + result);
            }
        }
        /* Harvester move  */
        else if (creep.carry.energy === creep.carryCapacity) {
            let target = creep.getTransportDeliveringStations();
            if (target) {
                //console.log('harvester - bring energy to: ' + target);
                creep.transferEnergy(target);
            }
        }

        if (creep.room.find(FIND_STRUCTURES, {
                filter: ((s) => s.structureType === STRUCTURE_CONTAINER && s.memory.forSource === creep.memory.source)
            })) {
            console.log('need container');
            // TODO: location logic
            let status = creep.room.createConstructionSite(creep.pos.x - 1, creep.pos.y - 1, STRUCTURE_CONTAINER);
            console.log('status createConstructionSite: ' + status);
            // TODO: handle error code

            // TODO: add sourceId to site

            // TODO: start building

            // TODO: if finished -> save creep.memory.source in container.memory.forSource
        }

        /* Harvester transfer Energy */
        else {
            // find all Container & Extensions & Spawn structures in this room that has no full energy
            let target = creep.getClosestEnergyContainer();
            //console.log('harvester[' + creep.name + '] transfer target: ' + target);
            // if targets available
            //console.log('harvester[' + creep.name + '|' + creep.memory.role + ']: ' + target);
            //console.log('harvester['+ creep.name+'] - : ' + target);
            if (target) {
                //console.log('harvester - bring energy to: ' + target);
                creep.transferEnergy(target);
            } else {

            }

        }
    }
};

module.exports = roleHarvester;
