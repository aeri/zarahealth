//Funcion de usuario de GraphQL
var userFunctions = require('./User.js');
var waterStationFunctions = require('./WaterStation.js');
var pollenStationFunctions = require('./PollenStation');
var airStationFunctions = require('./AirStation.js');
var weatherFunctions = require('./Weather.js');

var root = {
    retrieveUser: userFunctions.retrieveUser,
    createUser: userFunctions.createUser,
    uploadUserImage: userFunctions.uploadUserImage,
    updateCsvDownloadEnabled: userFunctions.updateCsvDownloadEnabled,
    retrieveWaterStation: waterStationFunctions.retrieveWaterStation,
    retrievePollenStation: pollenStationFunctions.retrievePollenStation,
    retrieveAllAirStations: airStationFunctions.retrieveAllAirStations,
    retrieveAirStation: airStationFunctions.retrieveAirStation,
    retrieveWeather: weatherFunctions.retrieveWeather
};

module.exports = root;
