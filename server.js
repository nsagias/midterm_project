// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));



app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));
app.use(express.static("images"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const widgetsRoutes = require("./routes/widgets");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/cars", (req, res) => {

  res.render("car_index");
});

app.get("/cars/:user_id", (req, res) => {

  res.render("car_index");
});

app.get("/show/:car_id", (req, res) => {
  res.render("car_show")
});

// favourite feature related route
app.get("/favourites", (req, res) => {

});


// messages feature related route
app.post("/messages", (req, res) => {

});

// messages feature related route
app.get("/messages", (req, res) => {

});

// favourite feature related route
app.post("/favourites", (req, res) => {

});

// Display form to add a new car
app.get("/new", (req, res) => {
  res.render("car_new")
});


// Recieve new car form submission and send to db
app.post("/new", (req, res) => {
  //I'm decaring the function inside the route to keep everything together
  const addCar = function (car) {
    const queryParams = [car.seller_id, car.title, car.descriptions, car.year, car.make, car.model, car.model_colour, car.thumbnail_url, car.cover_url, car.car_price * 100];
    const queryString = `
    INSERT INTO cars (seller_id, title, descriptions, year, make, model, model_colour, thumbnail_url, cover_url, car_price)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *;
    `;

    return db
      .query(queryString, queryParams);

  };

  const newListing = addCar(req.body)

  newListing
    .then(() => {
      res.redirect("/new");
    })

});


// LOGIN STRETCH
// app.get("/login", (req, res) => {
//   res.render("login")
// });

// REGISTRATION STREACH
// app.get("/register", (req, res) => {
//   res.render("register")
// });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
