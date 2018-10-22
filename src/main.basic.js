const roleHarvester = require('roles_role.harvester');
const roleUpgrader = require('roles_role.upgrader');
const roleBuilder = require('roles_role.builder');
const roleRepairer = require('roles_role.repair');
const roleTransporter = require('roles_role.transporter');
const global = require('global');

const mainBasic = {

    checkNeedCreeps: function() {
        // TODO: is energy harvested ?
        for (let spawn in Game.spawns) {
            let sources = Game.spawns[spawn].room.find(FIND_SOURCES);
            for (let source in sources) {
                this.sourceNeedHarvester(_.size(Game.creeps, (c) => c.memory.role === global.CreepJobs.CREEP_JOB_HARVESTER &&
                    c.memory.source === sources[source].id), sources[source]);
            }
            this.isRoomEnergyHarvested();
        }

        // TODO: is construction side available
        if (_.size(Game.constructionSites) > 0) {
            // TODO: ERROR -> no valid object
            this.needBuilder(Game.constructionSites[0]);
        }
    },

    needBuilder: function(cs) {
        const currentAvailableEnergy = cs.room.energyAvailable;
        let parts = [WORK, CARRY, MOVE];
        let costs = getBodyPartCosts(parts);
        if (currentAvailableEnergy >= costs) {
            console.log('spawn harvester costs: ' + costs);
            Game.spawns.Avalarion.spawnCreep(parts, undefined, {
                memory: {
                    role: global.CreepJobs.CREEP_JOB_BUILDER,
                    working: false
                }
            });
        }
    },
    sourceNeedHarvester: function(countActiveHarvester, source) {
        console.log(countActiveHarvester);
        console.log(source);
        console.log(source.room.controller.level);
        switch (source.room.controller.level) {
            case 0:
            case 1:
                if (countActiveHarvester < 2) {
                    const currentAvailableEnergy = source.room.energyAvailable;
                    let parts = [WORK, CARRY, MOVE];
                    let costs = getBodyPartCosts(parts);
                    if (currentAvailableEnergy >= costs) {
                        console.log('spawn harvester costs: ' + costs);
                        Game.spawns.Avalarion.createCreep(parts, undefined, {
                            role: global.CreepJobs.CREEP_JOB_HARVESTER,
                            working: false,
                            source: source.id
                        });
                    }
                }
                break;
            default:
                break;
        }

    },

    isRoomEnergyHarvested: function(room) {

    },

    reproduceCreeps: function() {

        const currentAvailableEnergy = Game.spawns.Avalarion.room.energyAvailable;
        const countConstructionSites = _.sum(Game.constructionSites, c => c.my);
        const countRepairSites = Game.spawns.Avalarion.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.hits < structure.hitsMax);
            }
        }).length;

        let parts;
        let costs;
        if (getCountHarvesters2() < 1) {
            parts = [WORK, WORK, WORK, WORK, WORK, MOVE];
            costs = getBodyPartCosts(parts);
            if (currentAvailableEnergy >= costs) {
                console.log('spawn harvester2 costs: ' + costs);
                Game.spawns.Avalarion.createCreep(parts, undefined, {
                    role: global.CreepJobs.CREEP_JOB_HARVESTER_2,
                    working: false
                });
            }

        } else if (getCountTransporters() < 7) {
            console.log('need transport');
            parts = [CARRY, CARRY, MOVE, MOVE];
            costs = getBodyPartCosts(parts);
            if (currentAvailableEnergy >= costs) {
                console.log('spawn transporter costs: ' + costs);
                Game.spawns.Avalarion.createCreep(parts, undefined, {
                    role: global.CreepJobs.CREEP_JOB_TRANSPORTER,
                    working: false,
                    priority: 'standard'
                });
            }

        } else if (getCountHarvesters() < 2) {
            parts = [WORK, WORK, WORK, CARRY, MOVE];
            costs = getBodyPartCosts(parts);
            if (currentAvailableEnergy >= costs) {
                console.log('spawn harvester costs: ' + costs);
                Game.spawns.Avalarion.createCreep(parts, undefined, {
                    role: global.CreepJobs.CREEP_JOB_HARVESTER,
                    working: false
                });
            }

        } else if (getCountUpgraders() < 3) {
            parts = [WORK, WORK, WORK, CARRY, MOVE];
            costs = getBodyPartCosts(parts);
            if (currentAvailableEnergy >= costs) {
                console.log('spawn upgrader costs: ' + costs);
                Game.spawns.Avalarion.createCreep(parts, undefined, {
                    role: global.CreepJobs.CREEP_JOB_UPGRADER,
                    working: false
                });
            }

        } else if ((countConstructionSites > 0 && getCountBuilders() < 1) ||
            (countConstructionSites > 3 && getCountBuilders() < 3)) {
            parts = [WORK, CARRY, MOVE];
            costs = getBodyPartCosts(parts);
            if (currentAvailableEnergy >= costs) {
                console.log('spawn builder costs: ' + costs);
                Game.spawns.Avalarion.createCreep(parts, undefined, {
                    role: global.CreepJobs.CREEP_JOB_BUILDER,
                    working: false
                });
            }

        } else if ((countRepairSites > 0 && getCountRepairers() < 1) || (countRepairSites > 5 && getCountRepairers() < 3)) {
            parts = [WORK, CARRY, MOVE];
            costs = getBodyPartCosts(parts);
            if (currentAvailableEnergy >= costs) {
                console.log('spawn repairer costs: ' + costs);
                Game.spawns.Avalarion.createCreep(parts, undefined, {
                    role: global.CreepJobs.CREEP_JOB_REPAIRER,
                    working: false
                });
            }

        } else if (getCountTransporters() < 7) {
            parts = [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
            costs = getBodyPartCosts(parts);
            if (currentAvailableEnergy >= costs) {
                console.log('spawn transporter costs: ' + costs);
                Game.spawns.Avalarion.createCreep(parts, undefined, {
                    role: global.CreepJobs.CREEP_JOB_TRANSPORTER,
                    working: false
                });
            }

        }


    },

    runCreeps: function() {
        for (let name in Game.creeps) {
            if (Game.creeps.hasOwnProperty(name)) {
                let creep = Game.creeps[name];
                if (creep.memory.role === global.CreepJobs.CREEP_JOB_HARVESTER) {
                    roleHarvester.run(creep);
                    //creep.say('harvester')
                }
                if (creep.memory.role === global.CreepJobs.CREEP_JOB_HARVESTER_2) {
                    roleHarvester.run(creep);
                    //creep.say('harvester2');
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
                    //creep.say('transporter');
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

    getCreepInfo: function() {
        console.log('current available harvesters: ' + getCountHarvesters());
        console.log('current available harvesters2: ' + getCountHarvesters2());
        console.log('current available upgraders: ' + getCountUpgraders());
        console.log('current available builders: ' + getCountBuilders());
        console.log('current available repairers: ' + getCountRepairers());
        console.log('current available transporters: ' + getCountTransporters());
    }

};


function getCountHarvesters() {
    return _.size(Game.creeps, (c) => c.memory.role === global.CreepJobs.CREEP_JOB_HARVESTER);
}

function getCountHarvesters2() {
    return _.size(Game.creeps, (c) => c.memory.role === global.CreepJobs.CREEP_JOB_HARVESTER_2);
}

function getCountUpgraders() {
    return _.size(Game.creeps, (c) => c.memory.role === global.CreepJobs.CREEP_JOB_UPGRADER);
}

function getCountBuilders() {
    return _.size(Game.creeps, (c) => c.memory.role === global.CreepJobs.CREEP_JOB_BUILDER);
}

function getCountRepairers() {
    return _.size(Game.creeps, (c) => c.memory.role === global.CreepJobs.CREEP_JOB_REPAIRER);
}

function getCountTransporters() {
    return _.size(Game.creeps, (c) => c.memory.role === global.CreepJobs.CREEP_JOB_TRANSPORTER);
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
