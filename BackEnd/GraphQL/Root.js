//Funcion de usuario de GraphQL
var userFunctions = require('./User.js');
var waterStationFunctions = require('./WaterStation.js');
var pollenMeasureFunctions = require('./PollenMeasure');
var airStationFunctions = require('./AirStation.js');
var weatherFunctions = require('./Weather.js');
var feedFunctions = require('./Feed.js');

var root = {
    retrieveUser: userFunctions.retrieveUser,
    createUser: userFunctions.createUser,
    uploadUserImage: userFunctions.uploadUserImage,
    updateCsvDownloadEnabled: userFunctions.updateCsvDownloadEnabled,
    updateUserWaterStation: userFunctions.updateUserWaterStation,
    updateUserAirStation: userFunctions.updateUserAirStation,
    updateUserPollenThreshold: userFunctions.updateUserPollenThreshold,
    updateUserAirThreshold: userFunctions.updateUserAirThreshold,

    retrieveWaterStation: waterStationFunctions.retrieveWaterStation,
    retrieveAllWaterStations: waterStationFunctions.retrieveAllWaterStations,
    retrievePollenMeasure: pollenMeasureFunctions.retrievePollenMeasure,
    retrieveAllPollenMeasures: pollenMeasureFunctions.retrieveAllPollenMeasures,
    retrieveAllAirStations: airStationFunctions.retrieveAllAirStations,
    retrieveAirStation: airStationFunctions.retrieveAirStation,
    retrieveWeather: weatherFunctions.retrieveWeather,

    submitFeed: feedFunctions.submitFeed,
    retrieveFeeds: feedFunctions.retrieveFeeds,
    toggleFeedOpinion: feedFunctions.toggleFeedOpinion,
    submitComment: feedFunctions.submitComment
};

module.exports = root;
