// Standard FIPS 202 SHA-3 implementation
const { SHA3 } = require('sha3');

/**
 * Configuration.
 */

var clientModel = require('./mongo/model/client'),
	tokenModel = require('./mongo/model/token'),
    userModel = require('./mongo/model/user');
var logger = require('./logger.js');

/*
 * Methods used by all grant types.
 */

var getAccessToken = function(token, callback) {

	tokenModel.findOne({
		accessToken: token
	}).lean().exec((function(callback, err, token) {

        if (!token) {
            logger.error('Client not found');
        }

		callback(err, token);
	}).bind(null, callback));
};

var getClient = function(clientId, clientSecret, callback) {

	clientModel.findOne({
		clientId: clientId,
		clientSecret: clientSecret
	}).lean().exec((function(callback, err, client) {

		if (!client) {
            logger.error('Client not found');
		}

		callback(err, client);
	}).bind(null, callback));
};

var saveToken = function(token, client, user, callback) {

	token.client = {
		id: client.clientId
	};

	token.user = {
		username: user.username
	};

	var tokenInstance = new tokenModel(token);
	tokenInstance.save((function(callback, err, token) {

		if (!token) {
			logger.error('Token not saved');
		} else {
			token = token.toObject();
			delete token._id;
            delete token.__v;

            if (user.username == '') {
                logger.info(`A client has logged in.`);
            }
            else {
                logger.info(`The user ${user.username} has logged in.`);
            }

		}

		callback(err, token);
	}).bind(null, callback));
};

/*
 * Method used only by password grant type.
 */

var getUser = function (username, password, callback) {
    //Encriptamos la password
    const hash = new SHA3(512);
    hash.update(password);
    password = hash.digest('hex');

	userModel.findOne({
		username: username,
		password: password
	}).lean().exec((function(callback, err, user) {
        if (!user) {
            logger.error(`User ${username} not found`);
        }
        else if (user.status == "BANNED") {
            user = null;
        }
		callback(err, user);
	}).bind(null, callback));
};

/*
 * Method used only by client_credentials grant type.
 */

var getUserFromClient = function(client, callback) {

	clientModel.findOne({
		clientId: client.clientId,
		clientSecret: client.clientSecret,
		grants: 'client_credentials'
	}).lean().exec((function(callback, err, client) {

		if (!client) {
			console.error('Client not found');
		}

		callback(err, {
			username: ''
		});
	}).bind(null, callback));
};

/*
 * Methods used only by refresh_token grant type.
 */

var getRefreshToken = function(refreshToken, callback) {

	tokenModel.findOne({
		refreshToken: refreshToken
	}).lean().exec((function(callback, err, token) {

		if (!token) {
			console.error('Token not found');
		}

		callback(err, token);
	}).bind(null, callback));
};

var revokeToken = function(token, callback) {

	tokenModel.deleteOne({
		refreshToken: token.refreshToken
	}).exec((function(callback, err, results) {

		var deleteSuccess = results && results.deletedCount === 1;

		if (!deleteSuccess) {
			console.error('Token not deleted');
		}

		callback(err, deleteSuccess);
	}).bind(null, callback));
};

var printToken = function(token) {
  var object = {
    access_token: token.accessToken,
    token_type: 'Bearer'
  };

  if (token.accessTokenExpiresAt) {
    object.expires_in = Math.floor((token.accessTokenExpiresAt - new Date()) / 1000);
  }

  if (token.refreshToken) {
    object.refresh_token = token.refreshToken;
  }

  if (token.scope) {
    object.scope = token.scope;
  }

  for (var key in token.customAttributes) {
    if (token.customAttributes.hasOwnProperty(key)) {
      object[key] = token.customAttributes[key];
    }
  }
  return object;
};


/**
 * Export model definition object.
 */

module.exports = {
	getAccessToken: getAccessToken,
	getClient: getClient,
	saveToken: saveToken,
	getUser: getUser,
	getUserFromClient: getUserFromClient,
	getRefreshToken: getRefreshToken,
	revokeToken: revokeToken,
	printToken: printToken
};
