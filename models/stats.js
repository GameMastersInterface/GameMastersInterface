module.exports = function (sequelize, Sequelize) {
  var Stat = sequelize.define("stats", {
    id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
    gameId: { type: Sequelize.INTEGER },
    gmId: { type: Sequelize.INTEGER },
    itemId: { type: Sequelize.INTEGER },
    name: { type: Sequelize.STRING },
    value: { type: Sequelize.STRING },
  });

  return Stat;
};
