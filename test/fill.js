'use strict';

const PngImg = require('../dist');
const RGBToString = require('../dist/utils').RGBToString;
const testData = require('./data');
const rawImg = testData.readFileSync('test32x32.png');

describe('fill', () => {
    const rgbaTestRawImg = testData.readFileSync('rgba4x1.png');
    const cyan = '#00ffff';
    let img;

    beforeEach(() => {
        img = new PngImg(rgbaTestRawImg);
    });

    it('should throw if offsetX out of the bounds', () => {
        assert.throws(() => img.fill(img.size().width, 0, 1, 1, cyan));
    });

    it('should throw if offsetY out of the bounds', () => {
        assert.throws(() => img.fill(0, img.size().height, 1, 1, cyan));
    });

    it('should throw if zero width or height passed', () => {
        assert.throws(() => img.fill(0, 0, 0, 0, cyan));
    });

    it('should treat bad width or height as zeroes', () => {
        assert.throws(() => img.fill(0, 0, null, [], cyan));
    });

    it('should throw if fill region is too big', () => {
        assert.throws(() => img.fill(0, 0, img.size().width + 1, img.size().height + 1, cyan));
    });

    it('should treat bad offset as zeroes', () => {
        img.fill('adsf', {}, 1, 1, cyan);
        assert.equal(RGBToString(img.get(0, 0)), cyan);
    });

    it('should throw if bad color passed', () => {
        assert.throws(() => img.fill(0, 0, 1, 1, 'asdf'));
    });

    it('should fill with black if empty color object passed', () => {
        img.fill(0, 0, 1, 1, {});
        assert.equal(RGBToString(img.get(0, 0)), '#000000');
    });

    it('should fill with color passed as rgb object', () => {
        const white = {r: 255, g: 255, b: 255, a: 255};
        img.fill(0, 0, 1, 1, white);
        assert.deepEqual(img.get(0, 0), white);
    });

    it('should fill with color passed as string', () => {
        const white = '#ffffff';
        img.fill(0, 0, 1, 1, white);
        assert.equal(RGBToString(img.get(0, 0)), white);
    });

    it('should fill with offset & size coerced to numbers', () => {
        img.fill('0', '0', '1', '1', cyan);

        assert.equal(RGBToString(img.get(0, 0)), cyan);
    });

    it('should fill using alpha', () => {
        const transparentWhite = {r: 255, g: 255, b: 255, a: 50};
        img.fill(0, 0, 1, 1, transparentWhite);
        assert.deepEqual(img.get(0, 0), transparentWhite);
    });

    it('should ignore alpha in image without alpha', () => {
        const noAlphaRaw = testData.readFileSync('rgb3x1_noalpha.png');
        const noAlphaImg = new PngImg(noAlphaRaw);
        const transparentWhite = {r: 255, g: 255, b: 255, a: 50};

        noAlphaImg.fill(0, 0, 1, 1, transparentWhite);

        assert.equal(noAlphaImg.get(0, 0).a, 255);
    });

    it('should fill few rows/columns correctly', () => {
        const bigImg = new PngImg(rawImg);
        const offsetX = 8;
        const offsetY = 8;
        const width = 16;
        const height = 16;

        bigImg.fill(offsetX, offsetY, width, height, cyan);

        for(let i = 0; i < bigImg.size().width; ++i) {
            for(let j = 0; j < bigImg.size().height; ++j) {
                const pxl = RGBToString(bigImg.get(i, j));
                if(i < offsetX || j < offsetY || i >= offsetX + width || j >= offsetY + height) {
                    assert.notEqual(pxl, cyan);
                } else {
                    assert.equal(pxl, cyan);
                }
            }
        }
    });

    it('should return this object', () => {
        assert.equal(img.fill(0, 0, 1, 1, cyan), img);
    });
});
