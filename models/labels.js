module.exports = function (sequelize, Sequelize) {
  var Log = sequelize.define(
    "labels",
    {
      id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      gmId: { type: Sequelize.INTEGER },
      localeId: { type: Sequelize.INTEGER },
      name: { type: Sequelize.STRING },
    }
  );

  return Log;
};
