var { buildSchema } = require('graphql');

// GraphQL schema
var schema = buildSchema(`
    type Query {
         "A query to retrieve an existing User"
         retrieveUser(
           "Unique User identifier to be retrieved"
           username: String
         ): User
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
    },
    "A type that describes the user."
    type User {
        "The user's username, should be typed in the login field"
        username: String!,
        "The user's full name"
        name: String!,
        "The user's e-mail"
        email: String!
    }
`);

module.exports = schema;
