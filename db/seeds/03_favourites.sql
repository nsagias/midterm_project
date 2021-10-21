
-- CREATE TABLE favourites (
--   id SERIAL PRIMARY KEY NOT NULL,
--   favourite_date DATE NOT NULL,
--   car_id   INTEGER REFERENCES cars(id)  ON DELETE CASCADE,
--   buyer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
--   favourite_bool BOOLEAN NOT NULL DEFAULT TRUE
-- );
-- favourite might need to be default TRUE at creation and then set to false

INSERT INTO
  favourites
  (favourite_date, car_id, buyer_id, favourite_bool)
VALUES
  ('2021-10-17', 1, 1, FALSE),
  ('2021-10-18', 1, 2, FALSE),
  ('2021-10-13', 1, 3, FALSE),
  ('2021-10-15', 1, 4, TRUE),
  ('2021-10-18', 2, 1, TRUE),
  ('2021-10-17', 3, 2, TRUE),
  ('2021-10-18', 4, 5, TRUE),
  ('2021-10-13', 5, 6, TRUE),
  ('2021-10-18', 5, 1, TRUE),
  ('2021-10-17', 3, 3, TRUE),
  ('2021-10-18', 4, 3, TRUE),
  ('2021-10-13', 5, 4, TRUE);

