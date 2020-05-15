var image = require('./image.js');
module.exports = {
    username:  String,
    date:  { type: Date, default: Date.now },
    ip: String,
    userAgent: String,
    action: String
};
