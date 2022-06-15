module.exports = function (sequelize, Sequelize) {
  var Group = sequelize.define(
    "groups",
    {
      id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      gameId: { type: Sequelize.INTEGER },
      gmId: { type: Sequelize.INTEGER },
      name: { type: Sequelize.STRING },
      localeX: { type: Sequelize.INTEGER, defaultValue: -1 },
      localeY: { type: Sequelize.INTEGER, defaultValue: -1 },
      localeId: { type: Sequelize.INTEGER, defaultValue: -1 },
      visible: { type: Sequelize.BOOLEAN, defaultValue: true },
    }
  );

  return Group;
};
