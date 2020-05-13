const {
  GraphQLError
} = require('graphql')
const mongoosePaginate = require('mongoose-paginate-v2')
var FeedModel = require('../mongo/model/feed.js');
var ImageModel = require('../mongo/model/image.js');

//Function to authenticate user
function authentication(username) {
  if (!username) {
    throw new GraphQLError(`This query needs user authorization`, null, null, null, null, {
      extensions: {
        code: "UNAUTHORIZED",
      }
    })
  }
}

function decodeStatus(meta, user) {
  if (meta.likes.includes(user)) {
    return "LIKE"
  } else if (meta.dislikes.includes(user)) {
    return "DISLIKE"
  } else {
    return null
  }

}

var submitFeed = function({
  title,
  body,
  pictures
}, context) {

  var usernamePetition = context.response.locals.user;

  //User authentication
  authentication(usernamePetition);

  var feed = new FeedModel({
    title: title,
    author: usernamePetition,
    body: body
  });

  feed.save(function(err, doc) {
    if (err) return console.error(err);
    console.log("Feed inserted succussfully!");
  });

  feed.likes = 0,
  feed.dislikes = 0;


  return feed;
}

var retrieveFeeds = async function({
  page,
  limit
}, context) {

  var usernamePetition = context.response.locals.user;

  //User authentication
  authentication(usernamePetition);

  const options = {
    page: Math.min(100, page),
    limit: limit,
    collation: {
      locale: 'en'
    }
  };

  var ret = await FeedModel.paginate({}, options, function(err, result) {
    return result.docs;
  });

  var o = [];

  ret.forEach(function(key) {
      key.likes = key.meta.likes.length,
      key.dislikes = key.meta.dislikes.length,
      key.status = decodeStatus(key.meta, usernamePetition);
  })

  return ret;
}

var toggleFeedOpinion = async function({
  id,
  status
}, context) {

  var usernamePetition = context.response.locals.user;

  //User authentication
  authentication(usernamePetition);

  var metaId;
  if (status == "LIKE"){
    metaId = `meta.likes`;
  }
  else {
    metaId = `meta.dislikes`;
  }

  console.log(metaId)

  const filter = {
    _id: id
  };
  const update = {
    $push: { metaId : usernamePetition }
  };

  // `doc` is the document _after_ `update` was applied because of
  // `new: true`
  let doc = await FeedModel.findOneAndUpdate(filter, update, {
    new: true
  });



}


submitComment = async function({
  id,
  body
}, context) {

  var usernamePetition = context.response.locals.user;

  //User authentication
  authentication(usernamePetition);

  var comment = {
    author: usernamePetition,
    body: body
  }

  const filter = {
    _id: id
  };
  const update = {
    $push: { "comments" : comment }
  };

  // `doc` is the document _after_ `update` was applied because of
  // `new: true`
  let doc = await FeedModel.findOneAndUpdate(filter, update, {
    new: true
  });

  doc.likes = doc.meta.likes.length,
  doc.dislikes = doc.meta.dislikes.length,
  doc.status = decodeStatus(doc.meta, usernamePetition);

  return doc;




}

module.exports = {
  submitFeed: submitFeed,
  retrieveFeeds: retrieveFeeds,
  toggleFeedOpinion: toggleFeedOpinion,
  submitComment: submitComment
};
