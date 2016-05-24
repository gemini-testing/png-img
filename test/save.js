'use strict';

const PngImg = require('../');
const fs = require('fs');
const path = require('path');
const testData = require('./data');

describe('save', () => {
    const img = new PngImg(testData.readFileSync('test32x32.png'));
    const savePath = path.join(__dirname, 'tmp.png');

    afterEach(() => {
        if(fs.existsSync(savePath)) {
            fs.unlinkSync(savePath);
        }
    });

    it('should fail if non-exstent path passed', done => {
        const badPath = path.join(__dirname, 'asdf', 'tmp.png');

        img.save(badPath, error => {
            assert.isDefined(error);
            done();
        });
    });

    it('should save image', done => {
        img.save(savePath, error => {
            assert.isUndefined(error);
            assert.isTrue(fs.existsSync(savePath));
            done();
        });
    });

    it('should overwrite existing file', done => {
        const txt = 'o.O';
        fs.writeFileSync(savePath, txt);
        assert.equal(fs.readFileSync(savePath, {encoding: 'utf8'}), txt);

        img.save(savePath, error => {
            assert.isUndefined(error);
            assert.notEqual(fs.readFileSync(savePath, {encoding: 'utf8'}), txt);
            done();
        });
    });

    it('should read previously saved img', done => {
        img.save(savePath, error => {
            assert.isUndefined(error);

            const img2 = new PngImg(fs.readFileSync(savePath));

            assert.deepEqual(img2.size(), img.size());

            done();
        });
    });
});
