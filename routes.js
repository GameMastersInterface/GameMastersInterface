const controller = require("./controllers");
const cors = require("cors");

const routes = function (app) {
  app.use(cors({ origin: "http://localhost:3000" }));
  [
    "characters",
    "groups",
    "groupMembers",
    "locales",
    "events",
    "logs",
    "games",
    "upload",
    "labels",
    "combatants",
    "inventoryItems",
    "nativeItems",
    "stats"
  ].forEach((type) => {
    if (type === "upload") {
      app.route("/upload").post((req, res) => {
        controller[type].upload(req, res);
      });
    } else {
      app.route("/" + type + "/create").post((req, res) => {
        controller[type].create(req, res);
      });
      app
        .route("/" + type)
        .get((req, res) => {
          controller[type].read(req, res);
        })
        .post((req, res) => {
          console.log(req.query)
          console.log(req.body)
          controller[type].update(req, res);
        })
        .delete((req, res) => {
          controller[type].delete(req, res);
        });
    }
  });
};

module.exports = routes;
