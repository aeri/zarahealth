var mongoose = require('mongoose');
var logger = require('./logger.js');
var secret = require('./Secret.js');

var fs = require('fs');

var ca = [fs.readFileSync('./ssl/rootCA.pem')];

//var mongoUri = 'mongodb://localhost/ZaraHealth';

var mongoUri = secret.mongoUri;
function connect() {
    mongoose.connect(mongoUri, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        user: secret.mongoUser,
        pass: secret.mongoPass,
        ssl: true,
        checkServerIdentity: true,
        sslCA: ca
    }, function (err, res) {
            mongoose.set('useFindAndModify', false);
        if (err) {
            return logger.error(`Error connecting to ${mongoUri}.\n`, err);
        }
            logger.info(`Connected successfully to ${mongoUri}.`);
    });
}

module.exports = {
    connect: connect
};
