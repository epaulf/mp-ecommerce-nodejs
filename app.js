var express = require("express");
var exphbs = require("express-handlebars");
var port = process.env.PORT || 8080;
var app = express();
app.set("port", port);
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/detail", function (req, res) {
  res.render("detail", req.query);
});

app.use(express.static("assets"));

app.use("/assets", express.static(__dirname + "/assets"));

//app.listen(3000);
