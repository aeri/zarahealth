//Funcion de usuario de GraphQL
var userFunctions = require('./User.js');
var waterStationFunctions = require('./WaterStation.js');
var pollenMeasureFunctions = require('./PollenMeasure');
var airStationFunctions = require('./AirStation.js');

var root = {
    retrieveUser: userFunctions.retrieveUser,
    createUser: userFunctions.createUser,
    uploadUserImage: userFunctions.uploadUserImage,
    updateCsvDownloadEnabled: userFunctions.updateCsvDownloadEnabled,
    retrieveWaterStation: waterStationFunctions.retrieveWaterStation,
    retrieveAllWaterStations: waterStationFunctions.retrieveAllWaterStations,
    retrievePollenMeasure: pollenMeasureFunctions.retrievePollenMeasure,
    retrieveAllPollenMeasures: pollenMeasureFunctions.retrieveAllPollenMeasures,
    retrieveAllAirStations: airStationFunctions.retrieveAllAirStations,
    retrieveAirStation: airStationFunctions.retrieveAirStation
};

module.exports = root;
