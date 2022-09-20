'use strict';

const {PngImg} = require('../dist');
const RGBToString = require('../dist/utils').RGBToString;
const testData = require('./data');

describe('set', () => {
    const rgbaTestRawImg = testData.readFileSync('rgba4x1.png');
    let img;

    beforeEach(() => {
        img = new PngImg(rgbaTestRawImg);
    });

    it('should throw if x out of the bounds', () => {
        assert.throws(() => img.set(5, 0, '#ffffff'));
    });

    it('should throw if y out of the bounds', () => {
        assert.throws(() => img.set(0, 1, '#ffffff'));
    });

    it('should throw if bad color passed', () => {
        assert.throws(() => img.set(0, 0, 'asdf'));
    });

    it('should set black if empty color object passed', () => {
        img.set(0, 0, {});
        assert.equal(RGBToString(img.get(0, 0)), '#000000');
    });

    it('should set color passed as rgb object', () => {
        const white = {r: 255, g: 255, b: 255, a: 255};
        img.set(0, 0, white);
        assert.deepEqual(img.get(0, 0), white);
    });

    it('should set color passed as string', () => {
        const white = '#ffffff';
        img.set(0, 0, white);
        assert.equal(RGBToString(img.get(0, 0)), white);
    });

    it('should set alpha too', () => {
        const transparentWhite = {r: 255, g: 255, b: 255, a: 50};
        img.set(0, 0, transparentWhite);
        assert.deepEqual(img.get(0, 0), transparentWhite);
    });

    it('should ignore alpha in image without alpha', () => {
        const noAlphaRaw = testData.readFileSync('rgb3x1_noalpha.png');
        const noAlphaImg = new PngImg(noAlphaRaw);
        const transparentWhite = {r: 255, g: 255, b: 255, a: 50};

        noAlphaImg.set(0, 0, transparentWhite);

        assert.equal(noAlphaImg.get(0, 0).a, 255);
    });

    it('should return this object', () => {
        assert.equal(img.set(0, 0, '#ffffff'), img);
    });
});
