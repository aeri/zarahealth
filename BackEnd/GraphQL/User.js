var UserModel = require('../mongo/model/user.js');
var ImageModel = require('../mongo/model/image.js');
var airStationModel = require('../mongo/model/airStation.js');
var waterStationModel = require('../mongo/model/waterStation.js');
var pollenMeasureModel = require('../mongo/model/pollenMeasure.js');
var airThresholdModel = require('../mongo/model/airThreshold.js');
var logger = require('../logger.js');
var AirAux = require('./AirAux');
var _ = require('underscore');
const fetch = require('node-fetch');

const {
  GraphQLError
} = require('graphql')

// Standard FIPS 202 SHA-3 implementation
const {
  SHA3
} = require('sha3');

//Function to authenticate user
function authentication(username) {
  if (!username) {
    throw new GraphQLError(`This query needs user authorization`, null, null, null, null, {
      extensions: {
        code: "UNAUTHORIZED",
      }
    })
  }
}

var retrieveUser = function({
  username
}, context) {
  var usernamePetition = context.response.locals.user;

  //User authentication
  authentication(usernamePetition);

  return UserModel.findOne({
    username: usernamePetition
  }).then(function(user) {
    if (!user) {
      return new GraphQLError(`User ${username} not found`, null, null, null, null, {
        extensions: {
          code: "INTERNAL_ERROR"
        }
      });
    } else {
      if (!username) {
        return user;
      } else if (user.username == username) {
        return user;
      } else if (user.isAdmin) {
        return UserModel.findOne({
          username: username
        }).orFail(() =>
          new GraphQLError(`User ${username} not found`, null, null, null, null, {
            extensions: {
              code: "NOT_FOUND"
            }
          }));
      } else {
        return new GraphQLError(`You do not have permissions to do this query.`, null, null, null, null, {
          extensions: {
            code: "UNAUTHORIZED"
          }
        });
      }
    }
  });
}

var createUser = function({
  username,
  name,
  email,
  password
}, context) {
  // Hashing the password
  const hash = new SHA3(512);
  hash.update(password);
  password = hash.digest('hex');

  var user = new UserModel({
    username: username,
    name: name,
    email: email,
    password: password,
    social: 'None'
  });


  return new Promise((resolve, reject) => {
    user.save().then((user) => {
      resolve(user);
    }).catch((err) => {

      logger.error(err);
      reject(new GraphQLError(`User ${username} or Email ${email} already exists`, null, null, null, null, {
        extensions: {
          code: "DUPLICATED",
        }
      }));
    });
  });
}

var updateCsvDownloadEnabled = function({
  csvDownloadEnabled
}, context) {
  var usernamePetition = context.response.locals.user;

  //User authentication
  authentication(usernamePetition);

  return new Promise((resolve, reject) => {
    UserModel.findOneAndUpdate({
        username: usernamePetition
      }, {
        $set: {
          csvDownloadEnabled: csvDownloadEnabled
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

var uploadUserImage = async function(image, context) {
  var usernamePetition = context.response.locals.user;

  //User authentication
  authentication(usernamePetition);

  const {
    filename,
    mimetype,
    encoding,
    createReadStream
  } = await image.image.file;
  const stream = createReadStream();

  const chunks = []
  const result = await new Promise((resolve, reject) => {
    stream.on('data', chunk => chunks.push(chunk))
    stream.on('error', reject)
    stream.on('end', () => resolve(Buffer.concat(chunks)))
  })

  var imageSave = new ImageModel({
    data: result,
    filename: filename,
    mimetype: mimetype
  });

  new Promise((resolve, reject) => {
    UserModel.findOneAndUpdate({
        username: usernamePetition
      }, {
        $set: {
          image: imageSave
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

  return {
    filename,
    mimetype,
    encoding
  };


}

var updateUserAirStation = async function ({ idAirStation }, context) {

  var usernamePetition = context.response.locals.user;

  //Requires User authentication
  authentication(usernamePetition);

  var stationsData = await AirAux.retrieveStations();
    
  var arina = _.where(stationsData, {
    id: idAirStation
  });

  if (arina === undefined || arina.length == 0) {
      throw new GraphQLError(`The AirStation ${idAirStation} was not found`, null, null, null, null, {
          extensions: {
              code: "NOT_FOUND",
          }
      });
  }

  else{
    var airModel = new airStationModel({
      id: arina[0].id,
      title: arina[0].title,
      address: arina[0].address
    });

    return new Promise((resolve, reject) => {
        UserModel.findOneAndUpdate({
            username: usernamePetition
        }, {
                $set: {
                preferredAirStation: airModel
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


}

var updateUserWaterStation = function ({ idWaterStation }, context) {
    var usernamePetition = context.response.locals.user;

    //Requires User authentication
    authentication(usernamePetition);

    const url = `https://www.zaragoza.es/sede/servicio/calidad-agua.json?srsname=wgs84`;
    return fetch(url)
        .then(res => res.json())
        .then(json => {
            var found = false;
            var iFound = 0;

            for (var i = 0; i < json.result.length; i++) {
                if (json.result[i].id == idWaterStation) {
                    found = true;
                    iFound = i;
                }
            }

            if (found) {
                var waterModel = new waterStationModel({
                    id: json.result[iFound].id,
                    title: json.result[iFound].title,
                    address: json.result[iFound].address
                });

                return new Promise((resolve, reject) => {
                    UserModel.findOneAndUpdate({
                        username: usernamePetition
                    }, {
                            $set: {
                                preferredWaterStation: waterModel
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
            else {
                throw new GraphQLError(`The WaterStation ${idWaterStation} was not found`, null, null, null, null, {
                    extensions: {
                        code: "NOT_FOUND",
                    }
                });
            }
        });
}

var updateUserPollenThreshold = async function ({ idPollenMeasure, pollenValue }, context) {
    var usernamePetition = context.response.locals.user;

    //Requires User authentication
    authentication(usernamePetition);

    const url = `https://www.zaragoza.es/sede/servicio/informacion-polen.json`;
    return await fetch(url)
        .then(res => res.json())
        .then(json => {
            var found = false;

            for (var i = 0; i < json.result.length; i++) {
                if (json.result[i].id == idPollenMeasure) {
                    found = true;
                }
            }

            if (found) {
                var pollenModel = new pollenMeasureModel({
                    id: idPollenMeasure,
                    value: pollenValue
                });

                UserModel.findOneAndUpdate({
                    username: usernamePetition
                },
                    { $pull: { pollenThresholds: { id: idPollenMeasure } } }, {
                        new: true
                    })
                    .then((doc) => {
                        logger.debug(doc);
                    })
                    .catch((err) => {
                        logger.error(err);
                    });

                return new Promise((resolve, reject) => {
                    UserModel.findOneAndUpdate({
                        username: usernamePetition, "pollenThresholds.id": { $ne: idPollenMeasure }
                    },
                        { $push: { pollenThresholds: pollenModel } }, {
                            new: true
                        })
                        .then((doc) => {
                            console.log(doc);
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
            else {
                throw new GraphQLError(`The PollenMeasure ${idPollenMeasure} was not found`, null, null, null, null, {
                    extensions: {
                        code: "NOT_FOUND",
                    }
                });
            }
        });
}

var updateUserAirThreshold = async function ({ idAirStation, airContaminant, airValue }, context) {

    var usernamePetition = context.response.locals.user;

    //Requires User authentication
    authentication(usernamePetition);

    var stationsData = await AirAux.retrieveStations();

    var arina = _.where(stationsData, {
        id: idAirStation
    });

    if (arina === undefined || arina.length == 0) {
        throw new GraphQLError(`The AirStation ${idAirStation} was not found`, null, null, null, null, {
            extensions: {
                code: "NOT_FOUND",
            }
        });
    }

    var airModel = new airThresholdModel({
        contaminant: airContaminant,
        value: airValue
    });

    await UserModel.findOneAndUpdate({
        username: usernamePetition
    },
        { $pull: { "preferredAirStation.thresholds": { contaminant: airContaminant } } }, {
            new: true
        })
        .then((doc) => {
            logger.debug(doc);
        })
        .catch((err) => {
            logger.error(err);
        });


    return new Promise((resolve, reject) => {
        UserModel.findOneAndUpdate({
            username: usernamePetition, "preferredAirStation.thresholds.contaminant": { $ne: airContaminant }
        },
            { $push: { "preferredAirStation.thresholds": airModel } }, {
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
    retrieveUser: retrieveUser,
    createUser: createUser,
    uploadUserImage: uploadUserImage,
    updateCsvDownloadEnabled: updateCsvDownloadEnabled,
    updateUserAirStation: updateUserAirStation,
    updateUserWaterStation: updateUserWaterStation,
    updateUserPollenThreshold: updateUserPollenThreshold,
    updateUserAirThreshold: updateUserAirThreshold
};
