// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const nodemailer = require('nodemailer');


// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();


app.use(morgan("dev"));

// Cookie section to handle cookies
app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: ['the longer the better', 'two is betther than one'],
}));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));



app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false,
  })
);

app.use(express.static("public"));


app.get("/", (req, res) => {

  res.redirect("/cars");
});


/***************************************
 * Login
 * GET /login
 ***************************************/
app.get('/stats', (req, res) => {
  // get login page/form
  const templateVars = { user: null };
  res.render('car_stats', templateVars);
});



/***************************************
 * Email messages show pages
 * POST /messages
 ***************************************/
app.post('/messages', async(req, res) => {
  const user_id = req.session.userID;
  const { car_id, email, sender_email, emailContent, subject } = req.body;
  const car_id_num = Number(car_id);
  console.log(car_id_num);
  // if user is not logged in, redirect to the login route
  if (!user_id) {
    res.redirect("/login");
  }
  // adding a record of the message event to the messages db if it is sent by a user.
  const addMessageRecord = function(car_id, user_id, seller_email, buyer_email) {
    const queryParams = [car_id, user_id, seller_email, buyer_email];
    const queryString = `
      INSERT INTO messages (car_id, buyer_id, email_id_receiver, email_id_sender, seller_id)
      VALUES ($1, $2, $3, $4, (
        SELECT seller_id
        FROM cars
        WHERE id = $1
        ))
      `;

    return db.query(queryString, queryParams);
  };

  addMessageRecord(car_id_num, user_id, email, sender_email).then((res) => console.log(res));
  //}

  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: 'bessie.schiller54@ethereal.email',
      pass: 'NtKGqxXMqAPCn4tzQQ',
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'bessie.schiller54@ethereal.email',
    to: `${email}`,
    subject: `${subject}`,
    text: `Sender Email: ${sender_email} \nMessage: ${emailContent}`,
  });

  // do NOT delete
  // console.log("Message sent: %s", info.messageId);
  // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  res.redirect("/cars");
});


/***************************************
 * Email messages show pages for
 *       admin page/car_new
 * POST /adminmessage
 ***************************************/
app.post('/adminmessage', async(req, res) => {
  const { email, emailContent, subject } = req.body;

  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: 'bessie.schiller54@ethereal.email',
      pass: 'NtKGqxXMqAPCn4tzQQ',
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'bessie.schiller54@ethereal.email',
    to: `${email}`,
    subject: `${subject}`,
    text: `${emailContent}`,
  });

  console.log("Message sent: %s", info.messageId);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  res.redirect("/new");
});



/***************************************
 * Get All cars function for
 * cars_index
 ***************************************/
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

    for (let i = 0; i < cars.length; i++) {
      result[i] = cars[i];
    }

    templateVars = {
      cars: result
    };

    resp.render("car_index", { templateVars });
  });
};

/***************************************
 * Email messages show pages for
 *       admin page/car_new
 * GET/cars for car_index
 ***************************************/
app.get("/cars", getAllCars);


app.get("/cars/:user_id", (req, res) => {

  res.render("car_index");
});
//function for get the car details by id
const getCardetailsByid = (id) => {
  const sql = `SELECT cars.id as car_id, title, descriptions, year, make, model, model_colour, cover_url, car_price, users.email as seller_email
  FROM cars
  JOIN users ON seller_id = users.id
  WHERE cars.id=$1`;
  //converts the string to number
  const values = [Number(id)];
  return db.query(sql, values)
    .then((res) => {
      return res.rows[0];
    })
    .catch(err => err);
};



app.get("/show/:car_id", (req, res) => {
  const carID = req.params.car_id;
  getCardetailsByid(carID)
    .then((data) => {
      const templateVars = { data };
      res.render("car_show", templateVars);
    });
});




app.get("/favourites", (req, res) => {
  const userID = req.session.userID;

  if (!userID) {
    return res.redirect("/login");
  }

  // get favourite and sort descending
  const filterByFavourites = function(buyer_id) {
    const queryParams = [buyer_id];
    const queryString = `
    SELECT cars.id as id, seller_id, title, descriptions, year, make model, model_colour, thumbnail_url, cover_url, car_price, sold, delete_date
    FROM cars JOIN favourites ON car_id = cars.id
    WHERE buyer_id = $1
    AND favourite_bool is TRUE
    ORDER BY favourite_date DESC
    `;

    return db.query(queryString, queryParams);
  };

  // call favourites and  assign to template var
  const carsInFavourites = filterByFavourites(userID);
  carsInFavourites
    .then((response) => {
      let cars = response.rows;
      let templateVars = { cars };
      res.render("car_index", templateVars);
    });

});


// favourite feature related route add to favourite
app.post("/favourites", (req, res) => {
  const userID = req.session.userID;
  console.log(req.body.carID);
  const carID = (Number(req.body.carId));

  if (!userID) {
    return res.redirect("/login");
  }

  // add to favourites
  const addToFavourites = function(user, car) {
    const queryParams = [user, car];
    const queryString = `
    INSERT INTO favourites (buyer_id, car_id)
    VALUES ($1, $2)
    RETURNING *
    `;

    return db.query(queryString, queryParams);
  };

  const newFavourite = addToFavourites(userID, carID);

  newFavourite
    .then(() => {
      res.redirect("/cars");
    });
});

// Display form to add a new car
app.get("/new", (req, res) => {
  const getMessaging = function() {
    const queryString = `
    SELECT *
    FROM messages
    ORDER BY sent_date DESC
    LIMIT 10
    `;

    return db.query(queryString);
  };

  // call messaging and assign data to templateVars
  const latestMessaging = getMessaging();
  latestMessaging
    .then((response) => {
      let messages = response.rows;
      let templateVars = { messages };
      res.render("car_new", templateVars);
    });

});


// Recieve new car form submission and send to db
app.post("/new", (req, res) => {

  const addCar = function(car) {
    const queryParams = [car.seller_id, car.title, car.descriptions, 
                         car.year, car.make, car.model, car.model_colour, 
                         car.thumbnail_url, car.cover_url, car.car_price * 100];
    const queryString = `
    INSERT INTO cars (seller_id, title, descriptions, year, make, model, model_colour, thumbnail_url, cover_url, car_price)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *;
    `;

    return db.query(queryString, queryParams);
  };

  const newListing = addCar(req.body);

  newListing
    .then(() => {
      res.redirect("/new");
    });

});

// "Delete" a record (really just add a delete date)
app.post("/delete", (req, res) => {
  if (!req.body.id) {
    return res.redirect("/new");
  }
  const markDeleted = function(id) {
    const queryParams = [id];
    const queryString = `
    UPDATE cars
    SET delete_date = CURRENT_DATE
    WHERE id = $1
    ;`;

    return db.query(queryString, queryParams);
  };


  const deleted = markDeleted(req.body.id);
  deleted.then(() => res.redirect("/new"));

});

// MARK SOLD - marks a specific car id as sold in the db
app.post("/sold", (req, res) => {
  if (!req.body.id) {
    return res.redirect("/new");
  }
  const markSold = function(id) {
    const queryParams = [id];
    const queryString = `
    UPDATE cars
    SET sold = TRUE
    WHERE id = $1
    ;`;

    return db.query(queryString, queryParams);
  };

  const sold = markSold(req.body.id);
  sold.then(() => res.redirect("/new"));
});



/***************************************
 * Logout
 * POST /logout
 ***************************************/
app.post("/logout", (req, res) => {
  // set session value to null
  req.session = null;
  res.redirect("/login");
});



/***************************************
 * Login
 * GET /login
 ***************************************/
app.get('/login', (req, res) => {
  // get login page/form
  const templateVars = { user: null };
  res.render('login', templateVars);
});


/***************************************
 * Login
 * POST /login
 ***************************************/

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const emailT = email.trim();
  const passwordT = password.trim();

  if (emailT === '' || passwordT === '') {
    return res.status(400).redirect('/login');
  }
  console.log(emailT, passwordT);
  const findUserByEmail = function(emailT) {
    const queryParams = [emailT];
    const queryString = `
      SELECT *
      FROM users
      WHERE email = $1
      `;

    return db.query(queryString, queryParams);
  };

  let isUser = undefined;
  let isAuthenticated = false;
  let isAdmin = false;
  let userID = null;

  const getUser = findUserByEmail(emailT);

  getUser.then(resp => {
    if (resp.rows[0].email !== emailT) {
      res.redirect('/login');
      return isUser;
    }
    isUser = true;

    if (resp.rows[0].password !== passwordT) {
      res.redirect('/login');
      return isAuthenticated;
    }
    isAuthenticated = true;

    if (resp.rows[0].id) {
      userID = resp.rows[0].id;
      req.session.userID = userID;
    }

    if (resp.rows[0].admin === true) {
      isAdmin = true;
      req.session.admin = isAdmin;
    }
    res.redirect("/cars");
  })
    .catch((resp) => console.log(resp));
  // do not remove this console.log
  console.log('this is user', getUser);

});



/***************************************
 * Login
 * POST /price
 * Enpoint to get/filter price by min max
 ***************************************/
app.post("/price", (rec, res) => {
  //Setting the default values for max and min if not provided
  let min = 0;
  let max = 1000000000;

  if (rec.body.min_price) {
    min = (rec.body.min_price * 100);
  }

  if (rec.body.max_price) {
    max = (rec.body.max_price * 100);
  }


  const filterByPrice = function(minPrice, maxPrice) {
    const queryParams = [minPrice, maxPrice];
    const queryString = `
    SELECT *
    FROM cars
    WHERE car_price >= $1
    AND car_price <= $2
    `;

    return db.query(queryString, queryParams);
  };

  // call function and re-render car_index with cars showing min and max
  const carsInPriceRange = filterByPrice(min, max);
  carsInPriceRange
    .then((response) => {
      let cars = response.rows;
      let templateVars = { cars };
      res.render("car_index", templateVars);
    });
});



app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
