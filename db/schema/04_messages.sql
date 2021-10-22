-- Drop and recreate messages table

DROP TABLE IF EXISTS messages  CASCADE;

CREATE TABLE messages (
  id SERIAL PRIMARY KEY NOT NULL,
  sent_date DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  email_id_sender    VARCHAR(255) NOT NULL,
  email_id_receiver  VARCHAR(255) NOT NULL,
  seller_id INTEGER,
  car_id    INTEGER REFERENCES cars(id)  ON DELETE CASCADE,
  buyer_id  INTEGER REFERENCES users(id) ON DELETE CASCADE
);
