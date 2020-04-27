//Funcion de usuario de GraphQL
var userFunctions = require('./User.js');
var waterStationFunctions = require('./WaterStation.js');
var pollenStationFunctions = require('./PollenStation');

var root = {
    retrieveUser: userFunctions.retrieveUser,
    createUser: userFunctions.createUser,
    uploadUserImage: userFunctions.uploadUserImage,
    updateCsvDownloadEnabled: userFunctions.updateCsvDownloadEnabled,
    retrieveWaterStation: waterStationFunctions.retrieveWaterStation,
    retrievePollenStation: pollenStationFunctions.retrievePollenStation
};

module.exports = root;