const fs = require("fs");
const path = require("path");

var controllers = {};
fs.readdirSync(__dirname).filter(function (f) {
    return (f.indexOf(".") !== 0) && (f !== "index.js");
}).forEach(function (f) {
    controllers[f.slice(0, -3)] = require(path.join(__dirname, f));
});
module.exports = controllers;