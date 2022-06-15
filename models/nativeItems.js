module.exports = function (sequelize, Sequelize) {
  var NativeItem = sequelize.define("nativeItems", {
    id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
    gameId: { type: Sequelize.INTEGER },
    gmId: { type: Sequelize.INTEGER },
    name: { type: Sequelize.STRING(5000) },
    unique: { type: Sequelize.BOOLEAN, defaultValue: true },
    notes: { type: Sequelize.STRING },
  });
  return NativeItem;
};
