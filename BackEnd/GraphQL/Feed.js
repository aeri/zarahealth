const {
  GraphQLError
} = require('graphql')
const mongoosePaginate = require('mongoose-paginate-v2')
var FeedModel = require('../mongo/model/feed.js');
var ImageModel = require('../mongo/model/image.js');
var logger = require('../logger.js');

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

var submitFeed = async function({
  title,
  body,
  pictures
}, context) {

    var usernamePetition = context.response.locals.user;

    //User authentication
    authentication(usernamePetition);

    await pictures;

    var images = []

    if (pictures) {
        for (var i = 0; i < pictures.length; i++) {
            const { filename, mimetype, encoding, createReadStream } = await pictures[i];
            let stream = createReadStream();

            var chunks = []
            var result = await new Promise((resolve, reject) => {
                stream.on('data', chunk => chunks.push(chunk))
                stream.on('error', reject)
                stream.on('end', () => resolve(Buffer.concat(chunks)))
            });

            var imageSave = new ImageModel({
                data: result,
                filename: filename,
                mimetype: mimetype
            });

            images.push(imageSave);
        }
    } 

    var feed = new FeedModel({
        title: title,
        author: usernamePetition,
        body: body,
        pictures: images        
    });

    feed.save(function(err, doc) {
        if (err) {
            logger.error(err);
        return console.error(err);
        }
    logger.info("Feed inserted successfully!");
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

    var filter = {
        _id: id
    };

    var update = {
        $pull: { 'meta.likes' : usernamePetition }
    };

    await FeedModel.findOneAndUpdate(filter, update);

    update = {
        $pull: { 'meta.dislikes': usernamePetition }
    };

    await FeedModel.findOneAndUpdate(filter, update);

    if (status == "LIKE") {
        update = {
            $push: { 'meta.likes': usernamePetition }
        };
    }
    else {
        update = {
            $push: { 'meta.dislikes': usernamePetition }
        };
    }

    
    
    return new Promise((resolve, reject) => {
        FeedModel.findOneAndUpdate(filter, update, {
            new: true
        }).then((doc) => {
            doc.likes = doc.meta.likes.length;
            doc.dislikes = doc.meta.dislikes.length;
            doc.status = decodeStatus(doc.meta, usernamePetition);
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


var submitComment = async function({
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
