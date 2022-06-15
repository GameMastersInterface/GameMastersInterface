module.exports = function (sequelize, Sequelize) {
  var User = sequelize.define(
    "users",
    {
      id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      name: { type: Sequelize.STRING },
      email: { type: Sequelize.STRING },
      password: { type: Sequelize.STRING },
      status: {
        type: Sequelize.ENUM("active", "inactive"),
        defaultValue: "active",
      },
    }
  );
  return User;
};
