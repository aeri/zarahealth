const { authenticateGoogle } = require('./passport.js');
var UserModel = require('../mongo/model/user.js');
var aesjs = require('aes-js');
var logger = require('../logger.js');
const https = require('https');
var secret = require('../Secret.js');

// Standard FIPS 202 SHA-3 implementation
const { SHA3 } = require('sha3');

var key = secret.key;

var authGoogle = async function (req, res, next) {

    try {
        // data contains the accessToken, refreshToken and profile from passport
        const { data, info } = await authenticateGoogle(req, res);

        if (data) {
            var text = data.profile._json.email;
            var textBytes = aesjs.utils.utf8.toBytes(text);

            // The counter is optional, and if omitted will begin at 1
            var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
            var encryptedBytes = aesCtr.encrypt(textBytes);

            // To print or store the binary data, you may convert it to hex
            var password = aesjs.utils.hex.fromBytes(encryptedBytes);
            var prepasswd = password;

            // Hashing the password
            const hash = new SHA3(512);
            hash.update(password);
            password = hash.digest('hex');

            const userExists = await UserModel.exists({ username: data.profile._json.id });

            req.body = { grant_type: 'password', username: data.profile._json.id, password: prepasswd };

            if (userExists) {
                next();
            }
            else {
                var user = new UserModel({ username: data.profile._json.id,
                  name: data.profile.displayName, email: text,
                  password: password, social: 'Google', isAdmin: false });

                new Promise((resolve, reject) => {
                    user.save().then((user) => {
                        next();
                    }).catch((err) => {
                        logger.error(err);
                        res.status(500);
                        return res.json('DATABASE_ERROR');
                    });
                });
            }

        }

        if (info) {
            logger.error(info);
            switch (info.code) {
                case 'ETIMEDOUT':
                    res.status(500);
                    return res.json('TIMEOUT'); //TODO
                default:
                    res.status(400);
                    return res.json('INVALID_TOKEN'); //TODO
            }
        }
        return (Error('server error'));
    } catch (error) {
        return error;
    }
}

module.exports = {
    authGoogle: authGoogle
};
