const fs = require('fs');
const timestamp = require('./timestamp');
const hash = require('./hash');

const _commit = (data) => {
    const _data = JSON.stringify(data);
    const dir = './static';
    const file = `${dir}/config.json`;
    const _timestamp = timestamp();
    _log(_timestamp, hash(_data), file);
    fs.writeFileSync(file, JSON.stringify(data, null, '  '))
}

const _log = (t,h,f) => {
    console.log('Committing current version:')
    console.log("    time: " + t);
    console.log("    id: " + h);
    console.log("    file: " + f);
}

module.exports = _commit;