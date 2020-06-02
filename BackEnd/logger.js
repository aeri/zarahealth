'use strict';
const winston = require('winston');

//
// Logging levels
//
const config = {
    levels: {
        error: 0,
        debug: 1,
        info: 2
    },
    colors: {
        error: 'red',
        debug: 'blue',
        info: 'green'
    }
};

winston.addColors(config.colors);

const logger = module.exports = winston.createLogger({
    levels: config.levels,
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ],
    level: 'info'
});

module.exports = logger;