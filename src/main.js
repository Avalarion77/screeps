'use strict';

const global = require('global');
const packageType = require('packageType');
const mainBasic = require('main.basic');
require('creep.prototype');

const HOME = global.Config.HOME_SYSTEM;

module.exports.loop = function() {
    let folderConfig = config.development;
    if (isPackaged !== null && isPackaged) {
        folderConfig = config.dist;
    }

    const roleHarvester = require(folderConfig.folder_roles + 'role.harvester');
    const roleUpgrader = require(folderConfig.folder_roles + 'role.upgrader');
    const roleBuilder = require(folderConfig.folder_roles + 'role.builder');
    const roleRepairer = require(folderConfig.folder_roles + 'role.repair');
    const roleTransporter = require(folderConfig.folder_roles + 'role.transporter');

    mainBasic.clearMemory();
    // Danger! https://screeps.com/forum/topic/942/creeps-spawning-without-memory/9
    mainBasic.updateMemory();
    Memory.global =  global;

    // TODO: no function behind this at the moment
    //Attacker.run();
    mainBasic.checkNeedCreeps();
    mainBasic.runCreeps();
    mainBasic.reproduceCreeps();



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
