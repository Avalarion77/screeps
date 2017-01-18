var roleTransporter = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    var transportCapacity = creep.carryCapacity;
	    
	    //console.log('transporter[' + creep.name + '] transportCapacity: ' + transportCapacity);
	    /* collect energy */
	    if(creep.carry.energy < transportCapacity) {
	        //console.log('transporter[' + creep.name + '] collecting energy');
            
	        let targets = creep.getTransportLoadingStations()
            //console.log('transporter[' + creep.name + '] collect energy targets: ' + targets);
            
            let returnValue = creep.withdraw(targets[0], RESOURCE_ENERGY);
            if (returnValue == 0) {
                // all fine
            } else if (returnValue == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
            } else if (returnValue == ERR_NOT_ENOUGH_ENERGY) {
                // TODO: IDLE no energy
            } else {
                console.log('transporter[' + creep.name + '] withdraw energy: ' + returnValue);
            }
        }
        /* transport Energy */
	    else {
	        let targets = creep.getTransportDeliveringStations();
	        var target = creep.pos.findClosestByPath(targets);
	        let controllerContainer = creep.getControllerContainer();
	        
	        // if no target available set target to controllerContainer
	        if (!target) {
	            target = controllerContainer;
	        }
	        console.log('targets = '+targets);
	        console.log('target closestbypath = '+target);
	        console.log('controlerContainer = '+controllerContainer);
	        let controllerTransporter = _.sum(Game.creeps, (c) => c.memory.priority === 'controller');
	        let standardTransporter = _.sum(Game.creeps, (c) => c.memory.priority === 'standard');
	        let priority = creep.memory.priority ? creep.memory.priority : 'standard';
	        if (standardTransporter < 1) {
	            console.log('creep['+creep.name+'|'+priority+'] no standard transporter - swith to standard');
	            creep.memory.priority = 'standard';
	        } else if (priority === 'controller' && controllerTransporter < 3) {
	            console.log('creep['+creep.name+'|'+priority+'] controller && less than 3 controller transporter');
	            target = controllerContainer;
	        } else if (priority === 'standard' && standardTransporter > 1 && controllerTransporter < 3) {
	            console.log('creep['+creep.name+'|'+priority+'] standard && less than 3 controller transporter');
	            target = controllerContainer;
	            creep.memory.priority = 'controller';
	        } else if (priority === 'controller') {
	            console.log('creep['+creep.name+'|'+priority+'] is controller');
	            target = controllerContainer;
	        }
	        console.log('transporter[' + creep.name + '|'+creep.memory.priority+'] delivering target: ' + target);

                // if targets available
                if (target) { 
                    let result = creep.transferEnergy(target);
                }
            }
	}
};

module.exports = roleTransporter;