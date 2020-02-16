import { Pool } from 'pg';
const pool = Pool();

await pool.connect({
  user: 'docker',
  password: 'docker',
  database: 'docker',
  host: process.env.DB_URL,
}).catch(err => setImmediate(() => {
  throw err 
}));

/**
 * Adds a new item to the li if and only if its (exact) value is not yet present
 * @param {string} entry the new entry to the list
 */
const _add = (data) => new Promise((resolve, reject) => {
  // INSERT INTO (SELECT id FROM lists WHERE status = 'active' LIMIT 1) VALUES ()
  pool.query('INSERT INTO active-list (entry, creator, price) VALUES ($1, $2, $3)', 
    [data.entry, data.creator, data.price])
    .then(res => resolve(res.rows[0]))
    .catch(err => reject(err));
});

/**
 * Renames a specific item
 * @param {Number} id item id
 * @param {Object} data data object
 */
const _rename = (id, data) => new Promise((resolve, reject) => {
  pool.query('UPDATE active-list SET entry = $2, creator = $3, price = $4 WHERE id = $1', 
    [id, data.entry, data.creator, data.price])
    .then(res => resolve(res.rows[0]))
    .catch(err => reject(err));
});

/**
 * Deletes a singular item from the current list based on its ID
 * @param {Number} id item id
 */
const _delete = (id) => new Promise((resolve, reject) => {
  pool.query('DELETE FROM active-list WHERE id = $1', [id])
    .then(res => resolve(res.rows[0]))
    .catch(err => reject(err));
});

/**
 * Resets the current list
 */
const _reset = () => new Promise((resolve, reject) => {
  pool.query('DELETE FROM active-list WHERE 1')
    .then(res => resolve())
    .catch(err => reject(err));
});

/**
 * Make a new archive table and export all current data to there
 * Clear active-list
 */
const _next = () => new Promise((resolve, reject) => {
  // 1. 
  // 2. Update creation timestamp on active-list table
});

/**
 * Get all lists
 */
const _lists = (option) => new Promise((resolve, reject) => {
  let which = '';
  switch(option){
    case 'all' : 
      which = ''
      break;
    case 'archived' : 
    case 'active' : 
    case 'available' :
      which = `WHERE status = ${option}`;
      break;
    default:
      which = `WHERE status = 'active' OR status = 'available'`;
      break;
  }
  pool.query(`SELECT id, name, time, host FROM lists ${which}`)
    .then(res => resolve(res.rows))
    .catch(err => reject(err));
});

/**
 * Get all items from a certain list, by default the active one
 * @param {string} listId 
 */
const _get = (listId = 'active-list') => new Promise((resolve, reject) => {
  client.query("SELECT * FROM $1", [listId])
    .then(res => resolve(res.rows))
    .catch(err => reject(err));
});

export const add = _add;
export const rename = _rename;
export const delete = _delete;
export const reset = _reset;
export const lists = _lists;
export const get = _get;