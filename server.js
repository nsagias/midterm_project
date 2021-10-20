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
const { Template } = require("ejs");

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


// get all cars function 
const getAllCars = function(req, resp) {
  const sql = `
      SELECT *
      FROM cars
      WHERE delete_date is NULL
      `;
  db.query(sql, (error, res) => {
      let templateVars = {};
      if (error) {
          throw error;
      }
      let result = {}; 
      cars = [...res.rows];

      for(let i = 0; i < cars.length; i++) {
        // '0': {'thumb':url/}
        result[i] = cars[i]
      }
      console.log('cars:', result);

      templateVars = {
        cars: result
      };

      // console.log(templateVars);
      resp.render("car_index", {templateVars})
  })
};


app.get("/cars", getAllCars);


app.get("/cars/:user_id", (req, res) => {

  res.render("car_index");
});
//function for get the car details by id
const getCardetailsByid=(id)=>{
  const sql=`SELECT  descriptions,cover_url FROM cars WHERE id=$1`;
  //converts the string to number
  const values=[Number(id)];
  return db.query(sql,values)
  .then((res)=>{
   return res.rows[0];
  })
  .catch(err=>err)
}
app.get("/show/:car_id", (req, res) => {
  const carID=req.params.car_id;
  //console.log(carID)
  getCardetailsByid(carID)
  .then((data)=>{
    console.log(data)
    const templateVars={data}
    res.render("car_show",templateVars)
  })
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
  console.log(`App listening on port ${PORT}`);
});
