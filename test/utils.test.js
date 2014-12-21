'use strict';

var utils = require('../utils'),
    demand = require('must');

describe('utils', function() {
    describe('RGBToString', function() {
        var RGBToString = utils.RGBToString;

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
        var StringToRGBA = utils.StringToRGBA;

        it('should convert "#XXXXXX" string to rgb object', function() {
            StringToRGBA('#ffffff').must.eql({r: 255, g: 255, b: 255, a: 255});
            StringToRGBA('#000000').must.eql({r: 0, g: 0, b: 0, a: 255});
        });

        it('should ignore case', function() {
            StringToRGBA('#FfFFfF').must.eql({r: 255, g: 255, b: 255, a: 255});
        });

        it('should return null on bad string', function() {
            demand(StringToRGBA('asdf')).be(null);
        });
    });
});
