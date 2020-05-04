var image = require('./image.js');
var airStation = require('./airStation.js');

module.exports = {
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    social: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    csvDownloadEnabled: {
        type: Boolean,
        required: true,
        default: false
    },
    image: {
        type: image,
        required: false
    },
    preferredAirStation: {
      type: airStation,
      required: false
    }
};
