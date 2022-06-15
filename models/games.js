module.exports = function (sequelize, Sequelize) {
  var Game = sequelize.define(
    "games",
    {
      id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      gmId: { type: Sequelize.INTEGER, defaultValue: -1 },
      name: { type: Sequelize.STRING },
    }
  );
  return Game;
};
