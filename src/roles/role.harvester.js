const roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        /* Harvester get Energy */
        if ((creep.memory.role === 'harvester' || creep.memory.role === 'harvester2' )
            && creep.carry.energy < creep.carryCapacity) {

            // select resource to harvest
            let harvestResource = Game.getObjectById(creep.memory.source);

            // Harvest resource
            const result = creep.harvest(harvestResource);

            // Status Check
            if (result === OK) {
                // All fine
                // TODO: check if there is an container and create constructionsite if not
                this.buildContainerIfNeeded(creep);
            } else if (result === ERR_NOT_IN_RANGE) {
                creep.moveTo(harvestResource);
            } else if (result === ERR_NOT_ENOUGH_RESOURCES) {
                // no more energy in resource
            } else {
                console.log('harvester[' + creep.name + '] harvest error: ' + result);
            }
        }
        /* Harvester move  */
        else if (creep.carry.energy === creep.carryCapacity) {
            let targets = creep.getTransportDeliveringStations();
            let target = creep.pos.findClosestByPath(targets)
            if (target) {
                creep.transferEnergy(target);
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
            if (target) {
                //console.log('harvester - bring energy to: ' + target);
                creep.transferEnergy(target);
            } else {

            }

        }
    },
    
    buildContainerIfNeeded: function (creep) {
        let existingContainer = creep.room.find(FIND_STRUCTURES, {
            filter: ((s) => s.structureType === STRUCTURE_CONTAINER && s.memory.source === creep.memory.source)
        });

        if (_.size(existingContainer) === 0) {
            // TODO: location logic
            let status = creep.room.createConstructionSite(creep.pos.x, creep.pos.y, STRUCTURE_CONTAINER);
            console.log('status createConstructionSite: ' + status);
            // TODO: handle error code

            // TODO: add sourceId to site


            // TODO: start building

            // TODO: if finished -> save creep.memory.source in container.memory.forSource
        }
    }
};

module.exports = roleHarvester;
