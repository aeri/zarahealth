var { buildSchema } = require('graphql');

// GraphQL schema
var schema = buildSchema(`
    type Query {
         "A query to retrieve an existing User"
         retrieveUser(
           "Unique User identifier to be retrieved"
           username: String
         ): User
         retrieveWaterStation(
           "Unique Water identifier to be retrieved"
           idWaterStation: Int
         ): WaterStation
         "A query to retrieve the AirStation specified along with the measurements recorded for the specified time interval (until - since)"
         retrieveAirStation(
           "Unique air station identifier to be retrieved"
           idAirStation: Int!
           "Beginning of the period of time to be observed"
           since: String!,
           "End of the period of time to be observed"
           until: String!,
         ): AirStation
         "A query to retrieve all AirStations in the network along with all the daily measurements recorded"
         retrieveAllAirStations: [AirStation]
         "A query to reatrieve information about the actual weather in Zaragoza"
         retrieveWeather: Weather
         retrievePollenStation(
           "Unique Water identifier to be retrieved"
           idPollenStation: String
         ): PollenStation
    },
    type Mutation {
        "A mutation to register an User"
        createUser(
        "Unique User identifier"
        username: String!,
        "User's full name"
        name: String!,
        "Unique User's e-mail"
        email: String!,
        "User password"
        password: String!
        ): User

        "A mutation to upload an Image"
        uploadUserImage(
        image: Upload
        ): Image

        "A mutation to update the attribute csvDownloadEnabled of the User"
        updateCsvDownloadEnabled(
            "Attribute csvDownloadEnabled"
            csvDownloadEnabled: Boolean!,
        ): User

    },
    "A type that describes the user."
    type User {
        "The user's username, should be typed in the login field"
        username: String!,
        "The user's full name"
        name: String!,
        "The user's e-mail"
        email: String!,
        "The attribute that says if the user is or not an admin"
        isAdmin: Boolean!,
        "The attribute that says if the user wants to view de csv or not"
        csvDownloadEnabled: Boolean!,
        image: Image!
    }
    "A type that describes the image."
    type Image {
        "The image's base 64 data"
        data: String
        "The image's filename"
        filename: String,
        "The image's mimetype"
        mimetype: String,
        "The image's encoding"
        encoding: String
    }
    "A type that describes cartesian coordinate system."
    type Point{
      "Latitude"
      x: Float!,
      "Longitude"
      y: Float!
    }
    type WaterStation {
        id: Int!,
        title: String!,
        address: String!
    }
    "A type that describes the components of an air station"
    type AirStation {
      "Unique air station identifier"
      id: Int!,
      "Name of the air station"
      title: String!,
      "Address of the air station"
      address: String!,
      "Location of the air station"
      geometry: Point,
      "Records of the air station"
      records: [AirRecord]
    }
    "A type that describes the components of an air record"
    type AirRecord {
      "Chemical substance measured in the environment"
      contaminant: String!,
      "Identifier of the station where the measurement was taken"
      station: Int!,
      "Date and time of measurement (ISO 8601)"
      date: String!,
      "Value of measurement in micrograms per cubic meter (µg/m3)"
      value: Float!
    }
    type PollenStation {
        id: String!,
        title: String!,
        description: String!
    }
    type Weather{
      "Current temperature in degrees Celsius"
      temp: Int!,
      "Current humidity level in %"
      humidity: Int,
      "Current pressure level in hPa"
      pressure: Int,
      "Weather condition within the group"
      description: String,
      "Weather condition code (https://openweathermap.org/weather-conditions)"
      weathercode: Int!
    }

    scalar Upload
`);

module.exports = schema;
