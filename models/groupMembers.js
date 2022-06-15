module.exports = function (sequelize, Sequelize) {
  var GroupMember = sequelize.define("groupMembers", {
    id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
    gameId: { type: Sequelize.INTEGER },
    gmId: { type: Sequelize.INTEGER },
    characterId: { type: Sequelize.INTEGER },
    groupId: { type: Sequelize.INTEGER },
    quantity: { type: Sequelize.INTEGER, defaultValue: 1 },
  });

  return GroupMember;
};
