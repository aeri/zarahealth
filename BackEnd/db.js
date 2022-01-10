var mongoose = require('mongoose');
var logger = require('./logger.js');
var secret = require('./Secret.js');

//var fs = require('fs');

//var ca = [fs.readFileSync('./ssl/rootCA.pem')];

var mongoUri = secret.mongoUri;

function connect() {

const uri = "";

  mongoose.connect(mongoUri, {

    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true

  }, function(err, res) {
    if (err) {
      logger.error(`Error connecting to mongodb.\n`, err);
    }
    logger.info(`Connected successfully to mongodb.`);
  });
  
}

module.exports = {
  connect: connect
};
