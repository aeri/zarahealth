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
         retrieveAirStation: AirStation
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
    type WaterStation {
        id: Int!,
        title: String!,
        address: String!
    }
    type AirStation {
        id: Int!,
        title: String!,
        address: String!
    }
    type PollenStation {
        id: String!,
        title: String!,
        description: String!
    }

    scalar Upload
`);

module.exports = schema;
