'use strict';

//const memory = require('memory_memoryObjects');
const global = require('/src/global');
const roleHarvester = require('/src/role.harvester');
const roleUpgrader = require('/src/roles/role.upgrader');
const roleBuilder = require('/src/roles/role.builder');
const roleRepairer = require('/src/roles/role.repair');
const roleTransporter = require('/src/roles/role.transporter');
const CreepController = require('/src/controller/CreepController');

const RoomController = {


    run: function(roomId) {

        // runs all Room activities

        CreepController.run();

    }

};

module.exports = RoomController;
