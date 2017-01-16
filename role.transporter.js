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
	        let target = creep.pos.findClosestByPath(targets);
	        let controllerContainer = creep.getControllerContainer();
	        let controllerTransporter = _.sum(Game.creeps, (c) => c.memory.priority === 'controller');
	        let standardTransporter = _.sum(Game.creeps, (c) => c.memory.priority === 'standard');
	        console.log('controllerTransporter: ' + controllerTransporter);
	        console.log('standardTransporter: ' + standardTransporter);
	        if (standardTransporter < 1) {
	            creep.memory.priority = 'standard';
	        } else if (creep.memory.priority === 'controller' && controllerTransporter < 4) {
	            target = controllerContainer;
	        } else if (standardTransporter > 1 && controllerTransporter < 3) {
	            target = controllerContainer;
	            creep.memory.priority = 'controller';
	        } else {
	            creep.memory.priority = 'standard';
	        }
	        //console.log('transporter[' + creep.name + '] delivering target: ' + target);

            // if targets available
            if (target) {
                let result = creep.transferEnergy(target);
            }
        }
	}
};

module.exports = roleTransporter;