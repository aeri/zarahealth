
const { makeExecutableSchema } = require('graphql-tools')
const { GraphQLUpload } = require('graphql-upload')

const schema = makeExecutableSchema({
    typeDefs: /* GraphQL */ `
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

        "A query to retrieve all feeds"
        retrieveFeeds(
          "Current page number"
          page: Int!
          "Results per page (100 maximum)"
          limit: Int!
        ): [Feed]

        "A query to retrieve all users (Admin only)"
        retrieveUsers(
          "Current page number"
          page: Int!
          "Results per page (100 maximum)"
          limit: Int!
        ): [User]

        "A query to retrieve all settings (Admin only)"
        retrieveSettings: [Settings]

        "A query to retrieve API metrics (Admin only)"
        retrieveMetrics: Metrics
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

        "A mutation to update User data (Only internal user)"
        updateUser(
        "The new name of the User"
        name: String
        "The new password of the User"
        password: String
        "The new email of the User"
        email: String
        ): User

        "A mutation to upload the user profile picture"
        uploadUserImage(
        "Picture upload in a multipart upload request"
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

        "A mutation to create a Feed"
        submitFeed(
            "Title of the feeed"
            title: String!,
            "Body text of the feed"
            body: String!,
            "Pictures upload of the feed in a multipart upload request"
            pictures: [Upload!]
        ): Feed

        "A mutation to change a user's opinion about a feed"
        toggleFeedOpinion(
            "Unique id of the feed"
            id: String!,
            "Opinion of the user"
            status: Opinion!,
        ): Feed

        "A mutation to change a user's opinion about a feed"
        submitComment(
            "Unique identifier of the feed"
            id: String!,
            "Body of the comment"
            body: String!,
        ): Feed

        "A mutation to ban or unban an user (Admin only)"
        updateUserStatus(
            "Unique User identifier to be retrieved"
            username: String!,
            "The status of the user account"
            status: UserStatus!
        ): User

        "A mutation to change the settings water status"
        updateWaterStatus(
            "The id of the configuration"
            id: String!,
            "The status of the user account"
            waterStatus: Boolean!
        ): Settings

        "A mutation to change the settings air status"
        updateAirStatus(
            "The id of the configuration"
            id: String!,
            "The status of the user account"
            airStatus: Boolean!
        ): Settings

    "A mutation to change the settings pollen status"
        updatePollenStatus(
            "The id of the configuration"
            id: String!,
            "The status of the user account"
            pollenStatus: Boolean!
        ): Settings

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
        pollenThresholds: [PollenThreshold],
        "The attribute that says the status of the user"
        status: UserStatus
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
    "A type thath describes a water station"
    type WaterStation {
        "Unique water station identifier"
        id: Int!,
        "Name of the water station"
        title: String!,
        "Address of the water station"
        address: String,
        "Location of the water station"
        geometry: Point,
        "Results of the water station"
        results: [WaterRecord]!
    }
    "A type that describes a water record"
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
      contaminant: Contaminant!,
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
    "A type thath describes a pollen measure"
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
    "A type that describes a pollen record"
    type PollenRecord {
        "Date and time of measurement (ISO 8601)"
        publicationDate: String!,
        "The value for the pollen measure"
        value: String!,
    }
    "A type that describes a pollen boundary"
    type PollenThreshold {
        "Pollen substance measured in the environment"
        id: String!,
        "The value for the pollen measure"
        value: String!
    }
    "A type that describes the weather status"
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
    "A type that describes a feed commited by an user"
    type Feed {
      "Unique feed identifier"
      id: String!
      "Title of the feed"
      title:  String!
      "The username that commited the feed"
      author: String!
      "Body text of feed"
      body:   String!
      "Comments commited on this feed"
      comments: [Comment]
      "Date when feed was commited in UNIX milliseconds"
      date: String!
      "Pictures of the feed"
      pictures: [Image]
      "Number of users that liked the feed"
      likes: Int!
      "Number of users that does not liked the feed"
      dislikes:  Int!
      "Opinion about the feed from the user making the request"
      status: Opinion
    }
    "A type that describes a comment commited by an user in a feed"
    type Comment{
      "The username that commited the comment"
      author: String,
      "Body text of the comment"
      body: String,
      "Date when comment was published in UNIX milliseconds"
      date: String
    }
    "A type that describes the system status settings"
    type Settings {
        "Unique identifier of the setting"
        id: String!,
        "True if water is enabled to retrieve"
        water: Boolean!,
        "True if pollen is enabled to retrieve"
        pollen: Boolean!,
        "True if air data is enabled to retrieve"
        air: Boolean!
    }
    "A type that describes the data metrics of the system"
    type Metrics{
      "Total number of users registered in the system"
      users: Int!,
      "Total number of users whose token has not expired"
      activeUsers: Int!,
      "Total number of feeds registered in the system"
      feeds: Int!,
      "List of activities tracked"
      activities: [Activity]
    }
    "A type that describes a summary of user activities"
    type Activity{
      "Name of the activity tracked"
      type: String!,
      "Number of access to the activity"
      count: Int!
    }
    enum Contaminant {
        "Nitrogen oxides"
        NOx
        "Sulfur dioxide"
        SO2
        "Nitrogen dioxide"
        NO2
        "Carbon monoxide"
        CO
        "Ozone"
        O3
        "Particulate matter 10"
        PM10
        "Particulate matter 2.5"
        PM2_5
        "Hydrogen sulfide"
        SH2
    }
    enum Opinion{
        LIKE
        DISLIKE
    }
    enum UserStatus{
        "The user is enabled to retrieve access_tokens"
        ENABLED
        "The user is banned to retrieve access_tokens"
        BANNED
    }

    scalar Upload
`,
    resolvers: {
        Upload: GraphQLUpload
    }
})


module.exports = schema;
