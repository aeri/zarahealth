
var ActivityModel = require('./mongo/model/activity.js');
var logger = require('./logger.js');

var track = async function (action, context) {

  var activity = new ActivityModel({
      username: context.response.locals.user,
      ip: context.request.connection.remoteAddress,
      userAgent: context.request.headers["user-agent"],
      action: action
  });

  activity.save(function(err, doc) {
      if (err) {
          logger.error(err);
      return console.error(err);
      }
  logger.info("Activity tracked");
  });
}

module.exports = {
  track: track
};
