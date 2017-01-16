var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repair');
var roleTransporter = require('role.transporter');

var mainBasic = {

    reproduceCreeps: function () {
        
        var currentAvailableEnergy = Game.spawns.Avalarion.room.energyAvailable;
        var countConstructionSites = _.sum(Game.constructionSites, c => c.my);
        var countRepairSites = Game.spawns.Avalarion.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.hits < structure.hitsMax);
            }
        }).length;

        var parts;
        var costs;
        if (getHarvesters2() < 1) {
            parts = [WORK, WORK, WORK, WORK, WORK, MOVE];
            costs = getBodyPartCosts(parts);
            if (currentAvailableEnergy >= costs) {
                console.log('spawn harvester2 costs: ' + costs);
                Game.spawns.Avalarion.createCreep(parts, undefined, { role: 'harvester2', working: false });
            }

        }
        else if (getHarvesters() < 3) {
            parts = [WORK, WORK, WORK, CARRY, MOVE];
            costs = getBodyPartCosts(parts);
            if (currentAvailableEnergy >= costs) {
                console.log('spawn harvester costs: ' + costs);
                Game.spawns.Avalarion.createCreep(parts, undefined, { role: 'harvester', working: false });
            }
            
        }
        else if (getUpgraders() < 4) {
            parts = [WORK, CARRY, MOVE, MOVE];
            costs = getBodyPartCosts(parts);
            if (currentAvailableEnergy >= costs) {
                console.log('spawn upgrader costs: ' + costs);
                Game.spawns.Avalarion.createCreep(parts, undefined, { role: 'upgrader', working: false });
            }
            
        }
        else if ((countConstructionSites > 0 && getBuilders() < 1)
                || (countConstructionSites > 3 && getBuilders() < 3)) {
            parts = [WORK, CARRY, MOVE];
            costs = getBodyPartCosts(parts);
            if (currentAvailableEnergy >= costs) {
                console.log('spawn builder costs: ' + costs);
                Game.spawns.Avalarion.createCreep(parts, undefined, { role: 'builder', working: false });
            }
            
        }
        else if ((countRepairSites > 0 && getRepairers() < 1) || (countRepairSites > 5 && getRepairers() < 3)) {
            parts = [WORK, CARRY, MOVE];
            costs = getBodyPartCosts(parts);
            if (currentAvailableEnergy >= costs) {
                console.log('spawn repairer costs: ' + costs);
                Game.spawns.Avalarion.createCreep(parts, undefined, { role: 'repairer', working: false });
            }
            
        }
        else if (getTransporters() < 7) {
            parts = [CARRY, MOVE, CARRY, MOVE, MOVE, MOVE];
            costs = getBodyPartCosts(parts);
            if (currentAvailableEnergy >= costs) {
                console.log('spawn transporter costs: ' + costs);
                Game.spawns.Avalarion.createCreep(parts, undefined, { role: 'transporter', working: false });
            }

        }
        
    },
    
    runCreeps: function() {
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            if(creep.memory.role == 'harvester') {
                roleHarvester.run(creep);
                //creep.say('harvester')
            }
            if (creep.memory.role == 'harvester2') {
                roleHarvester.run(creep);
                //creep.say('harvester2');
            }
            if(creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep);
            }
            if(creep.memory.role == 'builder') {
                roleBuilder.run(creep);
            }
            if(creep.memory.role == 'repairer') {
                roleRepairer.run(creep);
            }
            if (creep.memory.role == 'transporter') {
                roleTransporter.run(creep);
                //creep.say('transporter');
            }
            
        }
    },
    
    clearMemory: function() {
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
            }
        }
    },

    getCreepInfo: function() {
        console.log('current available harvesters: ' + getHarvesters());
        console.log('current available harvesters2: ' + getHarvesters2());
        console.log('current available upgraders: ' + getUpgraders());
        console.log('current available builders: ' + getBuilders());
        console.log('current available repairers: ' + getRepairers());
        console.log('current available transporters: ' + getTransporters());
    }
    
};

function getHarvesters() {
    return _.sum(Game.creeps, (c) => c.memory.role == 'harvester');
}
function getHarvesters2() {
    return _.sum(Game.creeps, (c) => c.memory.role == 'harvester2');
}
function getUpgraders() {
    return _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');
}
function getBuilders() {
    return _.sum(Game.creeps, (c) => c.memory.role == 'builder');
}
function getRepairers() {
    return _.sum(Game.creeps, (c) => c.memory.role == 'repairer');
}
function getTransporters() {
    return _.sum(Game.creeps, (c) => c.memory.role == 'transporter');
}

function getBodyPartCosts(harvesterParts) {
    var costs = 0;
    harvesterParts.forEach(function (part) {
        if (part == WORK) {
            costs += BODYPART_COST.work;
        }
        else if (part == MOVE) {
            costs += BODYPART_COST.move;
        }
        else if (part == CARRY) {
            costs += BODYPART_COST.carry;
        }
        else if (part == ATTACK) {
            costs += BODYPART_COST.attack;
        }
        else if (part == RANGED_ATTACK) {
            costs += BODYPART_COST.ranged_attack;
        }
        else if (part == HEAL) {
            costs += BODYPART_COST.heal;
        }
        else if (part == CLAIM) {
            costs += BODYPART_COST.claim;
        }
        else if (part == TOUGH) {
            costs += BODYPART_COST.tough;
        }
    });
    return costs;
}



module.exports = mainBasic;