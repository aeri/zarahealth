//Funcion de usuario de GraphQL
var userFunctions = require('./User.js');
var waterStationFunctions = require('./WaterStation.js');
var pollenStationFunctions = require('./PollenStation');
var testAir = require('./AirStation.js');

var root = {
    retrieveUser: userFunctions.retrieveUser,
    createUser: userFunctions.createUser,
    uploadUserImage: userFunctions.uploadUserImage,
    updateCsvDownloadEnabled: userFunctions.updateCsvDownloadEnabled,
    retrieveWaterStation: waterStationFunctions.retrieveWaterStation,
    retrievePollenStation: pollenStationFunctions.retrievePollenStation,
    retrieveAirStation: testAir.retrieveAirStation
};

module.exports = root;
