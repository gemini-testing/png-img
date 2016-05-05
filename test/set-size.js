'use strict';

const PngImg = require('../'),
    fs = require('fs'),
    path = require('path'),
    rawImg = fs.readFileSync(path.join(__dirname, 'black2x2.png')),

    RED = {r: 255, g: 0, b: 0, a: 0},
    BLACK = {r: 0, g: 0, b: 0, a: 0};

describe('setSize', () => {
    const sandbox = sinon.sandbox.create();

    afterEach(() => sandbox.restore());

    it('should call crop if new size is smaller than current', () => {
        const img = new PngImg(rawImg).fill(0, 0, 2, 2, RED);
        sandbox.stub(img, 'crop');

        img.setSize(2, 2);

        assert.calledWith(img.crop, 0, 0, 2, 2);
    });

    it('should actually change image size', () => {
        const img = new PngImg(rawImg);

        img.setSize(3, 3);

        assert.deepEqual(img.size(), {width: 3, height: 3});
    });

    it('should return image itself', () => {
        const img = new PngImg(rawImg);

        const result = img.setSize(3, 3);

        assert.equal(img, result);
    });

    it('should not break current image', () => {
        const img = new PngImg(rawImg).fill(0, 0, 2, 2, RED);

        img.setSize(3, 3);

        assert.deepEqual(img.get(0, 0), RED);
        assert.deepEqual(img.get(0, 1), RED);
        assert.deepEqual(img.get(1, 0), RED);
        assert.deepEqual(img.get(1, 1), RED);
    });

    it('should set new pixel color to black', () => {
        const img = new PngImg(rawImg).fill(0, 0, 2, 2, RED);

        img.setSize(3, 3);

        assert.deepEqual(img.get(2, 0), BLACK);
        assert.deepEqual(img.get(2, 1), BLACK);
        assert.deepEqual(img.get(2, 2), BLACK);
        assert.deepEqual(img.get(1, 2), BLACK);
        assert.deepEqual(img.get(0, 2), BLACK);
    });

    it('should correctly set size after crop', () => {
        const img = new PngImg(rawImg)
                .fill(0, 0, 2, 2, RED)
                .crop(0, 0, 1, 1);

        img.setSize(2, 2);

        assert.deepEqual(img.get(0, 0), RED);
        assert.deepEqual(img.get(0, 1), BLACK);
        assert.deepEqual(img.get(1, 0), BLACK);
        assert.deepEqual(img.get(1, 1), BLACK);
    });
});
