var mainBasic = require('main.basic');

module.exports.loop = function () {

    mainBasic.clearMemory();
    mainBasic.runCreeps();
    mainBasic.reproduceCreeps();
} 