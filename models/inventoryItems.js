module.exports = function (sequelize, Sequelize) {
  var InventoryItem = sequelize.define("inventoryItems", {
    id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
    gameId: { type: Sequelize.INTEGER },
    gmId: { type: Sequelize.INTEGER },
    ownerType: { type: Sequelize.STRING },
    ownerId: { type: Sequelize.INTEGER },
    itemId: { type: Sequelize.INTEGER },
    quantity: { type: Sequelize.INTEGER },
  });

  return InventoryItem;
};
