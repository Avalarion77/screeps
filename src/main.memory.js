const mainMemory = {

    storeBasicInformation: function() {



        // rooms (each room with spawn)
        let rooms = [];
        for (let spawn in Game.spawns) {
            // rooms.room
            let room = spawn.room.name;
            if (rooms.includes(room)) {
                continue;
            } else {
                // rooms.room.spawns

            }
            rooms.add(room);
        }
        Game.memory.myRooms = rooms;

        // rooms.room.spawns
        // rooms.room.energySource
        // rooms.room.energySource.harvested


    }
};

module.exports = mainMemory;
