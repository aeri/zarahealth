var UserModel = require('../mongo/model/user');

// Standard FIPS 202 SHA-3 implementation
const { SHA3 } = require('sha3');

var retrieveUser = function ({ username }, context) {
    var usernamePetition = context.response.locals.user;

    return UserModel.findOne({ username: username }).orFail(() => Error('Not found'));
}

var createUser = function ({ username, name, email, password }, context) {
    var usernamePetition = context.response.locals.user;

    //Encriptamos la contraseņa
    const hash = new SHA3(512);
    hash.update(password);
    password = hash.digest('hex');

    var user = new UserModel({ username: username, name: name, email: email, password: password });


    return new Promise((resolve, reject) => {
        user.save().then((user) => {
            resolve(user);
        }).catch((err) => {
            reject(err);
        });
    });
}

module.exports = {
    retrieveUser: retrieveUser,
    createUser: createUser
};
