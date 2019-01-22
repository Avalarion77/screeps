'use strict';

//const memory = require('memory_memoryObjects');
const global = require('/src/global');
import { CreepController } from '/src/controller/CreepController';

class RoomController {

    constructor() {
        this.roomId = 'asdf';
    }

    run(roomId) {

        // runs all Room activities

        CreepController.run();

    }

};

module.exports = RoomController;
