var UserModel = require('../mongo/model/user.js');
var logger = require('../logger.js');

const { GraphQLError } = require('graphql')

// Standard FIPS 202 SHA-3 implementation
const { SHA3 } = require('sha3');

var retrieveUser = function ({ username }, context) {
    var usernamePetition = context.response.locals.user;

    if (!usernamePetition){
      throw new GraphQLError(`This query needs user authorization`,null, null, null, null, {
          extensions: {
              code: "UNAUTHORIZED",
          }
      })
    }
    if (!username){
      username = usernamePetition;
    }

    return UserModel.findOne({ username: username }).orFail(() =>
    new GraphQLError(`User ${username} not found`,null, null, null, null, {
        extensions: {
            code: "NOT_FOUND",
        }
    }));
}

var createUser = function ({ username, name, email, password }, context) {
    var usernamePetition = context.response.locals.user;

    // Hashing the password
    const hash = new SHA3(512);
    hash.update(password);
    password = hash.digest('hex');

    var user = new UserModel({ username: username, name: name, email: email,
      password: password, social: 'None', isAdmin: false });


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

module.exports = {
    retrieveUser: retrieveUser,
    createUser: createUser
};
