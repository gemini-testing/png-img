'use strict';

const utils = require('../dist/utils');

describe('utils', () => {
    describe('RGBToString', () => {
        const RGBToString = utils.RGBToString;

        it('should convert rgb object to "#XXXXXX" string', () => {
            assert.equal(RGBToString({r: 255, g: 255, b: 255}), '#ffffff');
            assert.equal(RGBToString({r: 0, g: 0, b: 0}), '#000000');
        });

        it('should ignore alpha', () => {
            assert.equal(RGBToString({r: 255, g: 255, b: 255, a: 0}), '#ffffff');
            assert.equal(RGBToString({r: 0, g: 0, b: 0, a: 255}), '#000000');
        });
    });

    describe('StringToRGB', () => {
        const stringToRGBA = utils.stringToRGBA;

        it('should convert "#XXXXXX" string to rgb object', () => {
            assert.deepEqual(stringToRGBA('#ffffff'), {r: 255, g: 255, b: 255, a: 255});
            assert.deepEqual(stringToRGBA('#000000'), {r: 0, g: 0, b: 0, a: 255});
        });

        it('should ignore case', () => {
            assert.deepEqual(stringToRGBA('#FfFFfF'), {r: 255, g: 255, b: 255, a: 255});
        });

        it('should return null on bad string', () => {
            assert.equal(stringToRGBA('asdf'), null);
        });
    });
});
