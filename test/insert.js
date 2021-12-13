'use strict';

const PngImg = require('../').default;
const testData = require('./data');
const rawImg = testData.readFileSync('black2x2rgba.png');

const RED = {r: 255, g: 0, b: 0, a: 255};
const GREEN = {r: 0, g: 255, b: 0, a: 255};
const BLUE = {r: 0, g: 0, b: 255, a: 255};

describe('insert', () => {
    it('should return image itself', () => {
        const img = new PngImg(rawImg);
        const otherImg = new PngImg(rawImg);

        const result = img.insert(otherImg, 0, 0);

        assert.equal(img, result);
    });

    it('should fail if inserted image is out of the bounds of current image', () => {
        const img = new PngImg(rawImg);
        const otherImg = new PngImg(rawImg);

        assert.throws(() => img.insert(otherImg, 1, 1), /out of the bounds/i);
    });

    it('should fail if inserted image is not a PngImg object', () => {
        const img = new PngImg(rawImg);
        const badImg = Object.create(null);

        assert.throws(() => img.insert(badImg), /not a pngimg object/i);
    });

    it('should insert image if no intersection', () => {
        const img = new PngImg(rawImg).fill(0, 0, 2, 2, RED);
        const green = new PngImg(rawImg).fill(0, 0, 2, 2, GREEN);

        img
            .setSize(2, 4)
            .insert(green, 0, 2);

        assert.deepEqual(img.get(0, 0), RED);
        assert.deepEqual(img.get(0, 1), RED);
        assert.deepEqual(img.get(1, 0), RED);
        assert.deepEqual(img.get(1, 1), RED);

        assert.deepEqual(img.get(0, 2), GREEN);
        assert.deepEqual(img.get(1, 2), GREEN);
        assert.deepEqual(img.get(0, 3), GREEN);
        assert.deepEqual(img.get(1, 3), GREEN);
    });

    it('should be able to insert itself', () => {
        const img = new PngImg(rawImg).fill(0, 0, 2, 2, RED);

        img.insert(img);

        assert.deepEqual(img.get(0, 0), RED);
        assert.deepEqual(img.get(0, 1), RED);
        assert.deepEqual(img.get(1, 0), RED);
        assert.deepEqual(img.get(1, 1), RED);
    });

    it('should treat undefined offsets as 0', () => {
        const img = new PngImg(rawImg).fill(0, 0, 2, 2, RED);
        const green = new PngImg(rawImg).fill(0, 0, 2, 2, GREEN);

        img.insert(green);

        assert.deepEqual(img.get(0, 0), GREEN);
        assert.deepEqual(img.get(0, 1), GREEN);
        assert.deepEqual(img.get(1, 0), GREEN);
        assert.deepEqual(img.get(1, 1), GREEN);
    });

    it('should insert image without alpha', () => {
        const img = new PngImg(rawImg).setSize(3, 2).fill(0, 0, 3, 1, RED);
        const imgNoAlpha = new PngImg(testData.readFileSync('rgb3x1_noalpha.png'));

        img.insert(imgNoAlpha, 0, 1);

        assert.deepEqual(img.get(0, 0), RED);
        assert.deepEqual(img.get(1, 0), RED);
        assert.deepEqual(img.get(2, 0), RED);

        assert.deepEqual(img.get(0, 1), RED);
        assert.deepEqual(img.get(1, 1), GREEN);
        assert.deepEqual(img.get(2, 1), BLUE);
    });
});
