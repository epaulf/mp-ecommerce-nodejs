var express = require("express");
var exphbs = require("express-handlebars");
var id = "";
var app = express();

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.get("/", function (req, res) {
  res.render("home", { id: id });
});

app.get("/failure", function (req, res) {
  res.render("failure");
});

app.get("/success", function (req, res) {
  res.render("success");
});

app.get("/pending", function (req, res) {
  res.render("pending");
});

app.get("/detail", function (req, res) {
  console.log(req.query);
  // SDK de Mercado Pago
  const mercadopago = require("mercadopago");
  // Agrega credenciales
  mercadopago.configure({
    integrator_id: "dev_24c65fb163bf11ea96500242ac130004",
    access_token:
      "APP_USR-1159009372558727-072921-8d0b9980c7494985a5abd19fbe921a3d-617633181",
  });

  // Crea un objeto de preferencia
  let preference = {
    back_urls: {
      success: "https://epaulf-mp-commerce-nodejs.herokuapp.com/success",
      failure: "https://epaulf-mp-commerce-nodejs.herokuapp.com/failure",
      pending: "https://epaulf-mp-commerce-nodejs.herokuapp.com/pending",
    },
    auto_return: "approved",
    external_reference: "1234656789102020",
    items: [
      {
        title: req.query.title,
        unit_price: parseInt(req.query.price),
        quantity: parseInt(req.query.unit),
      },
    ],
  };

  mercadopago.preferences
    .create(preference)
    .then(function (response) {
      // Este valor reemplazará el string "<%= global.id %>" en tu HTML
      ///console.log("si");
      //console.log(response.body.id);
      id = response.body.id;
      res.render("detail", { query: req.query, id: id });
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.use(express.static("assets"));

app.use("/assets", express.static(__dirname + "/assets"));

app.listen(process.env.PORT || 3000);
