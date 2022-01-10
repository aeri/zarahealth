var req = require("request");
var mongoose = require('mongoose');
const {
    MongoMemoryServer
} = require('mongodb-memory-server');
var clientModel = require('../../mongo/model/client'),
    tokenModel = require('../../mongo/model/token'),
    userModel = require('../../mongo/model/user'),
    settingModel = require('../../mongo/model/settings');
var querystring = require('querystring');
var db = require('../../db.js');
const {
    GraphQLClient
} = require('graphql-request');
const endpoint = "http://localhost:3000/graphql";
// Standard FIPS 202 SHA-3 implementation
const {
    SHA3
} = require('sha3');


function loadExampleData() {

    var client1 = new clientModel({
        id: 'application', // TODO: Needed by refresh_token grant, because there is a bug at line 103 in https://github.com/oauthjs/node-oauth2-server/blob/v3.0.1/lib/grant-types/refresh-token-grant-type.js (used client.id instead of client.clientId)
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

    // Hashing the password
    const hash = new SHA3(512);
    hash.update("test");
    password = hash.digest('hex');

    var user = new userModel({
        username: "test",
        name: "test",
        email: "test",
        password: password,
        isAdmin: true,
        social: 'None'
    });

    var settings = new settingModel({
        _id: '5ebd8a20934189c057ef873c',
        air: true,
        water: true,
        pollen: true
    })

    client1.save(function (err, client) {

        if (err) {
            return console.error(err);
        }
    });

    client2.save(function (err, client) {

        if (err) {
            return console.error(err);
        }
    });

    user.save(function (err, user) {

        if (err) {
            return console.error(err);
        }
    });

    settings.save(function (err, settings) {

        if (err) {
            return console.error(err);
        }
    });


};

// May require additional time for downloading MongoDB binaries
jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

const opts = {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
}; // remove this option if you use mongoose 5 and above

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
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

describe("Admin", function () {
    var User = require('../../GraphQL/User.js');
    var user;
    var user_token;
    var settingsId = "5ebd8a20934189c057ef873c";

    it("should be able to retrieve a User Token", function (done) {
        var form = {
            grant_type: 'password',
            username: "test",
            password: "test"
        };

        var formData = querystring.stringify(form);
        var contentLength = formData.length;

        req.post({
            headers: {
                'Authorization': 'Basic YXBwbGljYXRpb246c2VjcmV0',
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            uri: 'http://localhost:3000/oauth/token',
            body: formData,
            method: 'POST'
        }, function (err, res, body) {
            var objectValue = JSON.parse(res.body);
            user_token = objectValue.access_token;
            expect(res.statusCode).toBe(200);
            done();
        });

    });

    it("should be able to retrieve metrics", function (done) {
        const graphQLClient = new GraphQLClient(endpoint, {
            headers: {
                authorization: `Bearer ${user_token}`,
            },
        })

        const query = `
        query retrieveMetrics {
          retrieveMetrics {
            users
            activeUsers
            feeds
          }
        }
        `;

        const obj = {
            users: 1,
            activeUsers: 1,
            feeds: 0
        };

        graphQLClient.request(query).then(function (res) {
            expect(res.retrieveMetrics).toEqual(jasmine.objectContaining(obj));
            done();
        });

    });

    it("should be able to retrieve users", function (done) {
        const graphQLClient = new GraphQLClient(endpoint, {
            headers: {
                authorization: `Bearer ${user_token}`,
            },
        })

        const query = `
        query retrieveUsers($page: Int!, $limit: Int!) {
          retrieveUsers (page: $page, limit: $limit){
            username
            email
            status
          }
        }`;

        const variables = {
            page: 1,
            limit: 100
        };

        const obj = {
            username: "test",
            email: "test",
            status: "ENABLED"
        };

        graphQLClient.request(query, variables).then(function (res) {
            expect(res.retrieveUsers).toContain(jasmine.objectContaining(obj));
            done();
        });

    });

    it("should be able to update a user status", function (done) {
        const graphQLClient = new GraphQLClient(endpoint, {
            headers: {
                authorization: `Bearer ${user_token}`,
            },
        })

        const query = `
        mutation updateUserStatus($username: String!, $status: UserStatus!) {
          updateUserStatus(username: $username, status: $status) {
            username
            status
          }
        }
        `;

        const variables = {
            username: "test",
            status: "ENABLED"
        };

        const obj = {
            username: "test",
            status: "ENABLED"
        };

        graphQLClient.request(query, variables).then(function (res) {
            expect(res.updateUserStatus).toEqual(jasmine.objectContaining(obj));
            done();
        });

    });

    it("should be able to retrieve the settings", function (done) {
        const graphQLClient = new GraphQLClient(endpoint, {
            headers: {
                authorization: `Bearer ${user_token}`,
            },
        })

        const query = `
        query retrieveSettings {
          retrieveSettings{
            water
            air
            pollen
            id
          }
        }
        `;

        const obj = {
            water: true,
            air: true,
            pollen: true,
            id: settingsId
        };

        graphQLClient.request(query).then(function (res) {
            expect(res.retrieveSettings).toContain(jasmine.objectContaining(obj));
            done();
        });

    });

    it("should be able to update water status", function (done) {
        const graphQLClient = new GraphQLClient(endpoint, {
            headers: {
                authorization: `Bearer ${user_token}`,
            },
        })

        const query = `
        mutation updateWaterStatus($id: String!, $waterStatus: Boolean!) {
          updateWaterStatus(id: $id, waterStatus: $waterStatus) {
            water
            air
            pollen
            id
          }
        }
        `;

        const variables = {
            id: "5ebd8a20934189c057ef873c",
            waterStatus: false
        };

        const obj = {
            id: "5ebd8a20934189c057ef873c",
            water: false,
            air: true,
            pollen: true
        };

        graphQLClient.request(query, variables).then(function (res) {
            expect(res.updateWaterStatus).toEqual(jasmine.objectContaining(obj));
            done();
        });

    });

    it("should be able to update air status", function (done) {
        const graphQLClient = new GraphQLClient(endpoint, {
            headers: {
                authorization: `Bearer ${user_token}`,
            },
        })

        const query = `
        mutation updateAirStatus($id: String!, $airStatus: Boolean!) {
          updateAirStatus(id: $id, airStatus: $airStatus) {
            water
            air
            pollen
            id
          }
        }
        `;

        const variables = {
            id: "5ebd8a20934189c057ef873c",
            airStatus: false
        };

        const obj = {
            id: "5ebd8a20934189c057ef873c",
            water: false,
            air: false,
            pollen: true
        };

        graphQLClient.request(query, variables).then(function (res) {
            expect(res.updateAirStatus).toEqual(jasmine.objectContaining(obj));
            done();
        });

    });

    it("should be able to update pollen status", function (done) {
        const graphQLClient = new GraphQLClient(endpoint, {
            headers: {
                authorization: `Bearer ${user_token}`,
            },
        })

        const query = `
        mutation updatePollenStatus($id: String!, $pollenStatus: Boolean!) {
          updatePollenStatus(id: $id, pollenStatus: $pollenStatus) {
            water
            air
            pollen
            id
          }
        }
        `;

        const variables = {
            id: "5ebd8a20934189c057ef873c",
            pollenStatus: false
        };

        const obj = {
            id: "5ebd8a20934189c057ef873c",
            water: false,
            air: false,
            pollen: false
        };

        graphQLClient.request(query, variables).then(function (res) {
            expect(res.updatePollenStatus).toEqual(jasmine.objectContaining(obj));
            done();
        });

    });

    

});
