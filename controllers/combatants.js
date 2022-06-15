const db = require("../models");

module.exports = {
  create: function (req, res) {
    delete req.query.id;
    req.query.gmId = 1;
    db.combatants
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
    db.combatants
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
    if (typeof req.body.hp !== "undefined") {
      db.combatants
        .update({ hp: req.body.hp }, { where: req.query })
        .then((data) => {
          db.combatants
            .findAll({ where: { id: req.query.id } })
            .then((data_) => {
              combatant = data_[0].dataValues
              db.characters
                .update(
                  { hp: req.body.hp },
                  { where: { id: combatant.characterId, unique: true } }
                )
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
        })
        .catch((error) => {
          console.log(error);
          res.json(error);
        });
    } else {
      db.combatants
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
    db.combatants.destroy({ where: req.query }).then((data) => {
      res.json(data);
    });
  },
};
