var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repair');

var mainBasic = {

    reproduceCreeps: function () {
        
        var currentAvailableEnergy = Game.spawns.Avalarion.room.energyAvailable;
        var parts;
        var costs;
        if (getHarvesters() < 5) {
            parts = [WORK, WORK, CARRY, MOVE];
            costs = getBodyPartCosts(parts);
            if (currentAvailableEnergy >= costs) {
                console.log('spawn harvester costs: ' + costs);
                Game.spawns.Avalarion.createCreep(parts, undefined, { role: 'harvester', working: false });
            }
            
        }
        else if (getUpgraders() < 3) {
            parts = [WORK, CARRY, MOVE, MOVE];
            costs = getBodyPartCosts(parts);
            if (currentAvailableEnergy >= costs) {
                console.log('spawn upgrader costs: ' + costs);
                Game.spawns.Avalarion.createCreep(parts, undefined, { role: 'upgrader', working: false });
            }
            
        }
        else if (getBuilders() < 1) {
            parts = [WORK, CARRY, MOVE];
            costs = getBodyPartCosts(parts);
            if (currentAvailableEnergy >= costs) {
                console.log('spawn builder costs: ' + costs);
                Game.spawns.Avalarion.createCreep(parts, undefined, { role: 'builder', working: false });
            }
            
        }
        else if (getRepairers() < 1) {
            parts = [WORK, CARRY, MOVE];
            costs = getBodyPartCosts(parts);
            if (currentAvailableEnergy >= costs) {
                console.log('spawn repairer costs: ' + costs);
                Game.spawns.Avalarion.createCreep(parts, undefined, { role: 'repairer', working: false });
            }
            
        }
        
    },
    
    runCreeps: function() {
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            if(creep.memory.role == 'harvester') {
                roleHarvester.run(creep);
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
        console.log('current available upgraders: ' + getUpgraders());
        console.log('current available builders: ' + getBuilders());
        console.log('current available repairers: ' + getRepairers());
        console.log('current available transporters: ' + getTransporters());
    }
    
};

function getHarvesters() {
    return _.sum(Game.creeps, (c) => c.memory.role == 'harvester');
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