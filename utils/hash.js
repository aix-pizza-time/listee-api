const crypto = require('crypto');

/**
 * Hashes arbitrary string data with sha256
 * @param {string} data hash data
 * @param {boolean} shortened whether the hash should be shortened to 8 characters
 */
const _hash = (data, shortened = true) => {
    const hash = crypto.createHash('sha256');
    hash.update(data);
    return (shortened ? hash.digest('hex').substr(0, 8) : hash.digest('hex'));
}

module.exports = _hash
