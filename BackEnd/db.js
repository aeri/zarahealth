const mongoose = require('mongoose');
 
var mongoUri = 'mongodb://localhost/ZaraHealth';

function connect() {
    mongoose.connect(mongoUri, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, function (err, res) {

        if (err) {
            return console.error('Error connecting to "%s":', mongoUri, err);
        }
        console.log('Connected successfully to "%s"', mongoUri);
    });
}

module.exports = {
    connect: connect
};

