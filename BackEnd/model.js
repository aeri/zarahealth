// Standard FIPS 202 SHA-3 implementation
const { SHA3 } = require('sha3');

/**
 * Configuration.
 */

var clientModel = require('./mongo/model/client'),
	tokenModel = require('./mongo/model/token'),
    userModel = require('./mongo/model/user');
var logger = require('./logger.js');

/**
 * Add example client and user to the database (for debug).
 */

var loadExampleData = function() {

	var client1 = new clientModel({
		id: 'application',	// TODO: Needed by refresh_token grant, because there is a bug at line 103 in https://github.com/oauthjs/node-oauth2-server/blob/v3.0.1/lib/grant-types/refresh-token-grant-type.js (used client.id instead of client.clientId)
		clientId: 'application',
		clientSecret: 'secret',
		grants: [
			'password',
			'refresh_token'
		],
		redirectUris: []
	});

	var client2 = new clientModel({
		clientId: 'confidentialApplication',
		clientSecret: 'topSecret',
		grants: [
			'password',
			'client_credentials'
		],
		redirectUris: []
	});

	client1.save(function(err, client) {

		if (err) {
			return console.error(err);
		}
        logger.info(`Created client ${client}`);
	});

	client2.save(function(err, client) {

		if (err) {
			return console.error(err);
		}
        logger.info(`Created client ${client}`);
	});
};


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
            if (!user) logger.info(`A client has logged in.`);
            if (!client) logger.info(`The user ${user.username} has logged in.`);
            
		}

		callback(err, token);
	}).bind(null, callback));
};

/*
 * Method used only by password grant type.
 */

var getUser = function (username, password, callback) {
    //Encriptamos la contraseña
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

/**
 * Export model definition object.
 */

module.exports = {
    loadExampleData: loadExampleData,
	getAccessToken: getAccessToken,
	getClient: getClient,
	saveToken: saveToken,
	getUser: getUser,
	getUserFromClient: getUserFromClient,
	getRefreshToken: getRefreshToken,
	revokeToken: revokeToken
};
