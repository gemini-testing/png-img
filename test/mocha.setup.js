'use strict';

const chai = require('chai');

global.sinon = require('sinon');
global.assert = chai.assert;

sinon.assert.expose(chai.assert, {prefix: ''});
