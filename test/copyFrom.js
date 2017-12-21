'use strict';

const PngImg = require('../');
const testData = require('./data');

describe('copyFrom', () => {
    const black2x2 = testData.readFileSync('black2x2rgba.png');
    const RED = {r: 255, g: 0, b: 0, a: 255};
    const BLACK = {r: 0, g: 0, b: 0, a: 255};

    it('should copy a rectaingle region from a src image to a dest image', () => {
        const destImg = new PngImg(black2x2);
        const srcImg = new PngImg(black2x2);

        srcImg.set(0, 0, RED);
        srcImg.set(0, 1, RED);

        destImg.copyFrom(srcImg, {top:0, left: 0, width: 1, height: 2});

        assert.deepEqual(destImg.get(0, 0), RED);
        assert.deepEqual(destImg.get(0, 1), RED);
        assert.deepEqual(destImg.get(1, 0), BLACK);
        assert.deepEqual(destImg.get(1, 1), BLACK);
    });

    it('should throw if a rectaingle region to be copied does not fit a size of a src image', () => {
        const destImg = new PngImg(black2x2);
        const srcImg = new PngImg(black2x2);

        assert.throws(() => destImg.copyFrom(srcImg, {top: 0, left: 0, width: 100500, height: 500100}), /Out of the bounds/);
    });

    it('should throw if a rectaingle region to be copied does not fit a size of a dest image', () => {
        const destImg = new PngImg(black2x2);
        const srcImg = new PngImg(black2x2);

        srcImg.setSize(4, 4);

        assert.throws(() => destImg.copyFrom(srcImg, {top: 0, left: 0, width: 4, height: 4}), /Out of the bounds/);
    });
});
