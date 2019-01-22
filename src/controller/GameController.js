'use strict';

const roleHarvester = require('/src/roles/role.harvester');
const roleUpgrader = require('roles_role.upgrader');
const roleBuilder = require('roles_role.builder');
const roleRepairer = require('roles_role.repair');
const roleTransporter = require('roles_role.transporter');
const global = require('global');
const RoomController = require('/src/controller/RoomController')
const GameController = {


    run: function() {

        // Controls the game

        // Calls all Room Controller for enemy status

        // defensive masseurs overrides room controller base behavior

        // runs all Room Controller
        RoomController.run();

    }

};

module.exports = GameController;
