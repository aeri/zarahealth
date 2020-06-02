//Funcion de usuario de GraphQL
var userFunctions = require('./User.js');
var waterStationFunctions = require('./WaterStation.js');
var pollenMeasureFunctions = require('./PollenMeasure');
var airStationFunctions = require('./AirStation.js');
var weatherFunctions = require('./Weather.js');
var feedFunctions = require('./Feed.js');
var adminFunctions = require('./Admin.js');
var settingsFunctions = require('./Settings.js');

var root = {
    // General User functions
    retrieveUser: userFunctions.retrieveUser,
    createUser: userFunctions.createUser,
    uploadUserImage: userFunctions.uploadUserImage,
    updateCsvDownloadEnabled: userFunctions.updateCsvDownloadEnabled,
    updateUserWaterStation: userFunctions.updateUserWaterStation,
    updateUserAirStation: userFunctions.updateUserAirStation,
    updateUserPollenThreshold: userFunctions.updateUserPollenThreshold,
    updateUserAirThreshold: userFunctions.updateUserAirThreshold,
    updateUser: userFunctions.updateUser,
    retrieveAlerts: userFunctions.retrieveAlerts,
    suscribeClient: userFunctions.suscribeClient,
    // Zaragoza external API functions
    retrieveWaterStation: waterStationFunctions.retrieveWaterStation,
    retrieveAllWaterStations: waterStationFunctions.retrieveAllWaterStations,
    retrievePollenMeasure: pollenMeasureFunctions.retrievePollenMeasure,
    retrieveAllPollenMeasures: pollenMeasureFunctions.retrieveAllPollenMeasures,
    retrieveAllAirStations: airStationFunctions.retrieveAllAirStations,
    retrieveAirStation: airStationFunctions.retrieveAirStation,
    retrieveWeather: weatherFunctions.retrieveWeather,
    // Feed functions
    submitFeed: feedFunctions.submitFeed,
    retrieveFeeds: feedFunctions.retrieveFeeds,
    toggleFeedOpinion: feedFunctions.toggleFeedOpinion,
    submitComment: feedFunctions.submitComment,
    // General Admin functions
    retrieveUsers: adminFunctions.retrieveUsers,
    updateUserStatus: adminFunctions.updateUserStatus,
    retrieveMetrics: adminFunctions.retrieveMetrics,
    sendAlert: adminFunctions.sendAlert,
    // System settings functions
    retrieveSettings: settingsFunctions.retrieveSettings,
    updateWaterStatus: settingsFunctions.updateWaterStatus,
    updateAirStatus: settingsFunctions.updateAirStatus,
    updatePollenStatus: settingsFunctions.updatePollenStatus
};

module.exports = root;
