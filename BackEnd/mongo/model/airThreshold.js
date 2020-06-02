var mongoose = require('mongoose'),
    modelName = 'airThreshold',
    schemaDefinition = require('../schema/' + modelName),
    schemaInstance = mongoose.Schema(schemaDefinition),
    modelInstance = mongoose.model(modelName, schemaInstance);

module.exports = modelInstance;
