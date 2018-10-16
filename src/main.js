const mainBasic = require('src/main.basic');
const Attacker = require('src/roles/role.attacker');
require('src/creep.prototype');
require('src/global');

module.exports.loop = function () {


    mainBasic.clearMemory();

    Attacker.run(); // TODO: no function behind this at the moment

    mainBasic.runCreeps();
    mainBasic.reproduceCreeps();


    
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