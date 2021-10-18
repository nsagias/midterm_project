-- Option 8: Buy/Sell Listing Website
-- An app where you can put different types of things up for sale. You can pick a specific niche of items to sell for the app (a cars site, a shoes site, etc). This lets buyers find the items they are looking for quickly, and easily contact sellers.

-- Requirements:
-- users can see featured items on a main feed
-- users can filter items by price,
-- users can favourite items to check up on them late
-- users can send messages to the user that is listing the item
-- Admins can:

-- post items, which can be seen by others
-- remove items from the site
-- mark items as SOLD!,
-- send a message via app, email, or text back on negotiations in buying the said item

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS cars CASCADE;
DROP TABLE IF EXISTS favourites  CASCADE;
DROP TABLE IF EXISTS messages  CASCADE;


CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(32),
  admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE cars (
  id SERIAL PRIMARY KEY NOT NULL,
  seller_id INTEGER REFERENCES users(id) ON DELETE CASCADE,

  title VARCHAR(100) NOT NULL,
  description TEXT,
  year INTEGER NOT NULL,
  model VARCHAR(100) NOT NULL,
  make VARCHAR(100) NOT NULL,
  model_colour VARCHAR(100) NOT NULL,
  thumbnail_url VARCHAR(100) NOT NULL,
  cover_url VARCHAR(255) NOT NULL,

  car_price INTEGER  NOT NULL DEFAULT 0,
  
  sold BOOLEAN NOT NULL DEFAULT FALSE,
  delete_date DATE DEFAULT NULL
);


CREATE TABLE favourites (
  id SERIAL PRIMARY KEY NOT NULL,
  favourite_date DATE NOT NULL,
  car_id   INTEGER REFERENCES cars(id)  ON DELETE CASCADE,
  buyer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  favourite_bool BOOLEAN NOT NULL DEFAULT FALSE
);


CREATE TABLE messages (
  id SERIAL PRIMARY KEY NOT NULL,
  sent_date DATE NOT NULL,
  email_id_sender    VARCHAR(255) NOT NULL,
  email_id_receiver  VARCHAR(255) NOT NULL,
  seller_id INTEGER,
  car_id    INTEGER REFERENCES cars(id)  ON DELETE CASCADE,
  buyer_id  INTEGER REFERENCES users(id) ON DELETE CASCADE
);

