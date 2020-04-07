const mongoose = require('mongoose');
var logger = require('./logger.js');
 
var mongoUri = 'mongodb://localhost/ZaraHealth';

function connect() {
    mongoose.connect(mongoUri, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, function (err, res) {

        if (err) {
            return logger.error(`Error connecting to ${mongoUri}.\n`, err);
        }
            logger.info(`Connected successfully to ${mongoUri}.`);
    });
}

module.exports = {
    connect: connect
};

