var mongoose = require('mongoose'),
    modelName = 'waterStation',
    schemaDefinition = require('../schema/' + modelName),
    schemaInstance = mongoose.Schema(schemaDefinition),
    modelInstance = mongoose.model(modelName, schemaInstance);

module.exports = modelInstance;
