module.exports = function (sequelize, Sequelize) {
  var Combatant = sequelize.define("combatants", {
    id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
    gameId: { type: Sequelize.INTEGER, defaultValue: -1 },
    gmId: { type: Sequelize.INTEGER, defaultValue: -1 },
    fieldOwnerType: { type: Sequelize.STRING },
    fieldOwnerId: { type: Sequelize.INTEGER, defaultValue: -1 },
    characterId: { type: Sequelize.INTEGER, defaultValue: -1 },
    memberId: { type: Sequelize.INTEGER, defaultValue: -1 },
    name: { type: Sequelize.STRING },
    fieldX: { type: Sequelize.INTEGER, defaultValue: 48 },
    fieldY: { type: Sequelize.INTEGER, defaultValue: 64 },
    visible: { type: Sequelize.BOOLEAN, defaultValue: true },
    hp: { type: Sequelize.INTEGER, defaultValue: 10 },
    maxHp: { type: Sequelize.INTEGER, defaultValue: 10 },
  });
  return Combatant;
};
