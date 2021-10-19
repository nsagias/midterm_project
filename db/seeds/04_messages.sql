
-- CREATE TABLE messages (
--   id SERIAL PRIMARY KEY NOT NULL,
--   sent_date DATE NOT NULL,
--   email_id_sender    VARCHAR(255) NOT NULL,
--   email_id_receiver  VARCHAR(255) NOT NULL,
--   seller_id INTEGER,
--   car_id    INTEGER REFERENCES cars(id)  ON DELETE CASCADE,
--   buyer_id  INTEGER REFERENCES users(id) ON DELETE CASCADE
-- );
--  NOTE: SELLER AND BUYERS CANNOT BE THE SAME,
--  NOTE: EMAILS CANNOT BE THE SAME AS WELL
INSERT INTO
  messages
  (sent_date, email_id_sender, email_id_receiver, seller_id, car_id, buyer_id)
VALUES
  ('2021-10-15', 'apple@gmail.com', 'mango@gmail.com',            3, 1, 1),
  ('2021-10-15', 'pear@gmail.com', 'mango@gmail.com' ,            3, 2, 4),
  ('2021-10-17', 'orange@gmail.com', 'mango@gmail.com',           3, 2, 2),
  ('2021-10-17', 'mango@gmail.com', 'grape@gmail.com',            5, 2, 3),
  ('2021-10-18', 'pineApple@gmail.com', 'apple@gmail.com',         1, 3, 6),
  ('2021-10-19', 'grape@gmail.com', 'orange@gmail.com' ,           2, 1, 5);
