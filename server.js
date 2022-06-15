const express = require("express");
const bodyParser = require("body-parser");
const db = require("./models");
const routes = require("./routes");
const path = require("path");
var env = require("dotenv").config();
const port = 3001;

const app = express();

app.use(bodyParser.json({ limit: "20mb" }));
app.use(bodyParser.urlencoded({ limit: "20mb", extended: true }));

app.use(express.static(__dirname + "/public"));
//app.route("/").get((req, res) => {
//  res.sendFile(path.join(__dirname, "public","index.html"));
//});

routes(app);

db.init(() => {
  app.listen(port, () => {
    console.log("We're up and running! Port " + port);
  });
});
