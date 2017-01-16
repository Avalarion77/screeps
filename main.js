var mainBasic = require('main.basic');
require('creep.prototype')

module.exports.loop = function () {

    mainBasic.clearMemory();
    mainBasic.runCreeps();
    mainBasic.reproduceCreeps();

    // Tower
    var HOME = 'E61N86';
    var towers = Game.rooms[HOME].find(FIND_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_TOWER
    });
    for (let tower of towers) {
        var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target != undefined) {
            tower.attack(target);
        } else {
            // check if any container needs repairs
            let repairTargets = tower.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return ((structure.structureType == STRUCTURE_RAMPART) && /*structure.hits < 150000 &&*/ structure.hits < structure.hitsMax);
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
} 