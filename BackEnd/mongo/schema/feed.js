var image = require('./image.js');
module.exports = {
    title:  String,
    author: String,
    body:   String,
    comments: [{ body: String, date: Date }],
    date: { type: Date, default: Date.now },
    hidden: Boolean,
    pictures: [image],
    meta: {
      likes: Number,
      dislikes:  Number
    }
};
