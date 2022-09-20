'use strict';

const {PngImg} = require('../dist');
const testData = require('./data');

describe('get', () => {
    const rgbTestRawImg = testData.readFileSync('rgba4x1.png');
    const img = new PngImg(rgbTestRawImg);

    it('should throw if x out of the bounds', () => {
        assert.throws(() => img.get(5, 0));
    });

    it('should throw if y out of the bounds', () => {
        assert.throws(() => img.get(0, 1));
    });

    it('should return pixel colors and alpha', () => {
        const r = img.get(0, 0);
        const g = img.get(1, 0);
        const b = img.get(2, 0);
        const a = img.get(3, 0);

        assert.deepEqual(r, {r: 255, g: 0, b: 0, a: 255});
        assert.deepEqual(g, {r: 0, g: 255, b: 0, a: 255});
        assert.deepEqual(b, {r: 0, g: 0, b: 255, a: 255});
        assert.deepEqual(a, {r: 0, g: 0, b: 0, a: 0});
    });

    it('should return pixel colors and alpha when x,y are strings', () => {
        const r = img.get('0', '0');
        const g = img.get('1', '0');
        const b = img.get('2', '0');
        const a = img.get('3', '0');

        assert.deepEqual(r, {r: 255, g: 0, b: 0, a: 255});
        assert.deepEqual(g, {r: 0, g: 255, b: 0, a: 255});
        assert.deepEqual(b, {r: 0, g: 0, b: 255, a: 255});
        assert.deepEqual(a, {r: 0, g: 0, b: 0, a: 0});
    });

    it('should return alpha 255 if image without alpha', () => {
        const noAlphaRaw = testData.readFileSync('rgb3x1_noalpha.png');
        const noAlphaImg = new PngImg(noAlphaRaw);
        const r = noAlphaImg.get(0, 0);
        const g = noAlphaImg.get(1, 0);
        const b = noAlphaImg.get(2, 0);

        assert.deepEqual(r, {r: 255, g: 0, b: 0, a: 255});
        assert.deepEqual(g, {r: 0, g: 255, b: 0, a: 255});
        assert.deepEqual(b, {r: 0, g: 0, b: 255, a: 255});
    });
});
