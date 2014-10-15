'use strict';

var inherit = require('inherit'),
    Q = require('q'),
    path = require('path'),
    PngImg = require('./' + path.join('compiled', process.platform, process.arch, 'png_img')).PngImg;

module.exports = inherit({
    ///
    __constructor: function(rawImg) {
        this.img_ = new PngImg(rawImg);
    },

    ///
    size: function() {
        return {
            width: this.img_.width,
            height: this.img_.height
        };
    },

    ///
    crop: function(leftTopX, leftTopY, width, height) {
        this.img_.crop(leftTopX, leftTopY, width, height);
        return this;
    },

    ///
    save: function(file) {
        var d = Q.defer();
        this.img_.write(file, function(error) {
            if (error) {
                return d.reject(error);
            }
            d.fulfill(file);
        });
        return d.promise;
    }
});
