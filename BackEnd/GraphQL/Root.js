//Funcion de usuario de GraphQL
var userFunctions = require('./User.js');

var root = {
    retrieveUser: userFunctions.retrieveUser,
    createUser: userFunctions.createUser
};

module.exports = root;