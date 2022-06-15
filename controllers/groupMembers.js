const db = require("../models");

module.exports = {
  create: function (req, res) {
    delete req.query.id;
    req.query.gmId = 1;
    db.groupMembers
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
    db.groupMembers
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
    if (typeof req.body.quantity !== "undefined") {
      if (req.body.quantity > 0) {
        db.groupMembers
          .update({ quantity: req.body.quantity }, { where: req.query })
          .then((data) => {
            db.combatants
              .count({ where: { memberId: req.query.id } })
              .then((combatantCount) => {
                db.groupMembers.findByPk(req.query.id).then((groupMember) => {
                  db.characters
                    .findByPk(groupMember.characterId)
                    .then((character) => {
                      console.log(character);
                      if (req.body.quantity > combatantCount) {
                        var completed = 0;
                        for (
                          var i = 0;
                          i < parseInt(req.body.quantity) - combatantCount;
                          i++
                        ) {
                          db.combatants
                            .create({
                              gameId: req.query.gameId,
                              gmId: req.query.gmId,
                              memberId: req.query.id,
                              fieldOwnerType: "groups",
                              fieldOwnerId: groupMember.groupId,
                              characterId: character.id,
                              name: character.name,
                              hp: character.maxHp,
                              maxHp: character.maxHp,
                            })
                            .then(() => {
                              completed += 1;
                              if (
                                completed ===
                                parseInt(req.body.quantity) - combatantCount
                              ) {
                                res.json(data);
                              }
                            });
                        }
                      } else if (req.body.quantity < combatantCount) {
                        db.combatants
                          .destroy({
                            where: {
                              memberId: req.query.id,
                            },
                            limit: combatantCount - parseInt(req.body.quantity),
                          })
                          .then(() => {
                            res.json(data);
                          })
                          .catch((error) => {
                            console.log(error);
                            res.json(error);
                          });
                      } else {
                        res.json(data);
                      }
                    })
                    .catch((error) => {
                      console.log(error);
                      res.json(error);
                    });
                });
              });
          })
          .catch((error) => {
            console.log(error);
            res.json(error);
          });
      } else {
        db.groupMembers
          .destroy({ where: { id: req.query.id } })
          .then(() => {
            db.combatants
              .destroy({ where: { memberId: req.query.id } })
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
      }
    } else if (typeof req.body.groupId !== "undefined") {
      if (req.body.groupId !== -1) {
        db.groupMembers
          .update({ groupId: req.body.groupId }, { where: req.query })
          .then((data) => {
            db.groupMembers
              .findAll({ where: { characterId: req.query.characterId } })
              .then((data_) => {
                groupMember = data_[0].dataValues;
                db.characters
                  .findByPk(groupMember.characterId)
                  .then((character) => {
                    db.combatants
                      .destroy({
                        where: { characterId: req.query.characterId },
                      })
                      .then(() => {
                        db.combatants
                          .create({
                            gameId: req.query.gameId,
                            gmId: req.query.gmId,
                            fieldOwnerType: "groups",
                            fieldOwnerId: groupMember.groupId,
                            characterId: character.id,
                            memberId: groupMember.id,
                            name: character.name,
                            hp: character.hp,
                            maxHp: character.maxHp,
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
          })
          .catch((error) => {
            console.log(error);
            res.json(error);
          });
      } else {
        db.groupMembers
          .update({ groupId: req.body.groupId }, { where: req.query })
          .then((data) => {
            db.combatants
              .destroy({ where: { characterId: req.query.characterId } })
              .then(() => {
                res.json(data);
              })
              .catch((error) => {
                console.log(error);
                res.json(error);
              });
          });
      }
    }
  },
};
