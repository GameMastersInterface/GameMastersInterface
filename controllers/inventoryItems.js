const db = require("../models");

module.exports = {
  create: function (req, res) {
    delete req.query.id;
    req.query.gmId = 1;
    db.inventoryItems
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
    db.inventoryItems
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
    if (typeof req.body.quantity !== "undefined") {
      if (req.body.quantity > 0) {
        db.inventoryItems
          .update({ quantity: req.body.quantity }, { where: req.query })
          .then((data) => {
            res.json(data);
          })
          .catch((error) => {
            console.log(error);
            res.json(error);
          });
      } else {
        db.inventoryItems
          .destroy({ where: { id: req.query.id } })
          .then((data) => {
            res.json(data);
          })
          .catch((error) => {
            console.log(error);
            res.json(error);
          });
      }
    } else {
      db.inventoryItems.update(req.body, { where: req.query }).then((data) => {
        res.json(data);
      });
    }
  },

  delete: function (req, res) {
    req.query.gmId = 1;
    db.inventoryItems.destroy({ where: req.query }).then((data) => {
      res.json(data);
    });
  },
};
