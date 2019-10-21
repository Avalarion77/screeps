'use strict';

const global = require('/src/global');
const mainBasic = require('/src/main.basic');
require('/src/creep.prototype');
const GameController = require('/src/controller/GameController');

// TODO: replace with automatic memory savings
const HOME = global.Config.HOME_SYSTEM;

module.exports.loop = function() {

    // TODO: move into internal MemoryController
    mainBasic.clearMemory();
    // Danger! https://screeps.com/forum/topic/942/creeps-spawning-without-memory/9
    mainBasic.updateMemory();
    Memory.global =  global; // TODO: change that, need an global Memory Object, but there is to much inside

    // TODO: no function behind this at the moment
    //Attacker.run();
const test = new GameController();
    test.run();




    // TODO: Tower
    /*const HOME = global.Config.HOME_SYSTEM;
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
                    return ((structure.structureType === STRUCTURE_RAMPART) && /!*structure.hits < 150000 &&*!/ structure.hits < structure.hitsMax);
                }
            });

            // sorting for lowest hits
            repairTargets.sort((a, b) => a.hits - b.hits);

            if (tower.energy > 500) {
                tower.repair(repairTargets[0]);
            }
        }
    }*/



    //mainBasic.getCreepInfo();
};
