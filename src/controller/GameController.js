'use strict';

const RoomController = require('/src/controller/RoomController');
const mainBasic = require('/src/main.basic');

class GameController {

    constructor() {
        this.controlledRooms = []; // TODO: get all rooms controlled (owned rooms + rooms scouted)
        this.ownedRooms = []; // TODO: get all rooms owned (with spawn or harvested)
        this.roomController = new RoomController();
    }

    run() {

        // Controls the game


        // Calls all Room Controller for enemy status
        for (let room of this.controlledRooms) {
            // TODO: call each room
        }

        // defensive masseurs overrides room controller base behavior


        // runs all Room Controller
        for (let room of this.ownedRooms) {
            // TODO: call each room
        }
        this.roomController.run();

        // TODO: Move into RoomController or where it belongs as soon as rooms get called
        mainBasic.checkNeedCreeps();
        mainBasic.runCreeps();
        mainBasic.reproduceCreeps();
    }

};

module.exports = GameController;
