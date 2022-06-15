module.exports = function (sequelize, Sequelize) {
  var Event = sequelize.define(
    "events",
    {
      id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      gameId: { type: Sequelize.INTEGER },
      name: { type: Sequelize.STRING },
      gmId: { type: Sequelize.INTEGER },
      localeX: { type: Sequelize.INTEGER, defaultValue: -1 },
      localeY: { type: Sequelize.INTEGER, defaultValue: -1 },
      localeId: { type: Sequelize.INTEGER, defaultValue: -1 },
      visible: { type: Sequelize.BOOLEAN, defaultValue: true },
    }
  );

  return Event;
};
