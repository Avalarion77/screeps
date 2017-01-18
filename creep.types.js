var creepTypes = {

    /** @param {Creep} creep **/
    getHarvester: function(creep) {

        if (currentAvailableEnergy >= 200) {
                
                Game.spawns.Avalarion.createCreep([WORK,CARRY,MOVE], undefined, {role: global.CreepJobs.CREEP_JOB_HARVESTER, working: false});
                console.log('spawn harvester');
            }
	}
};

module.exports = creepTypes;