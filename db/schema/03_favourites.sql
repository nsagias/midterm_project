-- Drop and recreate favourites table 

DROP TABLE IF EXISTS favourites CASCADE;

CREATE TABLE favourites (
  id SERIAL PRIMARY KEY NOT NULL,
  favourite_date DATE NOT NULL DEFAULT CURRENT_DATE,
  car_id   INTEGER REFERENCES cars(id)  ON DELETE CASCADE,
  buyer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  favourite_bool BOOLEAN NOT NULL DEFAULT FALSE
);
