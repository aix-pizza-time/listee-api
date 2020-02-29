CREATE TYPE status AS ENUM ('active', 'available', 'archived');

CREATE TABLE IF NOT EXISTS lists (
  id bigserial PRIMARY KEY,
  -- list_id bigserial UNIQUE,
  list_timestamp timestamptz DEFAULT CURRENT_TIMESTAMP,
  host text NOT NULL,
  list_status text NOT NULL
);

CREATE TABLE IF NOT EXISTS active_list (
  id bigserial NOT NULL PRIMARY KEY,
  entry text NOT NULL UNIQUE,
  creator text NOT NULL,
  price real NOT NULL
);

-- INSERT INTO active_list(entry, creator, price) VALUES ('Käse', 'Alex', 0.99);
-- INSERT INTO active_list(entry, creator, price) VALUES ('Salami', 'Alex', 1.29);
-- INSERT INTO active_list(entry, creator, price) VALUES ('Wein', 'Alex', 2.99);

INSERT INTO lists(host, list_status) VALUES ('tba', 'active');
