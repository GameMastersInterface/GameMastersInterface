module.exports = function (sequelize, Sequelize) {
  var Character = sequelize.define("characters", {
    id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
    gameId: { type: Sequelize.INTEGER, defaultValue: -1 },
    userId: { type: Sequelize.INTEGER, defaultValue: -1 },
    gmId: { type: Sequelize.INTEGER },
    name: { type: Sequelize.STRING },
    category: { type: Sequelize.STRING },
    localeX: { type: Sequelize.INTEGER, defaultValue: -1 },
    localeY: { type: Sequelize.INTEGER, defaultValue: -1 },
    localeId: { type: Sequelize.INTEGER, defaultValue: -1 },
    visible: { type: Sequelize.BOOLEAN, defaultValue: true },
    unique: { type: Sequelize.BOOLEAN, defaultValue: true },
    hp: { type: Sequelize.INTEGER, defaultValue: 1 },
    maxHp: { type: Sequelize.INTEGER, defaultValue: 1 },
  });
  return Character;
};
