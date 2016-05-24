'use strict';

const PngImg = require('../');
const testData = require('./data');

describe('constructor', () => {
    it('should throw if not a buffer passed', () => {
        assert.throws(() => new PngImg({}));
    });

    it('should throw if bad buffer passed', () => {
        assert.throws(() => new PngImg(new Buffer({})));
    });

    it('should not throw with valid image passed', () => {
        assert.doesNotThrow(() => new PngImg(testData.readFileSync('test32x32.png')));
    });
});
