let {
  hash,
  timestamp,
  initialize,
  commit
} = require('../utils/');
let _stash = require('../utils/').stash;

data = initialize("./static");

const stash = () => new Promise((resolve, reject) => {
  _stash(data).then(_ => resolve()).catch(err => reject(err));
});

Array.prototype.findById = function (id) {
  if (typeof id !== 'string') {
    return null;
  } else {
    return this.find((v) => v.id === id);
  }
};

Array.prototype.findIndexById = function (id) {
  if (typeof id !== 'string') {
    return null;
  } else {
    return this.findIndex((v) => v.id === id);
  }
};

/**
 * Adds a new item to the list if and only if its (exact) value is not yet present
 * @param {string} entry the new entry to the list
 */
const _add = (entry) => new Promise((resolve, reject) => {
  const id = hash(entry);
  if (typeof entry !== 'string') {
    console.log('Received invalid type:')
    console.log(entry);
    reject('Incorrect data type. Only strings are allowed');
  } else {
    if (data['current'].findById(id)) {
      // Element already present, retreat!
      reject('Element already present. Will not add it again.');
    } else {
      if (entry.length <= 0) {
        reject('Empty names are not allowed. Will not add');
      } else {
        if(data.hasOwnProperty('committed') && data['committed'] === true){
          reject('List is already committed. Needs to be reset before new entries can be added');
        } else {
          data['current'].push({
            id: id,
            entry: entry
          });
          commit(data);
          resolve({
            id: id,
            entry: entry
          });
        }
      }
    }
  }
});

/**
 * Renames a specific item
 * @param {Number} id Item ID
 * @param {String} newName The item's new name
 */
const _rename = (id, newName) => new Promise((resolve, reject) => {
  // stash the current state to avoid obstruction of db
  stash().catch((err) => (reject(err)));
  if (typeof id !== 'string' || typeof newName !== 'string') {
    console.log('Received invalid type(s):')
    console.log(id);
    console.log(newName);
    reject('Incorrect data type. Only strings are allowed');
  } else {
    let index = data['current'].findIndexById(id);
    if (index === -1) {
      // Element already present, retreat!
      reject('Element not present. Will not rename');
    } else {
      if (newName.length <= 0) {
        reject('Empty names are not allowed. Will not rename');
      } else {
        // if(data.hasOwnProperty('committed') && data['committed'] === true){

        // } else {
          
        // }
        // Renaming is still allowed after commit so the previous control structure
        // is not (yet) required
        data['current'][index]['entry'] = newName;
        commit(data);
        resolve({
          id: id,
          entry: newName
        });
      }
    }
  }
});

/**
 * Deletes a singular item from the current list based on its ID
 * @param {Number} id item id
 */
const _delete = (id) => new Promise((resolve, reject) => {
  // stash the current state to avoid obstruction of db
  stash().catch((err) => (reject(err)));
  if (typeof id !== 'string') {
    console.log('Received invalid type:')
    console.log(id);
    reject('Incorrect data type. Only strings are allowed');
  } else {
    if (!data['current'].findById(id)) {
      // Element already present, retreat!
      reject('Element not present. Will not delete');
    } else {
      if(data.hasOwnProperty('committed') && data['committed'] === true){
        reject('List is already committed. Needs to be reset before new entries can be added');
      } else {
        let index = data['current'].findIndexById(id);
        let old_data = data['current'][index];
        data['current'].splice(index, 1);
        commit(data);
        resolve({
          id: id,
          entry: old_data
        });
      }
    }
  }
});

/**
 * @deprecated
 * 'Commit' will copy the entries from the staging (current) zone
 * into a timestamped archive of previous lists.
 * It however does not alter the state of the 'current' list, as 
 * it's not yet dismissable
 */
const _commit = () => new Promise((resolve, reject) => {
  // stash the current state to avoid obstruction of db
  stash().catch((err) => (reject(err)));
  if (Object.keys(data['current']).length <= 0) {
    reject('Current list has no data. Will not copy');
  } else {
    let cur = {
      date: timestamp(false),
      list: data['current']
    };
    console.log('date: ' + cur.date);
    data['archive'][hash(cur.date)] = cur;
    data['committed'] = true;
    commit(data);
    resolve(data['current']);
  }
});

/**
 * Resets the current list
 */
const _reset = () => new Promise((resolve, reject) => {
  // stash the current state to avoid obstruction of db
  stash().catch((err) => (reject(err)));
  // if (!data.hasOwnProperty('committed') || data['committed'] == false) {
  //   reject('List not committed. Will not reset');
  // } else {
    
  // }
  let cur = data['current'];
  data['current'] = [];
  // data['committed'] = false;
  commit(data);
  resolve(cur);
});

/**
 * @deprecated
 * Returns a resolving Promise with true if current list is committed, otherwise a false one.
 */
const _committed = () => new Promise((resolve, reject) => {
  if(!data.hasOwnProperty('committed')){
    console.log('Current data set is missing the \'committed\' property. Adding it...');
    data['committed'] = false;
  } 
  resolve(data['committed']);
});

const _lists = () => new Promise((resolve, reject) => {
  try {
    let keys = Object.keys(data.archive);
    resolve(keys);
  } catch (e) {
    reject(e);
  }
});

const _get = (id = 'current') => new Promise((resolve, reject) => {
  if (id === 'current') {
    resolve(data[id]);
  } else {
    if (data['archive'].hasOwnProperty(id)) {
      resolve(data['archive'][id]);
    } else {
      reject('ID not found');
    }
  }
});

module.exports = {
  add: _add,
  rename: _rename,
  delete: _delete,
  commit: _commit,
  reset: _reset,
  lists: _lists,
  get: _get,
  committed: _committed,
};