const fs = require("fs");
const sharp = require("sharp");

module.exports = {
  upload: function (req, res) {
    delete base64Data;
    delete fileStr;
    delete imgBuffer;
    var marker = req.body[req.query.category];
    var base64Data = marker.substring(22); // req.body.marker.split(" ").join("+");
    var fileStr =
      req.query.game +
      "_" +
      req.query.type +
      "_" +
      req.query.id +
      "_" +
      req.query.category;
    var imgBuffer = Buffer.from(base64Data, "base64");
    sharp.cache(false);
    fs.writeFile(
      "public/images/" + fileStr + ".png",
      base64Data,
      "base64",
      function (err) {
        if (!err) {
          res.json("Upload Sucessful!");
        } else {
          res.json(err);
        }
      }
    );
  },
};
