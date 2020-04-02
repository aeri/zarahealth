var { buildSchema } = require('graphql');

// GraphQL schema
var schema = buildSchema(`
    type Query {
         retrieveUser(username: String!): User  
    },
    type Mutation {
        createUser(username: String!, name: String!, email: String!, password: String!): User
    },
    type User {
        username: String!,
        name: String!,
        email: String!
    }
`);

module.exports = schema;
