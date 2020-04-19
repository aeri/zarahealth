var express = require('express');
var	bodyParser = require('body-parser');
var	OAuth2Server = require('oauth2-server');
var	Request = OAuth2Server.Request;
var	Response = OAuth2Server.Response;
var createError = require('http-errors');
var graphqlHTTP = require('express-graphql');
var path = require('path');
var model = require('./model.js');
var db = require('./db.js');
var logger = require('./logger.js');
var google = require('./Google/Google.js');
var cors = require('cors')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

//Allow cors
app.use(cors());

//Conexion con la bbdd
db.connect();

//Uso de oauth
app.oauth = new OAuth2Server({
    model: model,
    accessTokenLifetime: 60 * 60,
    allowBearerTokensInQueryString: true
});

app.post('/oauth/token', obtainToken);
app.all('/oauth/google/token', google.authGoogle, obtainToken);
app.delete('/oauth/token', cancelToken);

//Configuracion de GraphQL
var root = require('./GraphQL/Root.js');
var schema = require('./GraphQL/Schema.js');

//Uso de graphql
app.use('/graphql', authenticateRequest, graphqlHTTP((request, response) => ({
    schema: schema,
    rootValue: root,
    graphiql: true,
    context: { request: request, response: response }
})));

function obtainToken(req, res) {
  var request = new Request(req);
  var response = new Response(res);

	return app.oauth.token(request, response)
		.then(function(token) {
			res.json(model.printToken(token));

		}).catch(function(err) {
            res.status(err.code || 500).json(err);
            logger.debug(err);
		});
}

function authenticateRequest(req, res, next) {

	var request = new Request(req);
	var response = new Response(res);

	return app.oauth.authenticate(request, response)
        .then(function (token) {
            response.locals.user = token.user.username;
            next();
		}).catch(function(err) {
            res.status(err.code || 500).json(err);
            logger.debug(`${err}\n Token: ${request.headers.authorization}`);
		});
}

function cancelToken(req, res) {
    var request = new Request(req);
    var response = new Response(res);

    return app.oauth.authenticate(request, response)
        .then(function (token) {
            model.revokeToken(token, function (err, deleteSuccess) {
                if (deleteSuccess) { res.send("TOKEN_REVOKED"); }
                else {res.status(500).send("INTERNAL_ERROR"); } });
        }).catch(function (err) {
            res.status(err.code || 500).json(err);
            logger.debug(`${err}\n Token: ${request.headers.authorization}`);
        });
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    logger.error(err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//Set Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`Running a GraphQL API server at port ${PORT}`);
});

module.exports = app;
