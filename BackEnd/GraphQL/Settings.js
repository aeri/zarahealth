var settingsModel = require('../mongo/model/settings.js');
var UserModel = require('../mongo/model/user.js');
var logger = require('../logger.js');
const {
    GraphQLError
} = require('graphql');

async function adminAuthentication(username) {
    if (!username) {
        throw new GraphQLError(`This query needs user authorization`, null, null, null, null, {
            extensions: {
                code: "UNAUTHORIZED",
            }
        })
    }
    else {
        user = await UserModel.findOne({
            username: username
        });

        if (!user) {
            throw new GraphQLError(`User ${username} not found`, null, null, null, null, {
                extensions: {
                    code: "INTERNAL_ERROR"
                }
            });
        } else {
            if (!user.isAdmin) {
                throw new GraphQLError(`User ${username} is not and admin`, null, null, null, null, {
                    extensions: {
                        code: "UNAUTHORIZED"
                    }
                });
            }
        }
    }
}

var retrieveSettings = async function ({ }, context ) {

    var usernamePetition = context.response.locals.user;

    //User authentication
    await adminAuthentication(usernamePetition);

    return new Promise((resolve, reject) => {
        settingsModel.find({}, function (err, users) {
            if (err) logger.error(err);
        })
        .then((doc) => {
            resolve(doc);
        })
            .catch((err) => {
                logger.error(err);
                reject(new GraphQLError(`Can not update this field.`, null, null, null, null, {
                    extensions: {
                        code: "UPDATE_FAILED",
                    }
                }));
            });
            
    });
}

var updateWaterStatus = async function ({ id, waterStatus }, context) {

    var usernamePetition = context.response.locals.user;

    //User authentication
    await adminAuthentication(usernamePetition);

    return new Promise((resolve, reject) => {
        settingsModel.findOneAndUpdate({
            _id: id
        }, {
                $set: {
                    water: waterStatus
                }
            }, {
                new: true
            })
            .then((doc) => {
                resolve(doc);
            })
            .catch((err) => {
                logger.error(err);
                reject(new GraphQLError(`Can not update this field.`, null, null, null, null, {
                    extensions: {
                        code: "UPDATE_FAILED",
                    }
                }));
            });
    });
}

var updateAirStatus = async function ({ id, airStatus }, context) {

    var usernamePetition = context.response.locals.user;

    //User authentication
    await adminAuthentication(usernamePetition);

    return new Promise((resolve, reject) => {
        settingsModel.findOneAndUpdate({
            _id: id
        }, {
                $set: {
                    air: airStatus
                }
            }, {
                new: true
            })
            .then((doc) => {
                resolve(doc);
            })
            .catch((err) => {
                logger.error(err);
                reject(new GraphQLError(`Can not update this field.`, null, null, null, null, {
                    extensions: {
                        code: "UPDATE_FAILED",
                    }
                }));
            });
    });
}

var updatePollenStatus = async function ({ id, pollenStatus }, context) {

    var usernamePetition = context.response.locals.user;

    //User authentication
    await adminAuthentication(usernamePetition);

    return new Promise((resolve, reject) => {
        settingsModel.findOneAndUpdate({
            _id: id
        }, {
                $set: {
                    pollen: pollenStatus
                }
            }, {
                new: true
            })
            .then((doc) => {
                resolve(doc);
            })
            .catch((err) => {
                logger.error(err);
                reject(new GraphQLError(`Can not update this field.`, null, null, null, null, {
                    extensions: {
                        code: "UPDATE_FAILED",
                    }
                }));
            });
    });
}

module.exports = {
    retrieveSettings: retrieveSettings,
    updateWaterStatus: updateWaterStatus,
    updateAirStatus: updateAirStatus,
    updatePollenStatus: updatePollenStatus
};