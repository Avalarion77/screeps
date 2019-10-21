'use strict';

const global = require('global');
const roleHarvester = require('/src/roles/role.harvester');
const roleUpgrader = require('/src/roles/role.upgrader');
const roleBuilder = require('/src/roles/role.builder');
const roleRepairer = require('/src/roles/role.repair');
const roleTransporter = require('/src/roles/role.transporter');
//const memory = require('memory_memoryObjects');

const mainBasic = {

    checkNeedCreeps: function() {
        // TODO: is energy harvested ?

        // check all Spawns
        // TODO: change to each of my rooms
        for (let spawn in Game.spawns) {
            let constructionSites = Game.spawns[spawn].room.find(FIND_CONSTRUCTION_SITES);
            let needMinimumBuilders = _.size(constructionSites) > 0 && getCountBuilders() < 1;
            let needBuilders = _.size(constructionSites) > 0 && getCountBuilders() < 2;

            // find all Sources in room (currently working because there is only 1 spawn / room
            let sources = Game.spawns[spawn].room.find(FIND_SOURCES);
            for (let source in sources) {
                if (sources[source].id === 'dab90cfef02fe1d2b4278f4d') {
                    continue; // Enemy creeps will kill us
                }

                let harvestersForSource = getCountHarvestersBySource(sources[source].id)
                if (getCountHarvesters() === 0 && !needMinimumBuilders && harvestersForSource < 2) {
                    console.log('current: ' + harvestersForSource + ', id:' + sources[source].id);
                    this.sourceNeedHarvester(_.size(harvestersForSource), sources[source]);
                }
            }


            this.isRoomEnergyHarvested(); // TODO: empty function

            // Do we need builder?

            if (needBuilders) {
                this.needBuilder(spawn);
            }

        }
    },

    sourceNeedHarvester: function(countActiveHarvester, source) {
        // set needed harvester and parts by control level
        let minimumHarvester = 1;
        let parts = [WORK, CARRY, MOVE];
        switch (source.room.controller.level) {
            case 0:
            case 1:
                minimumHarvester = 2;
                parts = [WORK, CARRY, MOVE]; // 200 energy
                break;
            default:
                minimumHarvester = 2;
                parts = [WORK, CARRY, MOVE, CARRY, MOVE]; // 300 energy
                break;
        }

        // spawn harvester if needed
        // TODO: if spawn is in progress skip
        // TODO: if more then 1 spawn in room, check if missing creep is in process already
        if (countActiveHarvester < minimumHarvester) {
            const currentAvailableEnergy = source.room.energyAvailable;

            let costs = getBodyPartCosts(parts);
            if (currentAvailableEnergy >= costs) {
                let mySpawns = source.room.find(FIND_MY_SPAWNS);
                let creepName = global.CreepJobs.CREEP_JOB_HARVESTER + Game.time.toString();
                let status = mySpawns[0].spawnCreep(parts, creepName, {memory: {
                        role: global.CreepJobs.CREEP_JOB_HARVESTER,
                        working: false,
                        source: source.id
                    }});
                console.log(status);
                // TODO: Error handling for creating new creeps (status)
            }
        }

    },

    needBuilder: function(spawnName) {
        const currentAvailableEnergy = Game.spawns[spawnName].room.energyAvailable;
        let parts = [WORK, CARRY, MOVE, MOVE, MOVE];
        let costs = getBodyPartCosts(parts);
        if (currentAvailableEnergy >= costs) {
            let creepName = global.CreepJobs.CREEP_JOB_BUILDER + Game.time.toString();
            Game.spawns[spawnName].spawnCreep(parts, creepName, {
                memory: {
                    role: global.CreepJobs.CREEP_JOB_BUILDER,
                    working: false
                }
            });
        }
    },


    isRoomEnergyHarvested: function(room) {

    },

    runCreeps: function() {
        for (let name in Game.creeps) {
            if (Game.creeps.hasOwnProperty(name)) {
                let creep = Game.creeps[name];
                if (creep.memory.role === global.CreepJobs.CREEP_JOB_HARVESTER) {
                    roleHarvester.run(creep);
                }
                if (creep.memory.role === global.CreepJobs.CREEP_JOB_HARVESTER_2) {
                    roleHarvester.run(creep);
                }
                if (creep.memory.role === global.CreepJobs.CREEP_JOB_UPGRADER) {
                    roleUpgrader.run(creep);
                }
                if (creep.memory.role === global.CreepJobs.CREEP_JOB_BUILDER) {
                    roleBuilder.run(creep);
                }
                if (creep.memory.role === global.CreepJobs.CREEP_JOB_REPAIRER) {
                    roleRepairer.run(creep);
                }
                if (creep.memory.role === global.CreepJobs.CREEP_JOB_WALL_REPAIRER) {
                    roleRepairer.run(creep);
                }
                if (creep.memory.role === global.CreepJobs.CREEP_JOB_TRANSPORTER) {
                    roleTransporter.run(creep);
                }
            }

        }
    },

    clearMemory: function() {
        for (let name in Memory.creeps) {
            if (!Game.creeps.hasOwnProperty(name) && Memory.creeps.hasOwnProperty(name)) {
                // TODO: Update mainMemory

                delete Memory.creeps[name];
            }
        }
    },

    updateMemory: function() {
        // TODO: is home system set?

        // TODO: set spawns in system

    },

    getCreepInfo: function() {
        console.log('current available harvesters: ' + getCountHarvesters());
        console.log('current available harvesters2: ' + getCountHarvesters2());
        console.log('current available upgraders: ' + getCountUpgraders());
        console.log('current available builders: ' + getCountBuilders());
        console.log('current available repairers: ' + getCountRepairers());
        console.log('current available transporters: ' + getCountTransporters());
    },

    reproduceCreeps: function() {

        // TODO: change that - need room controller
        let roomSpawn;
        for (let spawn in Game.spawns) {
            roomSpawn = Game.spawns[spawn];
        }

        const currentAvailableEnergy = roomSpawn.room.energyAvailable;

        let constructionSites = roomSpawn.room.find(FIND_CONSTRUCTION_SITES);
        const countConstructionSites = _.sum(constructionSites);
        const countRepairSites = roomSpawn.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.hits < structure.hitsMax);
            }
        }).length;

        let parts;
        let costs;
        // TODO: Refactoring this if (duplicate code)
       /* if (getCountHarvesters2() < 1) {
            parts = [WORK, WORK, WORK, WORK, WORK, MOVE];
            costs = getBodyPartCosts(parts);
            if (currentAvailableEnergy >= costs) {
                console.log('spawn harvester2 costs: ' + costs);
                let creepName = global.CreepJobs.CREEP_JOB_REPAIRER + Game.time.toString();
                roomSpawn.spawnCreep(parts, creepName, {memory: {
                        role: global.CreepJobs.CREEP_JOB_HARVESTER_2,
                        working: false
                    }});
            }

        } else if (getCountTransporters() < 7) {
            console.log('need transport');
            parts = [CARRY, CARRY, MOVE, MOVE];
            costs = getBodyPartCosts(parts);
            if (currentAvailableEnergy >= costs) {
                console.log('spawn transporter costs: ' + costs);
                let creepName = global.CreepJobs.CREEP_JOB_TRANSPORTER + Game.time.toString();
                roomSpawn.spawnCreep(parts, creepName, {memory: {
                        role: global.CreepJobs.CREEP_JOB_TRANSPORTER,
                        working: false,
                        priority: 'standard'
                    }});
            }

        } else if (getCountHarvesters() < 2) {
            parts = [WORK, WORK, WORK, CARRY, MOVE];
            costs = getBodyPartCosts(parts);
            if (currentAvailableEnergy >= costs) {
                console.log('spawn harvester costs: ' + costs);
                let creepName = global.CreepJobs.CREEP_JOB_HARVESTER + Game.time.toString();
                roomSpawn.spawnCreep(parts, creepName, {memory: {
                        role: global.CreepJobs.CREEP_JOB_HARVESTER,
                        working: false
                    }});
            }

        } else*/ if (getCountUpgraders() < 1) {
            parts = [WORK, CARRY, MOVE];
            costs = getBodyPartCosts(parts);
            if (currentAvailableEnergy >= costs) {
                console.log('spawn upgrader costs: ' + costs);
                let creepName = global.CreepJobs.CREEP_JOB_UPGRADER + Game.time.toString();
                roomSpawn.spawnCreep(parts, creepName, {memory: {
                        role: global.CreepJobs.CREEP_JOB_UPGRADER,
                        working: false
                    }});
            }

        } else /*if ((countConstructionSites > 0 && getCountBuilders() < 1) ||
            (countConstructionSites > 3 && getCountBuilders() < 3)) {
            parts = [WORK, CARRY, MOVE];
            costs = getBodyPartCosts(parts);
            if (currentAvailableEnergy >= costs) {
                console.log('spawn builder costs: ' + costs);
                let creepName = global.CreepJobs.CREEP_JOB_BUILDER + Game.time.toString();
                roomSpawn.spawnCreep(parts, creepName, {memory: {
                        role: global.CreepJobs.CREEP_JOB_BUILDER,
                        working: false
                    }});
            }

        } else*/ if ((countRepairSites > 0 && getCountRepairers() < 1) || (countRepairSites > 5 && getCountRepairers() < 3)) {
            parts = [WORK, CARRY, MOVE];
            costs = getBodyPartCosts(parts);
            if (currentAvailableEnergy >= costs) {
                console.log('spawn repairer costs: ' + costs);
                let creepName = global.CreepJobs.CREEP_JOB_REPAIRER + Game.time.toString();
                roomSpawn.spawnCreep(parts, creepName, {memory: {
                        role: global.CreepJobs.CREEP_JOB_REPAIRER,
                        working: false
                    }});
            }

        } else if (getCountTransporters() < 1) {
            parts = [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
            costs = getBodyPartCosts(parts);
            if (currentAvailableEnergy >= costs) {
                console.log('spawn transporter costs: ' + costs);
                let creepName = global.CreepJobs.CREEP_JOB_TRANSPORTER + Game.time.toString();
                roomSpawn.spawnCreep(parts, creepName, {
                    role: global.CreepJobs.CREEP_JOB_TRANSPORTER,
                    working: false
                });
            }

        }


    }

};

function getCountHarvestersBySource(source) {
    let harvesters = _.filter(Game.creeps, (c) => c.memory.role === global.CreepJobs.CREEP_JOB_HARVESTER
        && c.memory.source === source);
    return _.size(harvesters);
}

function getCountHarvesters() {
    let harvesters = _.filter(Game.creeps, (c) => c.memory.role === global.CreepJobs.CREEP_JOB_HARVESTER);
    return _.size(harvesters);
}

function getCountHarvesters2() {
    let harvesters2 = _.filter(Game.creeps, (c) => c.memory.role === global.CreepJobs.CREEP_JOB_HARVESTER_2);
    return _.size(harvesters2);
}

function getCountUpgraders() {
    let upgraders = _.filter(Game.creeps, (c) => c.memory.role === global.CreepJobs.CREEP_JOB_UPGRADER);
    return _.size(upgraders);
}

function getCountBuilders() {
    let builders = _.filter(Game.creeps, (c) => c.memory.role === global.CreepJobs.CREEP_JOB_BUILDER);
    return _.size(builders);
}

function getCountRepairers() {
    let repairer = _.filter(Game.creeps, (c) => c.memory.role === global.CreepJobs.CREEP_JOB_REPAIRER);
    return _.size(repairer);
}

function getCountTransporters() {
    let transporter = _.filter(Game.creeps, (c) => c.memory.role === global.CreepJobs.CREEP_JOB_TRANSPORTER);
    return _.size(transporter);
}

function getBodyPartCosts(harvesterParts) {
    let costs = 0;
    harvesterParts.forEach(function(part) {
        if (part === WORK) {
            costs += BODYPART_COST.work;
        } else if (part === MOVE) {
            costs += BODYPART_COST.move;
        } else if (part === CARRY) {
            costs += BODYPART_COST.carry;
        } else if (part === ATTACK) {
            costs += BODYPART_COST.attack;
        } else if (part === RANGED_ATTACK) {
            costs += BODYPART_COST.ranged_attack;
        } else if (part === HEAL) {
            costs += BODYPART_COST.heal;
        } else if (part === CLAIM) {
            costs += BODYPART_COST.claim;
        } else if (part === TOUGH) {
            costs += BODYPART_COST.tough;
        }
    });
    return costs;
}



module.exports = mainBasic;
