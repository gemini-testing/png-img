'use strict';

var PngImg = require('../'),
    fs = require('fs'),
    path = require('path'),
    rawImg = fs.readFileSync(path.resolve(__dirname, './test32x32.png'));

describe('constructor', function() {
    it('should throw if not a buffer passed', function() {
        (function() {
            return new PngImg({});
        }.must.throw());
    });

    it('should throw if bad buffer passed', function() {
        (function() {
            return new PngImg(new Buffer({}));
        }).must.throw();
    });

    it('should not throw with valid image passed', function() {
        (function() {
            return new PngImg(rawImg);
        }).must.not.throw();
    });
});

describe('size', function() {
    var img = new PngImg(rawImg);

    it('should return img size', function() {
        img.size().width.must.be(32);
        img.size().height.must.be(32);
    });
});

describe('crop', function() {
    var img = new PngImg(rawImg);

    it('should throw if bad args passed', function() {
        (function(){
            return img.crop(-1, -1, -1, -1);
        }).must.throw();
    });

    it('should throw if topLeft outside of the image', function() {
        (function() {
            return img.crop(img.size().width, img.size().height, 1, 1);
        }).must.throw();
    });

    it('should throw if size of new image is too big', function() {
        (function() {
            return img.crop(0, 0, img.size().width + 1, img.size().height + 1);
        }).must.throw();
    });

    it('should reset size after crop', function() {
        var newSize = {width: 16, height: 16};
        img.crop(0, 0, newSize.width, newSize.height);
        img.size().width.must.be(newSize.width);
        img.size().height.must.be(newSize.height);
    });

    it('should return this object', function() {
        img.crop(0, 0, 1, 1).must.be(img);
    });
});

describe('save', function() {
    var img = new PngImg(rawImg),
        savePath = path.resolve(__dirname, './tmp.png');

    afterEach(function() {
        if(fs.existsSync(savePath)) {
            fs.unlinkSync(savePath);
        }
    });

    it('should save image', function() {
        return img.save(savePath)
            .then(function() {
                fs.existsSync(savePath).must.be(true);
            });
    });

    it('should overwrite existing file', function() {
        var txt = 'o.O';
        fs.writeFileSync(savePath, txt);
        fs.readFileSync(savePath, {encoding: 'utf8'}).must.be(txt);

        return img.save(savePath)
            .then(function() {
                fs.readFileSync(savePath, {encoding: 'utf8'}).must.not.be(txt);
            });
    });

    it('should read previously saved img', function() {
        return img.save(savePath)
            .then(function() {
                var img2 = new PngImg(fs.readFileSync(savePath));
                img2.size().width.must.be(img.size().width);
                img2.size().height.must.be(img.size().height);
            });
    });
});
