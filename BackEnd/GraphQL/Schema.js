var { buildSchema } = require('graphql');

// GraphQL schema
var schema = buildSchema(`
    type Query {
         "A query to retrieve an existing User"
         retrieveUser(
           "Unique User identifier to be retrieved"
           username: String
         ): User
         "A query to retrieve the WaterStation specified along with the measurements recorded for the specified time interval (startDate - endDate)"
         retrieveWaterStation(
           "Beginning of the period of time to be observed"
           startDate: String,
           "End of the period of time to be observed"
           endDate: String,
           "Unique Water identifier to be retrieved"
           idWaterStation: Int!
         ): WaterStation
         "A query to retrieve all WaterStations in the network along with all the daily measurements recorded"
         retrieveAllWaterStations: [WaterStation]
         "A query to retrieve the AirStation specified along with the measurements recorded for the specified time interval (endDate - startDate)"
         retrieveAirStation(
           "Unique air station identifier to be retrieved"
           idAirStation: Int!
           "Beginning of the period of time to be observed"
           startDate: String!,
           "End of the period of time to be observed"
           endDate: String!,
         ): AirStation
         "A query to retrieve all AirStations in the network along with all the daily measurements recorded"
         retrieveAllAirStations: [AirStation]
         "A query to reatrieve information about the actual weather in Zaragoza"
         retrieveWeather: Weather
         "A query to retrieve the PollenMeasure specified along with the measurements recorded for the specified time interval (startDate - endDate)"
         retrievePollenMeasure(
           "Beginning of the period of time to be observed"
           startDate: String,
           "End of the period of time to be observed"
           endDate: String,
           "Unique Water identifier to be retrieved"
           idPollenMeasure: String!,
         ): PollenMeasure
         "A query to retrieve all PollenMeasures in the network along with all the daily measurements recorded"
        retrieveAllPollenMeasures: [PollenMeasure]
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

        "A mutation to update the attribute preferredAirStation of the User"
        updateUserAirStation(
            "Attribute idAirStation"
            idAirStation: Int!,
        ): User

        "A mutation to update the attribute preferredWaterStation of the User"
        updateUserWaterStation(
            "Attribute idWaterStation"
            idWaterStation: Int!,
        ): User

        "A mutation to update the attribute pollenThreshold of the User"
        updateUserPollenThreshold(
            "Attribute idPollenMeasure"
            idPollenMeasure: String!,
            "Threshold value for the pollen"
            pollenValue: String!
        ): User

        "A mutation to update the attribute pollenThreshold of the User"
        updateUserAirThreshold(
            "Attribute idAirStation"
            idAirStation: Int!,
            "Type of contaminant for the air"
            airContaminant: Contaminant!,
            "Threshold value for the air value"
            airValue: Float!
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
        "The attribute that contains the profile picture"
        image: Image,
        "The attribute that contains the prefered air station"
        preferredAirStation: UserAirStation,
        "The attribute that contains the prefered water station"
        preferredWaterStation: WaterStation
        "The attribute that contains the pollen measure"
        pollenThresholds: [PollenThreshold]   
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
        "Unique water station identifier"
        id: Int!,
        "Name of the water station"
        title: String!,
        "Address of the water station"
        address: String!,
        "Location of the water station"
        geometry: Point,
        "Results of the water station"
        results: [WaterRecord]!
    }
    type WaterRecord {
        "Id of the bulletin"
        id: String!,
        "Date and time of measurement (ISO 8601)"
        creationDate: String!,
        "Result of the measure"
        result: String
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
    "A type that describes the components of an air station for a user"
    type UserAirStation {
        "Unique air station identifier"
        id: Int!,
        "Name of the air station"
        title: String!,
        "Address of the air station"
        address: String!,
        "Thresholds for the air station"
        thresholds: [AirStationThresholds]
    }
    "A type that describes the components of an air station threshold"
    type AirStationThresholds {
      "Chemical substance measured in the environment"
      contaminant: Contaminant!,
      "Value of measurement in micrograms per cubic meter (µg/m3)"
      value: Float!
    }
    type PollenMeasure {
        "Pollen substance measured in the environment"
        id: String!,
        "Name of the pollen measure"
        title: String!,
        "Description of the pollen measure"
        description: String,
        "Reign of the pollen measure"
        reino: String,
        "Family of the pollen measure"
        familia: String,
        "Image of the pollen measure"
        image: String!,
        "Observations for the pollen measure"
        observation: [PollenRecord]!
    }
    type PollenRecord {
        "Date and time of measurement (ISO 8601)"
        publicationDate: String!,
        "The value for the pollen measure"
        value: String!,
    }
    type PollenThreshold {
        "Pollen substance measured in the environment"
        id: String!,
        "The value for the pollen measure"
        value: String!
    }
    type Weather{
        "Current temperature in degrees Celsius"
        temp: Float!,
        "Current humidity level in %"
        humidity: Int,
        "Current pressure level in hPa"
        pressure: Int,
        "Weather condition within the group"
        description: String,
        "Weather condition code (https://openweathermap.org/weather-conditions)"
        weathercode: Int!
    }
    enum Contaminant {
        NOx
        SO2
        NO2
        CO
        O3
        PM10
        PM2_5
        SH2
    }

    scalar Upload
`);

module.exports = schema;
