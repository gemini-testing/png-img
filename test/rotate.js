'use strict';

const PngImg = require('../dist');
const testData = require('./data');
const RGBToString = require('../dist/utils').RGBToString;

const R1 = '#ff0000';
const R2 = '#880000';
const G1 = '#00ff00';
const G2 = '#008800';
const B1 = '#0000ff';
const B2 = '#000088';

describe('rotate', () => {
    function mkImg_(rows) {
        const img = new PngImg(testData.readFileSync('black2x2rgba.png'));

        if(rows) {
            img.setSize(rows[0].length, rows.length);
            rows.forEach((row, y) => {
                row.forEach((color, x) => img.set(x, y, color));
            });
        }

        return img;
    }

    function assertEqual_(img, rows) {
        assert.deepEqual(img.size(), {
            width: rows[0].length,
            height: rows.length
        });

        rows.forEach((row, y) => {
            row.forEach((expected, x) => {
                const actual = RGBToString(img.get(x, y));
                assert(
                    actual === expected,
                    `Color mismatch for (${x}, ${y}): expected ${expected}, but got ${actual}`
                );
            });
        });
    }

    describe('rotateRight', () => {
        it('should rotate 90 degrees clockwise', () => {
            const img = mkImg_([
                [R1, G1, B1],
                [R2, G2, B2]
            ]);

            img.rotateRight();

            assertEqual_(img, [
                [R2, R1],
                [G2, G1],
                [B2, B1]
            ]);
        });

        it('should rotate to its original after 4 rotates', () => {
            const img = mkImg_([
                [R1, G1, B1],
                [R2, G2, B2]
            ]);

            img.rotateRight();
            img.rotateRight();
            img.rotateRight();
            img.rotateRight();

            assertEqual_(img, [
                [R1, G1, B1],
                [R2, G2, B2]
            ]);
        });

        it('should return this object', () => {
            const img = mkImg_();
            assert.equal(img.rotateRight(), img);
        });
    });

    describe('rotateLeft', () => {
        it('should rotate 90 degrees counterclockwise', () => {
            const img = mkImg_([
                [R1, G1, B1],
                [R2, G2, B2]
            ]);

            img.rotateLeft();

            assertEqual_(img, [
                [B1, B2],
                [G1, G2],
                [R1, R2]
            ]);
        });

        it('should rotate to its original after 4 rotates', () => {
            const img = mkImg_([
                [R1, G1, B1],
                [R2, G2, B2]
            ]);

            img.rotateLeft();
            img.rotateLeft();
            img.rotateLeft();
            img.rotateLeft();

            assertEqual_(img, [
                [R1, G1, B1],
                [R2, G2, B2]
            ]);
        });

        it('should return this object', () => {
            const img = mkImg_();
            assert.equal(img.rotateLeft(), img);
        });
    });
});
