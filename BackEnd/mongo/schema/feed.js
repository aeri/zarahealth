var image = require('./image.js');
module.exports = {
    title:  String,
    author: String,
    body:   String,
    comments: [{ author: String, body: String, date: { type: Date, default: Date.now } }],
    date: { type: Date, default: Date.now },
    hidden: Boolean,
    pictures: [image],
    meta: {
      likes: [String],
      dislikes:  [String]
    }
};
