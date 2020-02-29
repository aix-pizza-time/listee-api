const db = require('./db');
/**
 * Adds a new item to the li if and only if its (exact) value is not yet present
 * @param {string} entry the new entry to the list
 */
const _add = ({entry, creator, price}) => new Promise((resolve, reject) => {
  // INSERT INTO (SELECT id FROM lists WHERE status = 'active' LIMIT 1) VALUES ()
  db.query('INSERT INTO active_list (entry, creator, price) VALUES ($1, $2, $3)', 
    [entry, creator, price])
    .then(res => resolve(res.rows[0]))
    .catch(err => reject(err));
});

/**
 * Renames a specific item
 * @param {Number} id item id
 * @param {Object} data data object
 */
const _rename = (id, {entry, creator, price}) => new Promise((resolve, reject) => {
  db.query('UPDATE active_list SET entry = $2, creator = $3, price = $4 WHERE id = $1', 
    [id, entry, creator, price])
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
  db.query('DELETE FROM active_list WHERE TRUE')
    .then(res => resolve())
    .catch(err => reject(err));
});

/**
 * Make a new archive table and export all current data to there
 * Clear active-list
 */
const _next = () => new Promise(async (resolve, reject) => {
  try {
    // 1. Rename active_list to list_$timestamp 
    const res = await db.query("SELECT id FROM lists WHERE list_status = 'active' ORDER BY list_timestamp DESC LIMIT 1");
    const id = res.rows[0].id;
    console.log(id);
    await db.query(`ALTER TABLE active_list RENAME TO list_${id}$`);
    
    // 2. Create new active_list table from schema
    await db.query(`CREATE TABLE active_list (
      id bigserial NOT NULL PRIMARY KEY, 
      entry text NOT NULL UNIQUE, 
      creator text NOT NULL,
      price real NOT NULL
    )`);

    // 3. Add new 'active' entry to lists
    await db.query(`INSERT INTO lists(host, list_status) VALUES('tba', 'active')`);
    resolve();
  } catch (e) {
    reject(e);
  }
});

/**
 * Set the host of the currently active list
 * @param {String} host hostname
 */
const _setHost = (host) => new Promise((resolve, reject) => {
  db.query("UPDATE lists SET host = $1 WHERE list_status = 'active'", [host])
    .then(_ => resolve(host))
    .catch(err => reject(err));
});

/**
 * Retrieve the hots of the currently active list
 */
const _getHost = () => new Promise((resolve, reject) => {
  db.query("SELECT host FROM lists WHERE list_status = 'active'")
    .then(host => resolve(host.rows[0]))
    .catch(err => reject(err));
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
  db.query(`SELECT * FROM lists ${which}`)
    .then(res => resolve(res.rows))
    .catch(err => reject(err));
});

/**
 * Get all items from a certain list, by default the active one
 * @param {string} listId 
 */
const _get = (listId = 'active_list') => new Promise((resolve, reject) => {
  db.query("SELECT * FROM active_list ORDER BY id ASC")
    .then(res => resolve(res.rows))
    .catch(err => reject(err));
});

/**
 * Learn a new ingredient
 * @param {{entry: String}} entry the (new) ingredient to learn 
 */
const _learn = ({entry}) => new Promise((resolve, reject) => {
  db.learn(entry)
    .then(_ => resolve())
    .catch(err => reject(err));
});

/**
 * Get all currently learned ingredients
 * TODO this query can become expensive, depending on the size of the dataset.
 * Introduce some sort of limit/pagination to reduce impact once the redis set
 * gets filled up
 */
const _getLearned = () => new Promise((resolve, reject) => {
  db.getLearned()
    .then(learned => resolve(learned))
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
  setHost: _setHost,
  getHost: _getHost,
  learn: _learn,
  getLearned: _getLearned,
};