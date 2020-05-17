const mongoosePaginate = require('mongoose-paginate-v2')
var UserModel = require('../mongo/model/user.js');
var tokenModel = require('../mongo/model/token.js');
var logger = require('../logger.js');

var UserModel = require('../mongo/model/user.js');
var FeedModel = require('../mongo/model/feed.js');
var TokenModel = require('../mongo/model/token.js');
var ActivityModel = require('../mongo/model/activity.js');
var _ = require('underscore');

const {
  GraphQLError
} = require('graphql')

async function adminAuthentication(username) {
  if (!username) {
    throw new GraphQLError(`This query needs user authorization`, null, null, null, null, {
      extensions: {
        code: "UNAUTHORIZED",
      }
    })
  } else {
    user = await UserModel.findOne({
      username: username
    });

    if (!user) {
      throw new GraphQLError(`User ${username} not found`, null, null, null, null, {
        extensions: {
          code: "INTERNAL_ERROR"
        }
      });
    } else {
      if (!user.isAdmin) {
        throw new GraphQLError(`User ${username} is not and admin`, null, null, null, null, {
          extensions: {
            code: "UNAUTHORIZED"
          }
        });
      }
    }
  }
}

var retrieveUsers = async function({
  page,
  limit
}, context) {

  var usernamePetition = context.response.locals.user;

  //User authentication
  await adminAuthentication(usernamePetition);

  const options = {
    page: Math.min(100, page),
    limit: limit,
    collation: {
      locale: 'en'
    }
  };

  var ret = await UserModel.paginate({}, options, function(err, result) {
    return result.docs;
  });

  return ret;
}

var updateUserStatus = async function({
  username,
  status
}, context) {
  var usernamePetition = context.response.locals.user;

  //User authentication
  await adminAuthentication(usernamePetition);

  tokenModel.deleteMany({
    'user.username': username
  }, function(err) {
    if (err) logger.error(err);
  });

  return new Promise((resolve, reject) => {
    UserModel.findOneAndUpdate({
        username: username
      }, {
        $set: {
          status: status
        }
      }, {
        new: true
      })
      .then((doc) => {
        resolve(doc);
      })
      .catch((err) => {
        logger.error(err);
        reject(new GraphQLError(`Can not update this field.`, null, null, null, null, {
          extensions: {
            code: "UPDATE_FAILED",
          }
        }));
      });
  });
}

var retrieveMetrics = async function({}, context) {
  var usernamePetition = context.response.locals.user;

  //User authentication
  await adminAuthentication(usernamePetition);

  numUsers = await UserModel.countDocuments({}, function(err, count) {
    return count;
  })

  var actualDate = new Date();
  activeUsers = await TokenModel.countDocuments({
    accessTokenExpiresAt: {
      $gt: actualDate
    }
  }, function(err, count) {
    return count;
  })

  numFeeds = await FeedModel.countDocuments({}, function(err, count) {
    return count;
  })

  activities = await ActivityModel.find({}, function(err, count) {
    return count;
  })

  var metric = {
    users: numUsers,
    activeUsers: activeUsers,
    feeds: numFeeds,
    activities: []
  }

  var groupedData = _.groupBy(activities, f => {
    return f.action
  });

  Object.keys(groupedData).forEach(function(key) {
    var o = {
      type: key,
      count: groupedData[key].length
    }
    metric.activities.push(o);
  })


  return metric;

}

module.exports = {
  retrieveUsers: retrieveUsers,
  updateUserStatus: updateUserStatus,
  retrieveMetrics: retrieveMetrics
};
