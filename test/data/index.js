'use strict';

const fs = require('fs');
const path = require('path');

exports.readFileSync = (name) => {
    return fs.readFileSync(path.join(__dirname, name));
};
