var createError = require('http-errors');
var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
var path = require('path'); 
const mongoose = require('mongoose');

//var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Defined a database connection string

const dbURI = 'mongodb://localhost/ZaraHealth';

// Opened a Mongoose connection at application startup

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("We are connected");
});

const userSchema = new mongoose.Schema({
    username: String,
    name: String,
    email: String
});

var UserModel = mongoose.model('User', userSchema);

// GraphQL schema
var schema = buildSchema(`
    type Query {
         retrieveUser(username: String!): User  
    },
    type Mutation {
        createUser(username: String!, name: String!, email: String!): User
    },
    type User {
        username: String!,
        name: String!,
        email: String!
    }
`);

var retrieveUser = function({ username }) {
    return UserModel.findOne({ username: username },
        function(err, user) {
            if (err) return console.error(err);});  
}

var createUser = function({ username, name, email }) {
    var user = new UserModel({ username: username, name: name, email: email });
    user.save(function (err, user) {
        if (err) return console.error(err);
    });
    return user;
}

var root = {
    retrieveUser: retrieveUser,
    createUser: createUser
};

var app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
