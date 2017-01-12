var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repair');

var mainBasic = {
    reproduceCreeps: function() {
        var harvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester');
        //console.log('current available harvesters: ' + harvesters);
        var upgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');
        //console.log('current available upgraders: ' + upgraders);
        var builders = _.sum(Game.creeps, (c) => c.memory.role == 'builder');
        //console.log('current available builders: ' + builders);
        var repairers = _.sum(Game.creeps, (c) => c.memory.role == 'repairer');
        //console.log('current available repairers: ' + repairers);
        
        var currentAvailableEnergy = Game.spawns.Avalarion.room.energyAvailable;
        if (harvesters < 4) {
            if (currentAvailableEnergy >= 200) {
                console.log('spawn harvester');
                Game.spawns.Avalarion.createCreep([WORK,CARRY,MOVE], undefined, {role:'harvester', working: false});
            }
            
        }
        else if (upgraders < 1) {
            if (currentAvailableEnergy >= 250) {
                console.log('spawn upgrader');
                Game.spawns.Avalarion.createCreep([WORK,CARRY,MOVE,MOVE], undefined, {role:'upgrader', working: false});
            }
            
        }
        else if (builders < 2) {
            if (currentAvailableEnergy >= 200) {
                console.log('spawn builder');
                Game.spawns.Avalarion.createCreep([WORK,CARRY,MOVE], undefined, {role:'builder', working: false});
            }
            
        }
        else if (repairers < 1) {
            if (currentAvailableEnergy >= 200) {
                console.log('spawn repairer');
                Game.spawns.Avalarion.createCreep([WORK,CARRY,MOVE], undefined, {role:'repairer', working: false});
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
        //roleHarvester.test(Game.creeps[0].room);
        
        for(var name in Game.creeps) {
            //console.log(JSON.stringify(Game.creeps[name].room));
            
        }
    }
    
};



module.exports = mainBasic;