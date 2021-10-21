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
app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: ['the longer the better', 'two is betther than one'],
}));

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
  // user id for logged in lookup
  // const userId = req.session["userID"];

  // if (!userId) {
    
    
  // }

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
        result[i] = cars[i];
      }
      // console.log('cars:', result);

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

// "Delete" a record (really just add a delete date)
app.post("/delete", (req, res) => {
  const markDeleted = function (id) {
    const queryParams = [id];
    const queryString = `
    UPDATE cars
    SET delete_date = CURRENT_DATE
    WHERE id = $1
    ;`;

    return db
      .query(queryString, queryParams)
  }


  const deleted = markDeleted(req.body.id);
  deleted
    .then(() => res.render("car_new"));

});

// MARK SOLD - marks a specific car id as sold in the db
app.post("/sold", (req, res) => {
  const markSold = function (id) {
    const queryParams = [id];
    const queryString = `
    UPDATE cars
    SET sold = TRUE
    WHERE id = $1
    ;`;

    return db
      .query(queryString, queryParams)
  }

  const sold = markSold(req.body.id);
  sold
    .then(() => res.render("car_new"));
});



/***************************************
 * Login
 * GET /login
 * Renders the login form
 ***************************************/
 app.get('/login', (req, res) => {
  // get login page/form
  const templateVars = { user: null };
  res.render('login', templateVars);
});


/***************************************
 * Login
 * POST /login
 * Redirects to GET /urls
 ***************************************/
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  // check if email or password are empty strings

  // trim password and email
  // avoid duplicated and getting around check
  const emailT = email.trim();
  const passwordT = password.trim();

  if (emailT === '' || passwordT === '') {
   
    return res.status(400).redirect('/login');
  }
  // get users from database
  const usersDB = users;

  const findUserByEmail = (userEmail, usersDB) => {

    

    // CREATE ONE OBJECT FOR A USER PULL FROM DATABASE
    // MOVE ONE OBJECT THROUGH

    // select id, email, password, admin from users where email='apple@gmail.com';
    // 1 | apple@gmail.com | password | f
    
   
    for (let user in usersDB) {
      if (usersDB[user].email === userEmail) {
        return true;
      }
    }
    return undefined;
  };



   
  // check if is a current user
  const isCurrentUser = findUserByEmail(emailT, usersDB);
  // if no user found send 403 and message too register
  if (!isCurrentUser) {
    
    return res.status(403).redirect('403');
  }

  const authenticateByPassword = (email, password, usersDB) => {

    // add db query
    // admin false
    // select id, email, password, admin from users where email='apple@gmail.com';
    // 1 | apple@gmail.com | password | f

    // select id, email, password, admin from users where email='aadmin@gmail.com';
    //  id |      email       | password | admin 
    //  ----+------------------+----------+-------
    //    7 | aadmin@gmail.com | password | t
    
    

    for (let user in usersDB) {
      if (usersDB[user].email === email) {
        let storedPassword = usersDB[user].password;
        if (password === storedPassword) {
          return usersDB[user].id;
        }
      }
    }
  };

  // Authenticale user returns user id
  const isAuthenticated = authenticateByPassword(emailT, passwordT, usersDB);
  // if password returns false 403 response
  if (!isAuthenticated) {
   
    return res.status(403).redirect('403');
  }

  /**
   * add logic if userid is admin set userID as admin
   * 
   *   id |      email       | password | admin 
    ----+------------------+----------+-------
       7 | aadmin@gmail.com | password | t
   * **/

  // add id to to session for valid user
  const userID = isAuthenticated;
  req.session.userID = userID;

  // redirect to urls
  res.redirect("car_index");
});


app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
