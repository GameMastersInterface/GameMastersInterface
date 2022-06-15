const db = require("../models");

module.exports = {
  create: function (req, res) {
    delete req.query.id;
    req.query.gmId = 1;
    db.groups
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
    db.groups
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
    db.groups
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
    db.groups.destroy({ where: req.query }).then((data) => {
      db.groupMembers
        .update(
          { groupId: -1 },
          { where: { groupId: req.query.id, quantity: -1 } }
        )
        .then(() => {
          db.groupMembers
            .destroy({ where: { groupId: req.query.id } })
            .then(() => {
              db.logs
                .destroy({ where: { groupId: req.query.id } })
                .then(() => {
                  res.json(data);
                });
            });
        });
    });
  },
};
