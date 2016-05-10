'use strict';

const utils = require('../utils');
const demand = require('must');

describe('utils', function() {
    describe('RGBToString', function() {
        const RGBToString = utils.RGBToString;

        it('should convert rgb object to "#XXXXXX" string', function() {
            RGBToString({r: 255, g: 255, b: 255}).must.be('#ffffff');
            RGBToString({r: 0, g: 0, b: 0}).must.be('#000000');
        });

        it('should ignore alpha', function() {
            RGBToString({r: 255, g: 255, b: 255, a: 0}).must.be('#ffffff');
            RGBToString({r: 0, g: 0, b: 0, a: 255}).must.be('#000000');
        });
    });

    describe('StringToRGB', function() {
        const stringToRGBA = utils.stringToRGBA;

        it('should convert "#XXXXXX" string to rgb object', function() {
            stringToRGBA('#ffffff').must.eql({r: 255, g: 255, b: 255, a: 255});
            stringToRGBA('#000000').must.eql({r: 0, g: 0, b: 0, a: 255});
        });

        it('should ignore case', function() {
            stringToRGBA('#FfFFfF').must.eql({r: 255, g: 255, b: 255, a: 255});
        });

        it('should return null on bad string', function() {
            demand(stringToRGBA('asdf')).be(null);
        });
    });
});
