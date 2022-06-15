"use strict";

var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var env = process.env.NODE_ENV || "development";
var config = require(path.join(__dirname, "..", "config.json"))[env];
var sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);
var db = {};

db.init = (cb) => {
  sequelize
    .query(
      "CREATE DATABASE IF NOT EXISTS `" + config.database.toUpperCase() + "`;"
    )
    .catch((error) => {
      console.log(error);
    })
    .then((err, res) => {
      fs.readdirSync(__dirname)
        .filter((file) => {
          return file.indexOf(".") !== 0 && file !== "index.js";
        })
        .forEach((file) => {
          const model = require(path.join(__dirname, file))(
            sequelize,
            Sequelize.DataTypes
          );
          db[model.name] = model;
        });

      Object.keys(db).forEach((modelName) => {
        if ("associate" in db[modelName]) {
          db[modelName].associate(db);
        }
      });
      sequelize
        .sync()
        .catch((error) => {
          console.log(error);
        })
        .then(() => {
          cb();
        });
    });
};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
