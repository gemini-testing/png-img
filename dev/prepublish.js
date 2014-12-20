'use strict';

var fs = require('fs');

if(getActualCommand() === 'publish') {
    checkFiles(JSON.parse(fs.readFileSync('package.json')).files);
}

///
function getActualCommand() {
    var argv = JSON.parse(process.env.npm_config_argv);
    return argv.original[0];
}

///
function checkFiles(files) {
    var missingFiles = files.filter(function(file) {
            return !fs.existsSync(file);
        });

    if(missingFiles.length) {
        console.error('Missing files:\n\t' + missingFiles.join('\n\t'));
        process.exit(1);
    }
}
