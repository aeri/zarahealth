var mongoose = require('mongoose');
var logger = require('./logger.js');
var UserModel = require('./mongo/model/user.js');
var FeedModel = require('./mongo/model/feed.js');
var ObjectId = require('mongoose').Types.ObjectId;
var stream = require('stream');
var lodash = require('lodash')

async function pictures(req, res) {
  var type = req.query.type; // $_GET["type"]
  var id = req.query.id; // $_GET["id"]
  var username = req.query.username; // $_GET["id"]
  var execute = true;

  if (ObjectId.isValid(id) || username ) {

    switch (type) {
      case "username":
        var ret = await UserModel.findOne({
          username: username
        });

        if (!ret){
          res.status(404)
          res.end("NOT_FOUND")
          execute = false;
        }
        else if (!ret.image){
          res.redirect("https://i.ibb.co/G5VNNXd/default-user.jpg")
          execute = false;
        }
        else{
          var pthg = ret.image;
        }
        break;

      case "user":
        var ret = await UserModel.findOne({
          "image._id": ObjectId(id)
        });

        if (!ret){
          res.status(404)
          res.end("NOT_FOUND")
          execute = false;
        }
        else{
          var pthg = ret.image;
        }
        break;

      case "feed":
        var ret = await FeedModel.findOne({'pictures': {$elemMatch: {_id: id}}}).select('pictures');
        if (!ret){
          res.status(404)
          res.end("NOT_FOUND")
          execute = false;
        }
        else{
        var picked = lodash.filter(ret.pictures, x => x._id == id);
        var pthg = picked[0]
      }
        break;

      default:
        res.status(400)
        res.end("INVALID_TYPE")
        execute = false;
        break;
    }

    if (execute) {

      var img = Buffer.from(pthg.data.buffer, 'binary');
      var mimetype = pthg.mimetype;

      res.writeHead(200, {
        'Content-Type': mimetype,
        //'Content-disposition': 'attachment;filename=' + ret.image.filename,
        'Content-Length': img.length
      });
      res.end(img)

    }
  } else {
    res.status(400)
    res.send("INVALID_OID")
  }


}

module.exports = {
  pictures: pictures
};
