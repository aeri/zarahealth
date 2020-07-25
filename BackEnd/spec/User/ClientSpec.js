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

var airport = require('../../GraphQL/AirStation.js');
var weather = require('../../GraphQL/Weather.js');
var pollen = require('../../GraphQL/PollenMeasure.js');


var sampleAir = [{
    "id": 0,
    "title": "Test",
    "address": "CPS",
    "records": [{
        "contaminant": "O3",
        "value": 42.83,
        "station": 26,
        "date": "2020-05-08T18:00:00",
        "status": "LOW"
    }]
}]

var sampleSpecificAir = {
    "id": 0,
    "title": "Test",
    "address": "CPS"
}

var sampleWeather = {
    "temp": 20,
    "humidity": 59,
    "pressure": 1013,
    "weathercode": 801
}

var samplePollen = {
  id: "Quercus",
  title: "Quercus",
  image: "https://www.zaragoza.es/cont/paginas/servicios/polen/img/Quercus.jpg",
  observation:[{"publicationDate":"2020-07-19T00:00:00","value":"nulo"}]
}


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

    settings.save(function (err, client) {

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
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getUri();
    await mongoose.connect(mongoUri, opts, (err, res) => {
        if (err) {
            console.error(err);
        }
    });

    await loadExampleData();

    spyOn(db, "connect");

    spyOn(airport, 'retrieveAllAirStations').and.returnValue(sampleAir);

    spyOn(airport, 'retrieveAirStation').and.returnValue(sampleSpecificAir);

    spyOn(weather, 'retrieveWeather').and.returnValue(sampleWeather);

    spyOn(pollen, 'retrievePollenMeasure').and.returnValue(samplePollen);

    var server = require('../../app.js');

});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe("Client", function () {
    var User = require('../../GraphQL/User.js');
    var user;
    var client_token;
    var user_token;
    var feedId;

    it("should be able to retrieve a Client Token", function (done) {
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
            var objectValue = JSON.parse(res.body);
            client_token = objectValue.access_token;

            expect(res.statusCode).toBe(200);
            done();
        });

    });

    it("should be able to create a User", function (done) {
        const graphQLClient = new GraphQLClient(endpoint, {
            headers: {
                authorization: `Bearer ${client_token}`,
            },
        })

        const query = `
            mutation User($username: String!, $name: String!, $email: String!, $password: String!) {
              createUser(username: $username,name: $name,email: $email,password: $password) {
                name
                email
              }
            }`;

        const variables = {
            username: "test",
            name: "test",
            email: "test",
            password: "test"
        };

        graphQLClient.request(query, variables).then(function (res) {
            expect(res.createUser.name).toBe("test");
            done();
        });

    });

    it("should be able to retrieve a User Token", function (done) {
        var form = {
            grant_type: 'password',
            username: 'test',
            password: 'test'
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

    it("should be able to retrieve a User", function (done) {
        const graphQLClient = new GraphQLClient(endpoint, {
            headers: {
                authorization: `Bearer ${user_token}`,
            },
        })

        const query = `
            query retrieveUser {
              retrieveUser {
                name
                username
                }
              }`;

        graphQLClient.request(query).then(function (res) {
            expect(res.retrieveUser.name).toBe("test");
            done();
        });

    });

    it("should be able to change csv download status", function (done) {
        const graphQLClient = new GraphQLClient(endpoint, {
            headers: {
                authorization: `Bearer ${user_token}`,
            },
        })

        const query = `
            mutation User($csvDownloadEnabled: Boolean!) {
              updateCsvDownloadEnabled(csvDownloadEnabled: $csvDownloadEnabled) {
                csvDownloadEnabled
              }
            }`;

        const variables = {
            csvDownloadEnabled: true
        };

        graphQLClient.request(query, variables).then(function (res) {
            expect(res.updateCsvDownloadEnabled.csvDownloadEnabled).toBe(true);
            done();
        });

    });

    it("should be able to retrieve a specific pollen measure", function (done) {
        const graphQLClient = new GraphQLClient(endpoint, {
            headers: {
                authorization: `Bearer ${client_token}`,
            },
        })

        const query = `
            query retrievePollenMeasure($startDate: String, $endDate: String, $idPollenMeasure: String!) {
                retrievePollenMeasure(idPollenMeasure: $idPollenMeasure, startDate: $startDate, endDate: $endDate) {
                    id
                    title
                    description
                    reino
                    familia
                    image
                    observation{
                        publicationDate
                        value
                    }
                }
            }`;

        const variables = {
            idPollenMeasure: "Quercus",
            startDate: "2019-08-29T00:00:00",
            endDate: "2020-09-05T00:00:00"
        };

        graphQLClient.request(query, variables).then(function (res) {
            expect(res.retrievePollenMeasure.id).toBe("Quercus");
            done();
        })
            .catch((err) => {
                console.log(err.response.errors);
            });

    });

    it("should be able to retrieve a all pollen measures", function (done) {
        const graphQLClient = new GraphQLClient(endpoint, {
            headers: {
                authorization: `Bearer ${client_token}`,
            },
        })

        const query = `
            query retrieveAllPollenMeasures {
              retrieveAllPollenMeasures {
                id
                title
                image
                observation{
                    publicationDate
                    value
                }
              }
            }`;

        const obj = {
            id: 'Urticaceae',
            title: 'Urticaceas',
            image: 'https://www.zaragoza.es/cont/paginas/servicios/polen/img/Urticaceae.jpg'
        }

        graphQLClient.request(query).then(function (res) {
            expect(res.retrieveAllPollenMeasures).toContain(jasmine.objectContaining(obj));
            done();
        });

    });

    it("should be able to retrieve a specific water station", function (done) {
        const graphQLClient = new GraphQLClient(endpoint, {
            headers: {
                authorization: `Bearer ${client_token}`,
            },
        })

        const query = `
            query retrieveWaterStation ($startDate: String!, $endDate: String!){
              retrieveWaterStation(idWaterStation: 1, startDate: $startDate, endDate: $endDate) {
                id
                title
                geometry {
                    x
                    y
                }
                results {
                    result
                    creationDate
                }
              }
            }`;

        const variables = {
            startDate: "2011-02-07T00:00:00",
            endDate: "2013-05-06T00:00:00"
        };

        graphQLClient.request(query, variables).then(function (res) {
            expect(res.retrieveWaterStation.id).toBe(1);
            done();
        });

    });

    it("should be able to retrieve all water stations", function (done) {
        const graphQLClient = new GraphQLClient(endpoint, {
            headers: {
                authorization: `Bearer ${client_token}`,
            },
        })

        const query = `
            query retrieveAllWaterStations {
              retrieveAllWaterStations {
                id
                title
                geometry {
                    x
                    y
                }
                results {
                    id
                    result
                    creationDate
                }
              }
            }`;

        const obj = {
            id: 11,
            title: 'Red de Villamayor',
            geometry: null
        }

        graphQLClient.request(query).then(function (res) {
            expect(res.retrieveAllWaterStations).toContain(jasmine.objectContaining(obj));
            done();
        });

    });

    it("should be able to retrieve a all air stations", function (done) {
        const graphQLClient = new GraphQLClient(endpoint, {
            headers: {
                authorization: `Bearer ${client_token}`,
            },
        })

        const query = `
        query {
          retrieveAllAirStations{
            id
            title
            address
            records{
              contaminant,
              date,
              value,
              station,
              status
            }
          }
        }`;


        graphQLClient.request(query).then(function (res) {
            expect(res.retrieveAllAirStations).toEqual(sampleAir);
            done();
        });

    });

    it("should be able to retrieve a specific air station", function (done) {
        const graphQLClient = new GraphQLClient(endpoint, {
            headers: {
                authorization: `Bearer ${client_token}`,
            },
        })

        const query = `
    query retrieveAirStation ($station: Int!, $since: String!,
      $until: String! ){
      retrieveAirStation(idAirStation: $station, startDate: $since, endDate: $until ){
        id
        title
        address
      }
    }`;

        const variables = {
            "station": 40,
            "since": "1998-04-22T00:00:00Z",
            "until": "1998-05-25T00:00:00Z"
        };

        graphQLClient.request(query, variables).then(function (res) {
            expect(res.retrieveAirStation).toEqual(sampleSpecificAir);
            done();
        });

    });

    it("should be able to retrieve the weather in Zaragoza", function (done) {
        const graphQLClient = new GraphQLClient(endpoint, {
            headers: {
                authorization: `Bearer ${client_token}`,
            },
        })

        const query = `
      query {
        retrieveWeather {
          temp
          humidity
          pressure
          weathercode
          }
        }
        `;

        graphQLClient.request(query).then(function (res) {
            expect(res.retrieveWeather).toEqual(sampleWeather);
            done();
        });

    });

    it("should be able to update User Air Station", function (done) {
        const graphQLClient = new GraphQLClient(endpoint, {
            headers: {
                authorization: `Bearer ${user_token}`,
            },
        })

        const query = `
      mutation updateUserAirStation($idAirStation: Int!) {
          updateUserAirStation(idAirStation: $idAirStation) {
            preferredAirStation {
                id
                title
                address
            }
          }
        }
        `;

        const obj = {
            id: 40,
            title: 'Actur',
            address: 'Calle Cineasta Carlos Saura'
        }

        const variables = {
            idAirStation: 40
        };

        graphQLClient.request(query, variables).then(function (res) {
            expect(res.updateUserAirStation.preferredAirStation).toEqual(jasmine.objectContaining(obj));
            done();
        });

    });

    it("should be able to update Update User Water Station", function (done) {
        const graphQLClient = new GraphQLClient(endpoint, {
            headers: {
                authorization: `Bearer ${user_token}`,
            },
        })

        const query = `
      mutation updateUserWaterStation {
        updateUserWaterStation(idWaterStation: 1) {
        name
        email
        preferredWaterStation {
            id
            title
            address
        }
        }
    }

        `;

        const obj = {
            id: 1,
            title: 'Dep\u00F3sito de Casablanca',
            address: 'V\u00EDa Hispanidad, 45'
        }

        graphQLClient.request(query).then(function (res) {
            expect(res.updateUserWaterStation.preferredWaterStation).toEqual(jasmine.objectContaining(obj));
            done();
        });

    });

    it("should be able to update Update User Pollen Threshold", function (done) {
        const graphQLClient = new GraphQLClient(endpoint, {
            headers: {
                authorization: `Bearer ${user_token}`,
            },
        })

        const query = `
      mutation updateUserPollenThreshold($idPollenMeasure: String!, $pollenValue: String!) {
          updateUserPollenThreshold(idPollenMeasure: $idPollenMeasure, pollenValue: $pollenValue) {
            name
            email
            pollenThresholds {
                id
                value
            }
          }
        }
        `;

        const variables = {
            idPollenMeasure: "Morus_alba",
            pollenValue: "alto"
        };

        const obj = {
            id: "Morus_alba",
            value: "alto"
        }

        graphQLClient.request(query, variables).then(function (res) {
            expect(res.updateUserPollenThreshold.pollenThresholds).toContain(jasmine.objectContaining(obj));
            done();
        });

    });

    it("should be able to update Update User Air Threshold", function (done) {
        const graphQLClient = new GraphQLClient(endpoint, {
            headers: {
                authorization: `Bearer ${user_token}`,
            },
        })

        const query = `
      mutation updateUserAirThreshold($idAirStation: Int!, $airContaminant: Contaminant!, $airValue: Float!) {
          updateUserAirThreshold(idAirStation: $idAirStation, airContaminant: $airContaminant, airValue: $airValue) {
            name
            email
            preferredAirStation {
                id
                thresholds{
                    contaminant
                    value
                }
            }
          }
        }
        `;

        const variables = {
            idAirStation: 40,
            airContaminant: "PM10",
            airValue: 30.5
        };

        const obj = {
            contaminant: "PM10",
            value: 30.5
        }

        graphQLClient.request(query, variables).then(function (res) {
            expect(res.updateUserAirThreshold.preferredAirStation.thresholds).toContain(jasmine.objectContaining(obj));
            done();
        });

    });

    it("should be able to submit a Feed", function (done) {
        const graphQLClient = new GraphQLClient(endpoint, {
            headers: {
                authorization: `Bearer ${user_token}`,
            },
        })

        const query = `
      mutation submitFeed ($title: String!, $body: String!) {
          submitFeed (title: $title, body: $body){
            id
            title
            body
            author
            likes
            dislikes
            status
          }
        }
        `;

        const variables = {
            title: "test",
            body: "test"
        };

        const obj = {
            title: "test",
            body: "test",
            author: "test",
            likes: 0,
            dislikes: 0,
            status: null
        }

        graphQLClient.request(query, variables).then(function (res) {
            obj.id = res.submitFeed.id;
            feedId = res.submitFeed.id;
            expect(res.submitFeed).toEqual(jasmine.objectContaining(obj));
            done();
        });

    });

    it("should be able to retrieve feeds", function (done) {
        const graphQLClient = new GraphQLClient(endpoint, {
            headers: {
                authorization: `Bearer ${user_token}`,
            },
        })

        const query = `
      query retrieveFeeds {
          retrieveFeeds (page: 1, limit: 1){
            id
            title
            body
            author
            likes
            dislikes
            status
          }
        }
        `;


        const obj = {
            id: feedId,
            title: "test",
            body: "test",
            author: "test",
            likes: 0,
            dislikes: 0,
            status: null
        }

        graphQLClient.request(query).then(function (res) {
            expect(res.retrieveFeeds).toContain(jasmine.objectContaining(obj));
            done();
        });

    });

    it("should be able to toggle a feed opinion", function (done) {
        const graphQLClient = new GraphQLClient(endpoint, {
            headers: {
                authorization: `Bearer ${user_token}`,
            },
        })

        const query = `
      mutation toggleFeedOpinion ($id: String!, $status: Opinion!) {
          toggleFeedOpinion (id: $id, status: $status){
            id
            title
            body
            author
            likes
            dislikes
            status
          }
        }
        `;


        const obj = {
            id: feedId,
            title: "test",
            body: "test",
            author: "test",
            likes: 1,
            dislikes: 0,
            status: "LIKE"
        };

        const variables = {
            id: feedId,
            status: "LIKE"
        };

        graphQLClient.request(query,variables).then(function (res) {
            expect(res.toggleFeedOpinion).toEqual(jasmine.objectContaining(obj));
            done();
        });

    });

    it("should be able to submit a comment", function (done) {
        const graphQLClient = new GraphQLClient(endpoint, {
            headers: {
                authorization: `Bearer ${user_token}`,
            },
        })

        const query = `
        mutation submitComment ($id: String!, $body: String!){
          submitComment(id: $id, body: $body){
            id
            title
            body
            author
            likes
            dislikes
            status
            comments{
              author
              body
            }
          }
        }
        `;


        const obj = {
            body: "test",
            author: "test",
        };

        const variables = {
            id: feedId,
            body: "test"
        };

        graphQLClient.request(query, variables).then(function (res) {
            expect(res.submitComment.comments).toContain(jasmine.objectContaining(obj));
            done();
        });

    });


    it("should be able to update its data", function (done) {
        const graphQLClient = new GraphQLClient(endpoint, {
            headers: {
                authorization: `Bearer ${user_token}`,
            },
        })

        const query = `
        mutation ($name: String, $password: String, $email: String){
          updateUser(name:$name, password: $password, email: $email){
            name
            username
            email
          }
        }
`;

        const variables = {
      	"name": "Mitsuku",
      	"email": "localia"
        };

        const expected = {
        "name": "Mitsuku",
        "username": "test",
        "email": "localia"
    }

        graphQLClient.request(query, variables).then(function (res) {
            expect(res.updateUser).toEqual(expected);
            done();
        });

    });



    it("should not be able to retrieve metrics", function (done) {
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
            activities {
              type
              count
            }
          }
        }
        `;

        graphQLClient.request(query).catch(function (err) {
            expect(err.response.errors[0].message).toEqual("User test is not and admin");
            done();
        });

    });

});
