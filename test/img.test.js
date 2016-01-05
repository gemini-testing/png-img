'use strict';

var PngImg = require('../'),
    RGBToString = require('../utils').RGBToString,
    fs = require('fs'),
    path = require('path'),
    demand = require('must'),
    rawImg = fs.readFileSync(path.join(__dirname, 'test32x32.png'));

describe('fromBuffer', function() {
    it('should throw if not a buffer passed', function() {
        (function() {
            return PngImg.fromBuffer({});
        }).must.throw();
    });

    it('should call back with error if bad buffer passed', function(done) {
        PngImg.fromBuffer(new Buffer({}), function(error, pngImg) {
            demand(error).not.be(null);
            demand(pngImg).be(null);
            done();
        });
    });

    it('should call back with PngImg instance if valid image passed', function(done) {
        PngImg.fromBuffer(rawImg, function(error, pngImg) {
            demand(error).be(null);
            demand(pngImg).be.instanceOf(PngImg);
            done();
        });
    });
});

describe('size', function() {
    var img;

    beforeEach(function(done) {
        PngImg.fromBuffer(rawImg, function(err, pngImg) {
            img = pngImg;
            done();
        });
    });

    it('should return img size', function() {
        img.size().width.must.be(32);
        img.size().height.must.be(32);
    });
});

describe('crop', function() {
    var img;

    beforeEach(function(done) {
        PngImg.fromBuffer(rawImg, function(err, pngImg) {
            img = pngImg;
            done();
        });
    });

    it('should throw if negative width/height passed, but positive offset', function() {
        (function(){
            return img.crop(10, 10, -1, -1);
        }).must.throw();
    });

    it('should throw if negative offset passed, but positive width/height', function() {
        (function(){
            return img.crop(-1, -1, 10, 10);
        }).must.throw();
    });

    it('should throw if bad offset passed', function() {
        (function() {
            img.crop('adsf', {}, 10, 10);
        }).must.throw();
    });

    it('should throw if zero width or height passed', function() {
        (function(){
            return img.crop(1, 1, 0, 0);
        }).must.throw();
    });

    it('should throw if bad width or height passed', function() {
        (function(){
            return img.crop(1, 1, null, []);
        }).must.throw();
    });

    it('should throw if offsetX outside of the image', function() {
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
    var img,
        savePath = path.join(__dirname, 'tmp.png');

    beforeEach(function(done) {
        PngImg.fromBuffer(rawImg, function(err, pngImg) {
            img = pngImg;
            done();
        });
    });

    afterEach(function() {
        if(fs.existsSync(savePath)) {
            fs.unlinkSync(savePath);
        }
    });

    it('should fail if non-exstent path passed', function(done) {
        var badPath = path.join(__dirname, 'asdf', 'tmp.png');
        img.save(badPath, function(error) {
            demand(error).not.be(null);
            done();
        });
    });

    it('should save image', function(done) {
        img.save(savePath, function(error) {
            demand(error).be(null);
            fs.existsSync(savePath).must.be(true);
            done();
        });
    });

    it('should overwrite existing file', function(done) {
        var txt = 'o.O';
        fs.writeFileSync(savePath, txt);
        fs.readFileSync(savePath, {encoding: 'utf8'}).must.be(txt);

        img.save(savePath, function(error) {
            demand(error).be(null);
            fs.readFileSync(savePath, {encoding: 'utf8'}).must.not.be(txt);
            done();
        });
    });

    it('should read previously saved img', function(done) {
        img.save(savePath, function(error) {
            demand(error).be(null);
            PngImg.fromBuffer(fs.readFileSync(savePath), function(error, img2) {
                img2.size().width.must.be(img.size().width);
                img2.size().height.must.be(img.size().height);
                done();
            });
        });
    });
});

describe('get', function() {
    var rgbTestRawImg = fs.readFileSync(path.join(__dirname, 'rgba4x1.png')),
        img;

    beforeEach(function(done) {
        PngImg.fromBuffer(rgbTestRawImg, function(err, rgbImg) {
            img = rgbImg;
            done();
        });
    });

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

    it('should return alpha 255 if image without alpha', function(done) {
        var noAlphaRaw = fs.readFileSync(path.join(__dirname, 'rgb3x1_noalpha.png'));

        PngImg.fromBuffer(noAlphaRaw, function(err, noAlphaImg) {
            var r = noAlphaImg.get(0, 0),
                g = noAlphaImg.get(1, 0),
                b = noAlphaImg.get(2, 0);

            r.r.must.be(255); r.g.must.be(0); r.b.must.be(0); r.a.must.be(255);
            g.r.must.be(0); g.g.must.be(255); g.b.must.be(0); g.a.must.be(255);
            b.r.must.be(0); b.g.must.be(0); b.b.must.be(255); b.a.must.be(255);
            done();
        });
    });
});

describe('fill', function() {
    var rgbaTestRawImg = fs.readFileSync(path.join(__dirname, 'rgba4x1.png')),
        cyan = '#00ffff',
        img;

    beforeEach(function(done) {
        PngImg.fromBuffer(rgbaTestRawImg, function(err, rgbaImg) {
            img = rgbaImg;
            done();
        });
    });

    it('should throw if offsetX out of the bounds', function() {
        (function(){
            img.fill(img.size().width, 0, 1, 1, cyan);
        }).must.throw();
    });

    it('should throw if offsetY out of the bounds', function() {
        (function(){
            img.fill(0, img.size().height, 1, 1, cyan);
        }).must.throw();
    });

    it('should throw if zero width or height passed', function() {
        (function(){
            return img.fill(0, 0, 0, 0, cyan);
        }).must.throw();
    });

    it('should treat bad width or height as zeroes', function() {
        (function(){
            img.fill(0, 0, null, [], cyan);
        }).must.throw();
    });

    it('should throw if fill region is too big', function() {
        (function() {
            img.fill(0, 0, img.size().width + 1, img.size().height + 1, cyan);
        }).must.throw();
    });

    it('should throw if bad offset passed', function() {
        (function() {
            img.fill('adsf', {}, 1, 1, cyan);
        }).must.throw();
    });

    it('should throw if bad color passed', function() {
        (function(){
            return img.fill(0, 0, 1, 1, 'asdf');
        }).must.throw();
    });

    it('should fill with black if empty color object passed', function() {
        img.fill(0, 0, 1, 1, {});
        RGBToString(img.get(0, 0)).must.be('#000000');
    });

    it('should fill with color passed as rgb object', function() {
        var white = {r: 255, g: 255, b: 255, a: 255};
        img.fill(0, 0, 1, 1, white);
        img.get(0, 0).must.eql(white);
    });

    it('should fill with color passed as string', function() {
        var white = '#ffffff';
        img.fill(0, 0, 1, 1, white);
        RGBToString(img.get(0, 0)).must.be(white);
    });

    it('should fill using alpha', function() {
        var transparentWhite = {r: 255, g: 255, b: 255, a: 50};
        img.fill(0, 0, 1, 1, transparentWhite);
        img.get(0, 0).must.eql(transparentWhite);
    });

    it('should ignore alpha in image without alpha', function(done) {
        var noAlphaRaw = fs.readFileSync(path.join(__dirname, 'rgb3x1_noalpha.png'));

        PngImg.fromBuffer(noAlphaRaw, function(err, noAlphaImg) {
            var transparentWhite = {r: 255, g: 255, b: 255, a: 50};

            noAlphaImg.fill(0, 0, 1, 1, transparentWhite);
            noAlphaImg.get(0, 0).a.must.be(255);
            done();
        });
    });

    it('should fill few rows/columns correctly', function(done) {
        PngImg.fromBuffer(rawImg, function(err, bigImg) {
            var offsetX = 8,
                offsetY = 8,
                width = 16,
                height = 16;

            bigImg.fill(offsetX, offsetY, width, height, cyan);
            for(var i = 0; i < bigImg.size().width; ++i) {
                for(var j = 0; j < bigImg.size().height; ++j) {
                    var pxl = RGBToString(bigImg.get(i, j));
                    if(i < offsetX || j < offsetY || i >= offsetX + width || j >= offsetY + height) {
                        pxl.must.not.be(cyan);
                    } else {
                        pxl.must.be(cyan);
                    }
                }
            }
            done();
        });
    });

    it('should return this object', function() {
        img.fill(0, 0, 1, 1, cyan).must.be(img);
    });
});

describe('set', function() {
    var rgbaTestRawImg = fs.readFileSync(path.join(__dirname, 'rgba4x1.png')),
        img;

    beforeEach(function(done) {
        PngImg.fromBuffer(rgbaTestRawImg, function(err, pngImg) {
            img = pngImg;
            done();
        });
    });

    it('should throw if x out of the bounds', function() {
        (function(){
            return img.set(5, 0, '#ffffff');
        }).must.throw();
    });

    it('should throw if y out of the bounds', function() {
        (function(){
            return img.set(0, 1, '#ffffff');
        }).must.throw();
    });

    it('should throw if bad color passed', function() {
        (function(){
            return img.set(0, 0, 'asdf');
        }).must.throw();
    });

    it('should set black if empty color object passed', function() {
        img.set(0, 0, {});
        RGBToString(img.get(0, 0)).must.be('#000000');
    });

    it('should set color passed as rgb object', function() {
        var white = {r: 255, g: 255, b: 255, a: 255};
        img.set(0, 0, white);
        img.get(0, 0).must.eql(white);
    });

    it('should set color passed as string', function() {
        var white = '#ffffff';
        img.set(0, 0, white);
        RGBToString(img.get(0, 0)).must.be(white);
    });

    it('should set alpha too', function() {
        var transparentWhite = {r: 255, g: 255, b: 255, a: 50};
        img.set(0, 0, transparentWhite);
        img.get(0, 0).must.eql(transparentWhite);
    });

    it('should ignore alpha in image without alpha', function(done) {
        var noAlphaRaw = fs.readFileSync(path.join(__dirname, 'rgb3x1_noalpha.png'));

        PngImg.fromBuffer(noAlphaRaw, function(err, noAlphaImg) {
            var transparentWhite = {r: 255, g: 255, b: 255, a: 50};

            noAlphaImg.set(0, 0, transparentWhite);
            noAlphaImg.get(0, 0).a.must.be(255);
            done();
        });
    });

    it('should return this object', function() {
        img.set(0, 0, '#ffffff').must.be(img);
    });
});
