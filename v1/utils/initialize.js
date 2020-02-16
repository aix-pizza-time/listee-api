const fs = require('fs');

/**
 * Retrieves the content from the volume file after restart
 * @param {string} directory path to dir
 */
const _initizalize = (directory) => {
    try {
        let contents = fs.readFileSync(`${directory}/config.json`, {encoding: 'utf8'});
        try {
            let json = JSON.parse(contents);
            console.log("Initialized from file. Current state:");
            console.log();
            console.log(contents);
            return JSON.parse(contents);
        } catch(e) {
            console.log(e);
        } finally {
            return {
                current: [],
                archive: {}
            };
        }
    } catch (e) {
        console.log('Cannot open config.json. Is volume mounted correctly?')
        console.log('');
        fs.readdir(`${directory}/`, (err, files) => {
            console.log("Listing files in config directory...")
            files.forEach((f) => {
                console.log(f);
            });
        });
        console.log('Failing, as volume access is required!');
        process.exit(1);
    }   
};

module.exports = _initizalize;