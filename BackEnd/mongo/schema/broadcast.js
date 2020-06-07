var broadcast = require('./broadcast.js');
module.exports = {
    title:  String,
    date:  { type: Date, default: Date.now },
    body: String,
    level: String
};
