const mainBasic = require('main.basic');
const Attacker = require('roles_role.attacker');
const global = require('global');
require('creep.prototype');

module.exports.loop = function () {


    mainBasic.clearMemory();

    // TODO: no function behind this at the moment
    //Attacker.run();
    mainBasic.checkNeedCreeps();
    mainBasic.runCreeps();
    //mainBasic.reproduceCreeps();


    
    // Tower
    const HOME = global.Config.HOME_SYSTEM;
    const towers = Game.rooms[HOME].find(FIND_STRUCTURES, {
        filter: (s) => s.structureType === STRUCTURE_TOWER
    });
    for (let tower of towers) {
        const target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target !== undefined) {
            tower.attack(target);
        } else {
            // check if any container needs repairs
            let repairTargets = tower.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return ((structure.structureType === STRUCTURE_RAMPART) && /*structure.hits < 150000 &&*/ structure.hits < structure.hitsMax);
                }
            });

            // sorting for lowest hits
            repairTargets.sort((a, b) => a.hits - b.hits);

            if (tower.energy > 500) {
                tower.repair(repairTargets[0]);
            }
        }
    }

    

    //mainBasic.getCreepInfo();
};