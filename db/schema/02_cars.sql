-- Drop and recreate cars table (Example)

DROP TABLE IF EXISTS cars CASCADE;
CREATE TABLE cars (
  id SERIAL PRIMARY KEY NOT NULL,
  seller_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  descriptions TEXT,
  year INTEGER NOT NULL,
  make VARCHAR(255) NOT NULL,
  model VARCHAR(255) NOT NULL,
  model_colour VARCHAR(255) NOT NULL,
  thumbnail_url VARCHAR(255) NOT NULL,
  cover_url VARCHAR(255) NOT NULL,
  car_price INTEGER NOT NULL DEFAULT 0,
  sold BOOLEAN NOT NULL DEFAULT FALSE,
  delete_date DATE DEFAULT NULL
);
