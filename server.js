// server.js - the initial starting point for spacemongo server.

// *** Dependencies
// ================================================================================
var env = require('dotenv').config();
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/spacemongo";
var SCRAPE_URI = process.env.SCRAPE_URI || "https://www.space.com/science-astronomy";
var PORT = process.env.PORT || 8080;
var express = require("express");

// *** Express
// ================================================================================
var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.set('views', './views');

// *** HandleBars
// ================================================================================
app.set('view engine', '.handlebars');
app.engine('handlebars', require("express-handlebars")({
    extname: '.handlebars',
    defaultLayout: "main"
}));
 
// *** Database
// ================================================================================
var db = require("./models/db").connect(MONGODB_URI);

// *** Routes
// ================================================================================
var router = express.Router();
require("./controllers/scrapecontroller")(SCRAPE_URI, app, router, db);
app.use(router);

app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});