module.exports = function (sequelize, Sequelize) {
  var Log = sequelize.define(
    "logs",
    {
      id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      characterId: { type: Sequelize.INTEGER },
      groupId: { type: Sequelize.INTEGER },
      localeId: { type: Sequelize.INTEGER },
      eventId: { type: Sequelize.INTEGER },
      gmId: { type: Sequelize.INTEGER },
      content: { type: Sequelize.STRING },
    }
  );

  return Log;
};
