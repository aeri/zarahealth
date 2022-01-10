var mongoose = require('mongoose');
var logger = require('./logger.js');
var secret = require('./Secret.js');

//var fs = require('fs');

//var ca = [fs.readFileSync('./ssl/rootCA.pem')];

var mongoUri = secret.mongoUri;

function connect() {

/*
  const MongoClient = require('mongodb').MongoClient;

  const client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect(err => {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    client.close();
  });
*/

const uri = "";

  mongoose.connect(mongoUri, {

    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    ssl: true,
    checkServerIdentity: false

  }, function(err, res) {
    mongoose.set('useFindAndModify', false);
    if (err) {
      return logger.error(`Error connecting to mongodb.\n`, err);
    }
    logger.info(`Connected successfully to mongodb.`);
  });
}

module.exports = {
  connect: connect
};
