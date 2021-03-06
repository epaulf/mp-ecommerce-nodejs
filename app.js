var express = require("express");
var exphbs = require("express-handlebars");
var id = "";
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.get("/", function (req, res) {
  res.render("home", { id: id });
});

app.get("/failure", function (req, res) {
  res.render("failure");
});

app.get("/success", function (req, res) {
  console.log(req.query);
  payment_method_id = req.query.payment_type;
  external_reference = req.query.external_reference;
  payment_id = req.query.collection_id;
  res.render("success", { payment_method_id, external_reference, payment_id });
});

app.get("/pending", function (req, res) {
  res.render("pending");
});

app.get("/detail", function (req, res) {
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
    items: [
      {
        id: "1234",
        title: req.query.title,
        description: "Dispositivo móvil de Tienda e-commerce",
        picture_url:
          "https://epaulf-mp-commerce-nodejs.herokuapp.com/" +
          req.query.img.substring(1),
        quantity: parseInt(req.query.unit),
        unit_price: parseInt(req.query.price),
        external_reference: "ericpaulflorese@gmail.com",
      },
    ],
    external_reference: "ericpaulflorese@gmail.com",
    payer: {
      name: "Lalo",
      surname: "Landa",
      email: "test_user_58295862@testuser.com",
      phone: {
        area_code: "52",
        number: 5549737300,
      },
      address: {
        street_name: "Insurgentes Sur",
        street_number: 1602,
        zip_code: "03940",
      },
    },
    payment_methods: {
      excluded_payment_methods: [{ id: "amex" }],
      excluded_payment_types: [{ id: "atm" }],
      installments: 6,
      default_installments: 6,
    },
    back_urls: {
      success: "https://epaulf-mp-commerce-nodejs.herokuapp.com/success",
      failure: "https://epaulf-mp-commerce-nodejs.herokuapp.com/failure",
      pending: "https://epaulf-mp-commerce-nodejs.herokuapp.com/pending",
    },
    notification_url: "https://epaulf-mp-commerce-nodejs.herokuapp.com/webhook",
    auto_return: "approved",
  };

  mercadopago.preferences
    .create(preference)
    .then(function (response) {
      // Este valor reemplazará el string "<%= global.id %>" en tu HTML
      init_point = response.response.init_point;
      id = response.body.id;
      res.render("detail", {
        query: req.query,
        id: id,
        init_point: init_point,
      });
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.post("/webhook", function (req, res) {
  console.log("MENSAJE :", req.body);
  console.log(req.query);
  res.status(200).json("OK");
});

app.use(express.static("assets"));

app.use("/assets", express.static(__dirname + "/assets"));

app.listen(process.env.PORT || 3000);
