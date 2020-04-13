var UserModel = require('../mongo/model/user.js');
var logger = require('../logger.js');

const { GraphQLError } = require('graphql')

// Standard FIPS 202 SHA-3 implementation
const { SHA3 } = require('sha3');

//Function to authenticate user
function authentication(username){
    if (!username) {
        throw new GraphQLError(`This query needs user authorization`, null, null, null, null, {
            extensions: {
                code: "UNAUTHORIZED",
            }
        })
    }
}

var retrieveUser = function ({ username }, context) {
    var usernamePetition = context.response.locals.user;

    //User authentication
    authentication(usernamePetition);

    return UserModel.findOne({ username: usernamePetition }).then(function (user) {
        if (!user) {
            return new GraphQLError(`User ${username} not found`, null, null, null, null, {
                extensions: {
                    code: "NOT_FOUND"
                }
            });
        }
        else {
            if (!username) {
                return user;
            }
            else if (user.username == username) {
                return user;
            }
            else if (user.isAdmin) {
                return UserModel.findOne({ username: username }).orFail(() =>
                    new GraphQLError(`User ${username} not found`, null, null, null, null, {
                        extensions: {
                            code: "NOT_FOUND"
                        }
                    }));
            }
            else {
                return new GraphQLError(`You don´t have permissions to do this query.`, null, null, null, null, {
                    extensions: {
                        code: "UNAUTHORIZED"
                    }
                });
            }
        }
    });
}

var createUser = function ({ username, name, email, password }, context) {
    // Hashing the password
    const hash = new SHA3(512);
    hash.update(password);
    password = hash.digest('hex');

    var user = new UserModel({ username: username, name: name, email: email,
      password: password, social: 'None'});


    return new Promise((resolve, reject) => {
        user.save().then((user) => {
            resolve(user);
        }).catch((err) => {

            logger.error(err);
            reject(new GraphQLError(`User ${username} or Email ${email} already exists`,null, null, null, null, {
                extensions: {
                    code: "DUPLICATED",
                }
            }));
        });
    });
}

var updateCsvDownloadEnabled = function ({ csvDownloadEnabled }, context) {
    var usernamePetition = context.response.locals.user;

    //User authentication
    authentication(usernamePetition);

    return new Promise((resolve, reject) => {
        UserModel.findOneAndUpdate({ username: usernamePetition }, { $set: { csvDownloadEnabled: csvDownloadEnabled } }, { new: true })
        .then((doc) => {
            resolve(doc);
        })
        .catch((err) => {
            logger.error(err);
            reject(new GraphQLError(`User ${username} or Email ${email} already exists`, null, null, null, null, {
                extensions: {
                    code: "UPDATE_FAIL",
                }
            }));
        });
    });


}

module.exports = {
    retrieveUser: retrieveUser,
    createUser: createUser,
    updateCsvDownloadEnabled: updateCsvDownloadEnabled
};
