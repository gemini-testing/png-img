'use strict';

const PngImg = require('../dist');
const testData = require('./data');

describe('size', () => {
    const img = new PngImg(testData.readFileSync('test32x32.png'));

    it('should return img size', () => {
        assert.deepEqual(img.size(), {
            width: 32,
            height: 32
        });
    });
});
