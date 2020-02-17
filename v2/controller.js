const db = require('./db');
/**
 * Adds a new item to the li if and only if its (exact) value is not yet present
 * @param {string} entry the new entry to the list
 */
const _add = (data) => new Promise((resolve, reject) => {
  // INSERT INTO (SELECT id FROM lists WHERE status = 'active' LIMIT 1) VALUES ()
  db.query('INSERT INTO active_list (entry, creator, price) VALUES ($1, $2, $3)', 
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
  db.query('UPDATE active_list SET entry = $2, creator = $3, price = $4 WHERE id = $1', 
    [id, data.entry, data.creator, data.price])
    .then(res => resolve(res.rows[0]))
    .catch(err => reject(err));
});

/**
 * Deletes a singular item from the current list based on its ID
 * @param {Number} id item id
 */
const _delete = (id) => new Promise((resolve, reject) => {
  db.query('DELETE FROM active_list WHERE id = $1', [id])
    .then(res => resolve(res.rows[0]))
    .catch(err => reject(err));
});

/**
 * Resets the current list
 */
const _reset = () => new Promise((resolve, reject) => {
  db.query('DELETE FROM active_list WHERE 1')
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
      which = `WHERE list_status = 'active' OR list_status = 'available'`;
      break;
  }
  db.query(`SELECT id, list_id, list_timestamp, host FROM lists ${which}`)
    .then(res => resolve(res.rows))
    .catch(err => reject(err));
});

/**
 * Get all items from a certain list, by default the active one
 * @param {string} listId 
 */
const _get = (listId = 'active_list') => new Promise((resolve, reject) => {
  db.query("SELECT * FROM active_list")
    .then(res => resolve(res.rows))
    .catch(err => reject(err));
});

module.exports = {
  add: _add,
  rename: _rename,
  delete: _delete,
  lists: _lists,
  get: _get,
  reset: _reset,
  next: _next,
};