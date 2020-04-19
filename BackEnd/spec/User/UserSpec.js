var req = require("request");
var mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
var clientModel = require('../../mongo/model/client'),
    tokenModel = require('../../mongo/model/token'),
    userModel = require('../../mongo/model/user');
var querystring = require('querystring');
var db = require('../../db.js');

function loadExampleData() {

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


    client1.save(function (err, client) {

        if (err) {
            return console.error(err);
        }
        console.log('Created client', client);
    });

    client2.save(function (err, client) {

        if (err) {
            return console.error(err);
        }
        console.log('Created client', client);
    });
};

// May require additional time for downloading MongoDB binaries
jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

const opts = { useCreateIndex: true, useUnifiedTopology: true, useNewUrlParser: true }; // remove this option if you use mongoose 5 and above

beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getUri();
    await mongoose.connect(mongoUri, opts, (err, res) => {
        if (err) {
            console.error(err);
        }
    });

    await loadExampleData();

    spyOn(db, "connect");

    var server = require('../../app.js');

});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe("User", function () {
    var User = require('../../GraphQL/User.js');
    var user;

    it("should be able to retrieve a Token", function(done) {
        var form = {
            grant_type: 'client_credentials'
        };

        var formData = querystring.stringify(form);
        var contentLength = formData.length;

        req.post({
            headers: {
                'Authorization': 'Basic Y29uZmlkZW50aWFsQXBwbGljYXRpb246dG9wU2VjcmV0',
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            uri: 'http://localhost:3000/oauth/token',
            body: formData,
            method: 'POST'
        }, function (err, res, body) {
                expect(res.statusCode).toBe(200);
                done();
        });

    });

});
