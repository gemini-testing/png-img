'use strict';

const PngImg = require('../');
const testData = require('./data');

describe('crop', () => {
    const rawImg = testData.readFileSync('test32x32.png');
    let img;

    beforeEach(() => {
        img = new PngImg(rawImg);
    });

    it('should throw if negative width/height passed, but positive offset', () => {
        assert.throws(() => img.crop(10, 10, -1, -1));
    });

    it('should throw if negative offset passed, but positive width/height', () => {
        assert.throws(() => img.crop(-1, -1, 10, 10));
    });

    it('should treat bad offset as zeroes', () => {
        const size = img.size();

        img.crop('adsf', {}, size.width, size.height);

        assert.deepEqual(img.size(), size);
    });

    it('should coerce offset to numbers', () => {
        const size = img.size();

        img.crop('12', '3', String(size.width - 15), String(size.height - 15));

        assert.deepEqual(img.size(), {
            width: size.width - 15,
            height: size.height - 15,
        });
    });

    it('should throw if zero width or height passed', () => {
        assert.throws(() => img.crop(1, 1, 0, 0));
    });

    it('should treat bad width or height as zeroes', () => {
        assert.throws(() => img.crop(1, 1, null, []));
    });

    it('should throw if offsetX outside of the image', () => {
        assert.throws(() => img.crop(img.size().width, img.size().height, 1, 1));
    });

    it('should throw if size of new image is too big', () => {
        assert.throws(() => img.crop(0, 0, img.size().width + 1, img.size().height + 1));
    });

    it('should reset size after crop', () => {
        const newSize = {width: 16, height: 16};

        img.crop(0, 0, newSize.width, newSize.height);

        assert.deepEqual(img.size(), newSize);
    });

    it('should return this object', () => {
        assert.equal(img.crop(0, 0, 1, 1), img);
    });
});
