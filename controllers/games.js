const db = require("../models");

module.exports = {
  create: function (req, res) {
    delete req.query.id;
    req.query.gmId = 1;
    db.games
      .create(req.query)
      .then((data) => {
        db.locales
          .create({
            name: "Overworld Map",
            overworld: true,
            gameId: data.id,
            gmId: req.query.gmId,
          })
          .then(() => {
            res.json(data);
          });
      })
      .catch((error) => {
        console.log(error);
        res.json(error);
      });
  },

  read: function (req, res) {
    req.query.gmId = 1;
    console.log(req.query)
    db.games
      .findAll({
        where: req.query,
      })
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        console.log(error);
        res.json(error);
      });
  },

  update: function (req, res) {
    req.query.gmId = 1;
    db.games
      .update(req.body, { where: req.query })
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        console.log(error);
        res.json(error);
      });
  },
};
