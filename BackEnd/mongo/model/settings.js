var mongoose = require('mongoose'),
    modelName = 'settings',
    schemaDefinition = require('../schema/' + modelName),
    schemaInstance = mongoose.Schema(schemaDefinition),
	modelInstance = mongoose.model(modelName, schemaInstance);

module.exports = modelInstance;
