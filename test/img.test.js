'use strict';

var PngImg = require('../'),
    fs = require('fs'),
    path = require('path'),
    demand = require('must'),
    rawImg = fs.readFileSync(path.join(__dirname, 'test32x32.png'));

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
    var img;

    beforeEach(function() {
        img = new PngImg(rawImg);
    });

    it('should throw if negative args passed', function() {
        (function(){
            return img.crop(-1, -1, -1, -1);
        }).must.throw();
    });

    it('should treat bad offset as zeroes', function() {
        var size = img.size();
        img.crop('adsf', {}, size.width, size.height);
        img.size().width.must.be(size.width);
        img.size().height.must.be(size.height);
    });

    it('should throw if zero width or height passed', function() {
        (function(){
            return img.crop(1, 1, 0, 0);
        }).must.throw();
    });

    it('should treat bad width or height as zeroes', function() {
        (function(){
            return img.crop(1, 1, null, []);
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
        savePath = path.join(__dirname, 'tmp.png');

    afterEach(function() {
        if(fs.existsSync(savePath)) {
            fs.unlinkSync(savePath);
        }
    });

    it('should fail if non-exstent path passed', function(done) {
        var badPath = path.join(__dirname, 'asdf', 'tmp.png');
        img.save(badPath, function(error) {
            demand(error).not.be(undefined);
            done();
        });
    });

    it('should save image', function(done) {
        img.save(savePath, function(error) {
            demand(error).be(undefined);
            fs.existsSync(savePath).must.be(true);
            done();
        });
    });

    it('should overwrite existing file', function(done) {
        var txt = 'o.O';
        fs.writeFileSync(savePath, txt);
        fs.readFileSync(savePath, {encoding: 'utf8'}).must.be(txt);

        img.save(savePath, function(error) {
            demand(error).be(undefined);
            fs.readFileSync(savePath, {encoding: 'utf8'}).must.not.be(txt);
            done();
        });
    });

    it('should read previously saved img', function(done) {
        img.save(savePath, function(error) {
            demand(error).be(undefined);
            var img2 = new PngImg(fs.readFileSync(savePath));
            img2.size().width.must.be(img.size().width);
            img2.size().height.must.be(img.size().height);
            done();
        });
    });
});

describe('get', function() {
    var rgbTestRawImg = fs.readFileSync(path.join(__dirname, 'rgba4x1.png')),
        img = new PngImg(rgbTestRawImg);

    it('should throw if x out of the bounds', function() {
        (function(){
            return img.get(5, 0);
        }).must.throw();
    });

    it('should throw if y out of the bounds', function() {
        (function(){
            return img.get(0, 1);
        }).must.throw();
    });

    it('should return pixel colors and alpha', function() {
        var r = img.get(0, 0),
            g = img.get(1, 0),
            b = img.get(2, 0),
            a = img.get(3, 0);

        r.r.must.be(255); r.g.must.be(0); r.b.must.be(0); r.a.must.be(255);
        g.r.must.be(0); g.g.must.be(255); g.b.must.be(0); g.a.must.be(255);
        b.r.must.be(0); b.g.must.be(0); b.b.must.be(255); b.a.must.be(255);
        a.r.must.be(0); a.g.must.be(0); a.b.must.be(0); a.a.must.be(0);
    });

    it('should return alpha 255 if image without alpha', function() {
        var noAlphaRaw = fs.readFileSync(path.join(__dirname, 'rgb3x1_noalpha.png')),
            noAlphaImg = new PngImg(noAlphaRaw),
            r = noAlphaImg.get(0, 0),
            g = noAlphaImg.get(1, 0),
            b = noAlphaImg.get(2, 0);

        r.r.must.be(255); r.g.must.be(0); r.b.must.be(0); r.a.must.be(255);
        g.r.must.be(0); g.g.must.be(255); g.b.must.be(0); g.a.must.be(255);
        b.r.must.be(0); b.g.must.be(0); b.b.must.be(255); b.a.must.be(255);
    });
});
