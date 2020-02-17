const { Pool } = require('pg');
const pool = new Pool({
  user: 'docker',
  password: 'docker',
  database: 'docker',
  host: process.env.DB_URL,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
}