const db = require("../models");
const Op = require("sequelize").Op;
module.exports = {
  create: function (req, res) {
    delete req.query.id;
    req.query.gmId = 1;
    db.nativeItems
      .create(req.query)
      .then((data) => {
        db.inventoryItems
          .create({
            ...req.query,
            quantity: -1,
            itemId: data.id,
            ownerId: -1,
            ownerType: "None",
          })
          .then((data) => {
            res.json(data);
          })
          .catch((error) => {
            console.log(error);
            res.json(error);
          });
      })
      .catch((error) => {
        console.log(error);
        res.json(error);
      });
  },

  read: function (req, res) {
    req.query.gmId = 1;
    db.nativeItems
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
    if (typeof req.body.unique !== "undefined") {
      if (req.body.unique) {
        db.nativeItems
          .update(req.body, { where: req.query })
          .then((data) => {
            db.inventoryItems
              .destroy({
                where: { itemId: req.query.id, quantity: { [Op.ne]: -1 } },
              })
              .then(() => {
                res.json(data);
              })
              .catch((error) => {
                console.log(error);
                res.json(error);
              });
          })
          .catch((error) => {
            console.log(error);
            res.json(error);
          });
      } else {
        db.nativeItems
          .update(req.body, { where: req.query })
          .then((data) => {
            db.inventoryItems
              .update({ ownerId: -1 }, { where: { itemId: req.query.id } })
              .then(() => {
                res.json(data);
              })
              .catch((error) => {
                console.log(error);
                res.json(error);
              });
          })
          .catch((error) => {
            console.log(error);
            res.json(error);
          });
      }
    } else {
      db.nativeItems
        .update(req.body, { where: req.query })
        .then((data) => {
          res.json(data);
        })
        .catch((error) => {
          console.log(error);
          res.json(error);
        });
    }
  },

  delete: function (req, res) {
    req.query.gmId = 1;
    db.nativeItems.destroy({ where: req.query }).then((data) => {
      res.json(data);
    });
  },
};
