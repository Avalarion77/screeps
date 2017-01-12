var creepTypes = {

    /** @param {Creep} creep **/
    getHarvester: function(creep) {

        if (currentAvailableEnergy >= 200) {
                
                Game.spawns.Avalarion.createCreep([WORK,CARRY,MOVE], undefined, {role:'harvester', working: false});
                console.log('spawn harvester');
            }
	}
};

module.exports = creepTypes;