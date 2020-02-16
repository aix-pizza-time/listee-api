CREATE TYPE status AS ENUM ('active', 'archived');

CREATE TABLE IF NOT EXISTS lists (
  `id` text PRIMARY KEY NOT NULL,
  `listId` text NOT NULL UNIQUE,
  `timestamp` timestamptz NOT NULL,
  `host` text NOT NULL,
  `status` status NOT NULL,
);

CREATE TABLE IF NOT EXISTS active (
  `id` int NOT NULL PRIMARY KEY,
  `entry` text NOT NULL UNIQUE,
  `creator` text NOT NULL,
  `price` real NOT NULL,
)

INSERT INTO active (`entry`, `creator`, `price`) VALUES (
  "Käse", "Alex", 0.99
)
INSERT INTO active (`entry`, `creator`, `price`) VALUES (
  "Salami", "Alex", 1.29
)
INSERT INTO active (`entry`, `creator`, `price`) VALUES (
  "Wein", "Alex", 2.99
)
