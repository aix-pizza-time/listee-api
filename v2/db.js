const { Pool } = require('pg');

const redisClient = require('redis').createClient({
  host: process.env.REDIS_URL,
});

const pool = new Pool({
  user: 'docker',
  password: 'docker',
  database: 'docker',
  host: process.env.POSTGRES_URL,
});

/**
 * Queries Redis Store for a given set
 * @param {string} set Redis set to get
 */
const _sget = (set) => {
  return new Promise((resolve, reject) => {
    redisClient.smembers(set, (err, replies) => {
      if (err) {
        reject(err);
      } else {
        resolve(replies);
      }
    });
  });
};

/**
 * Add a value to a set
 * @param {string} set Redis set to add element to
 * @param {string} value Value to add to set k
 */
const _sadd = (set, value) => {
  return new Promise((resolve, reject) => {
    redisClient.multi()
      .sadd(set, value)
      .smembers(set)
      .exec((err, replies) => {
          if (err) {
            reject(err);
          } else {
            resolve(replies[1]);
          }
      });
  });
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  learn: (ingredient) => _sadd('ingredients', ingredient),
  getLearned: () => _sget('ingredients'),
}