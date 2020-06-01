var airThreshold = require('./airThreshold.js');

module.exports = {
    id: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    thresholds: {
        type: [airThreshold],
        required: false
    }
};
