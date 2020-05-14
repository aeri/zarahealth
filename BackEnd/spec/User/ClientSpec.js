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


var sampleAir = [{
  "id": 0,
  "title": "Test",
  "address": "CPS",
  "records": [{
    "contaminant": "10",
    "value": 42.83,
    "station": 26,
    "date": "2020-05-08T18:00:00",
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

  client1.save(function(err, client) {

    if (err) {
      return console.error(err);
    }
  });

  client2.save(function(err, client) {

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

  var server = require('../../app.js');

});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Client", function() {
  var User = require('../../GraphQL/User.js');
  var user;
  var client_token;
  var user_token;

  it("should be able to retrieve a Client Token", function(done) {
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
    }, function(err, res, body) {
      var objectValue = JSON.parse(res.body);
      client_token = objectValue.access_token;

      expect(res.statusCode).toBe(200);
      done();
    });

  });

  it("should be able to create a User", function(done) {
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

    graphQLClient.request(query, variables).then(function(res) {
      expect(res.createUser.name).toBe("test");
      done();
    });

  });

  it("should be able to retrieve a User Token", function(done) {
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
    }, function(err, res, body) {
      var objectValue = JSON.parse(res.body);
      user_token = objectValue.access_token;

      expect(res.statusCode).toBe(200);
      done();
    });

  });

  it("should be able to retrieve a User", function(done) {
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

    graphQLClient.request(query).then(function(res) {
      expect(res.retrieveUser.name).toBe("test");
      done();
    });

  });

  it("should be able to change csv download status", function(done) {
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

    graphQLClient.request(query, variables).then(function(res) {
      expect(res.updateCsvDownloadEnabled.csvDownloadEnabled).toBe(true);
      done();
    });

  });

  it("should be able to retrieve a specific pollen measure", function(done) {
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

  it("should be able to retrieve a all pollen measures", function(done) {
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

    graphQLClient.request(query).then(function(res) {
      expect(res.retrieveAllPollenMeasures).toContain(jasmine.objectContaining(obj));
      done();
    });

  });

  it("should be able to retrieve a specific water station", function(done) {
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

    graphQLClient.request(query, variables).then(function(res) {
      expect(res.retrieveWaterStation.id).toBe(1);
      done();
    });

  });

  it("should be able to retrieve all water stations", function(done) {
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

    graphQLClient.request(query).then(function(res) {
      expect(res.retrieveAllWaterStations).toContain(jasmine.objectContaining(obj));
      done();
    });

  });

  it("should be able to retrieve a all air stations", function(done) {
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
              station
            }
          }
        }`;


    graphQLClient.request(query).then(function(res) {
      expect(res.retrieveAllAirStations).toEqual(sampleAir);
      done();
    });

  });

  it("should be able to retrieve a specific air station", function(done) {
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

    graphQLClient.request(query, variables).then(function(res) {
      expect(res.retrieveAirStation).toEqual(sampleSpecificAir);
      done();
    });

  });

  it("should be able to retrieve the weather in Zaragoza", function(done) {
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

    graphQLClient.request(query).then(function(res) {
      expect(res.retrieveWeather).toEqual(sampleWeather);
      done();
    });

  });


});
