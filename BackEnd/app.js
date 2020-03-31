var express = require('express');
var	bodyParser = require('body-parser');
var	mongoose = require('mongoose');
var	OAuth2Server = require('oauth2-server');
var	Request = OAuth2Server.Request;
var	Response = OAuth2Server.Response;
var createError = require('http-errors');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
var path = require('path'); 
var UserModel = require('./mongo/model/user');
var model = require('./model.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

var mongoUri = 'mongodb://localhost/ZaraHealth';

mongoose.connect(mongoUri, {
	useCreateIndex: true,
	useNewUrlParser: true,
	useUnifiedTopology: true
}, function(err, res) {

	if (err) {
		return console.error('Error connecting to "%s":', mongoUri, err);
	}
	console.log('Connected successfully to "%s"', mongoUri);
});

//model.loadExampleData();

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

var retrieveUser = function({ username }) {
    return UserModel.findOne({ username: username },
        function(err, user) {
            if (err) return console.error(err);});  
}

var createUser = function({ username, name, email, password }) {
    var user = new UserModel({ username: username, name: name, email: email, password: password });
    user.save(function (err, user) {
        if (err) return console.error(err);
    });
    return user;
}

var root = {
    retrieveUser: retrieveUser,
    createUser: createUser
};


app.use('/graphql', authenticateRequest, graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));


app.oauth = new OAuth2Server({
	model: model,
	accessTokenLifetime: 60 * 60,
	allowBearerTokensInQueryString: true
});

app.all('/oauth/token', obtainToken);

console.log('Running a GraphQL API server at http://localhost:3000/graphql');

function obtainToken(req, res) {

	var request = new Request(req);
	var response = new Response(res);

	return app.oauth.token(request, response)
		.then(function(token) {

			res.json(token);
		}).catch(function(err) {

			res.status(err.code || 500).json(err);
		});
}

function authenticateRequest(req, res, next) {

	var request = new Request(req);
	var response = new Response(res);

	return app.oauth.authenticate(request, response)
		.then(function(token) {

			next();
		}).catch(function(err) {

			res.status(err.code || 500).json(err);
		});
}

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
