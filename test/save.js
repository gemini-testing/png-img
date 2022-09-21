'use strict';

const {PngImg} = require('../dist');
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

    it('should fail if non-exstent path passed', async () => {
        const badPath = path.join(__dirname, 'asdf', 'tmp.png');

        const savePromise = img.save(badPath);

        assert.isRejected(savePromise, Error);
    });

    it('should save image', async () => {
        await img.save(savePath);

        assert.isTrue(fs.existsSync(savePath));
    });

    it('should overwrite existing file', async () => {
        const txt = 'o.O';
        fs.writeFileSync(savePath, txt);
        assert.equal(fs.readFileSync(savePath, {encoding: 'utf8'}), txt);

        await img.save(savePath);

        assert.notEqual(fs.readFileSync(savePath, {encoding: 'utf8'}), txt);
    });

    it('should read previously saved img', async () => {
        await img.save(savePath);

        const img2 = new PngImg(fs.readFileSync(savePath));

        assert.deepEqual(img2.size(), img.size());
    });
});
