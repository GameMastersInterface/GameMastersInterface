const db = require("../models");

module.exports = {
  create: function (req, res) {
    delete req.query.id;
    req.query.gmId = 1;
    db.characters
      .create(req.query)
      .then((data) => {
        db.groupMembers
          .create({
            characterId: data.id,
            gameId: req.query.gameId,
            gmId: req.query.gmId,
            groupId: -1,
            quantity: -1,
          })
          .then(() => {
            db.combatants
              .create({
                characterId: data.id,
                gameId: req.query.gameId,
                gmId: req.query.gmId,
                name: data.name,
              })
              .then(() => {
                res.json(data);
              });
          });
      })
      .catch((error) => {
        console.log(error);
        res.json(error);
      });
  },

  read: function (req, res) {
    req.query.gmId = 1;
    db.characters
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
    if (typeof req.body.name !== "undefined") {
      db.characters
        .update(req.body, { where: req.query })
        .then((data) => {
          db.combatants
            .update(req.body, {
              where: { characterId: req.query.id },
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
    } else if (typeof req.body.unique !== "undefined") {
      if (req.body.unique) {
        db.characters
          .update(req.body, { where: req.query })
          .then((data) => {
            db.groupMembers
              .destroy({
                where: { characterId: req.query.id },
              })
              .then(() => {
                db.combatants
                  .destroy({
                    where: { characterId: req.query.id },
                  })
                  .then(() => {
                    db.groupMembers
                      .create({
                        characterId: req.query.id,
                        gameId: req.query.gameId,
                        gmId: req.query.gmId,
                        groupId: -1,
                        quantity: -1,
                      })
                      .then(() => {
                        res.json(data);
                      })
                      .catch((error) => {
                        console.log(error);
                        res.json(error);
                      });
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
        db.characters
          .findByPk(req.query.id)
          .then((character) => {
            db.characters
              .update(
                { ...req.body, hp: character.maxHp },
                { where: req.query }
              )
              .then((data) => {
                db.groupMembers
                  .update(
                    { groupId: -1 },
                    { where: { characterId: req.query.id } }
                  )
                  .then(() => {
                    db.combatants
                      .destroy({
                        where: { characterId: req.query.id },
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
    } else if (typeof req.body.hp !== "undefined") {
      db.characters
        .findByPk(req.query.id)
        .then((character) => {
          if (character.unique) {
            db.characters
              .update(req.body, { where: req.query })
              .then((data) => {
                db.combatants
                  .update(
                    { hp: req.body.hp },
                    { where: { characterId: req.query.id } }
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
          } else {
            res.json("character is not unique");
          }
        })
        .catch((error) => {
          console.log(error);
          res.json(error);
        });
    } else if (typeof req.body.maxHp !== "undefined") {
      db.characters
        .update(req.body, { where: req.query })
        .then((data) => {
          db.combatants
            .update(
              { maxHp: req.body.maxHp },
              { where: { characterId: req.query.id } }
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
    } else {
      db.characters
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
    db.characters
      .destroy({
        where: { id: req.query.id },
      })
      .then(() => {
        db.groupMembers
          .destroy({
            where: { characterId: req.query.id },
          })
          .then(() => {
            db.combatants
              .destroy({
                where: { characterId: req.query.id },
              })
              .then(() => {
                res.json("deleted");
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
      });
  },
};
