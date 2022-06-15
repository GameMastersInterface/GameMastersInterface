const db = require("../models");

module.exports = {
  create: function (req, res) {
    delete req.query.id;
    req.query.gmId = 1;
    db.labels
      .create(req.query)
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        console.log(error);
        res.json(error);
      });
  },

  read: function (req, res) {
    req.query.gmId = 1;
    db.labels
      .findAll({ where: req.query })
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
    db.labels
      .update(req.body, { where: req.query })
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        console.log(error);
        res.json(error);
      });
  },

  delete: function (req, res) {
    req.query.gmId = 1;
    db.labels
      .destroy({ where: req.query })
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        console.log(error);
        res.json(error);
      });
  },
};
