const mongoosePaginate = require('mongoose-paginate-v2');
var mongoose = require('mongoose'),
    modelName = 'feed',
    schemaDefinition = require('../schema/' + modelName),
    schemaInstance = mongoose.Schema(schemaDefinition);


schemaInstance.plugin(mongoosePaginate);
modelInstance = mongoose.model(modelName, schemaInstance);
module.exports = modelInstance;
