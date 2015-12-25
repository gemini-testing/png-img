'use strict';

var utils = require('./utils'),
    inherit = require('inherit'),
    PNG = require('pngjs').PNG,
    fs = require('fs'),
    stream = require('stream');

var PngImg = inherit({
    ///
    __constructor: function(png, alpha) {
        this._png = png;
        this._alpha = alpha;
        this._lastIdx = this._getIdx(this._png.width - 1, this._png.height - 1);
    },

    ///
    size: function() {
        return {
            width: this._png.width,
            height: this._png.height
        };
    },

    /**
     * Get pixel
     * @param  {Number} x x coordinate (left to right)
     * @param  {Number} y y coordinate (top to bottom)
     * @return {Object}  {r, g, b, a}
     */
    get: function(x, y) {
        var idx = this._getIdx(x, y);

        if(idx > this._lastIdx) {
            throw new Error('Out of the bounds');
        }

        return {
            r: this._png.data[idx],
            g: this._png.data[idx + 1],
            b: this._png.data[idx + 2],
            a: this._png.data[idx + 3]
        };
    },

    _getIdx: function(x, y) {
        return (this._png.width * y + x) << 2;
    },

    /**
     * Set pixel color
     * @param {Number} x x coordinate (left to right)
     * @param {Number} y y coordinate (top to bottom)
     * @param {Object|String} color as rgb object or as a '#XXXXXX' string
     */
    set: function(x, y, color) {
        return this.fill(x, y, 1, 1, color);
    },

    /**
     * Fill region with some color
     * @param {Number} offsetX offset from left side of the image
     * @param {Number} offsetY offset from top side of the image
     * @param {Number} width
     * @param {Number} height
     * @param {Object|String} color as rgb object or as a '#XXXXXX' string
     */
    fill: function(offsetX, offsetY, width, height, color) {
        this._validateArgs(offsetX, offsetY, width, height);

        if(typeof color === 'string') {
            var objColor = utils.stringToRGBA(color);
            if(!objColor) {
                throw new Error('Bad color ' + color);
            }

            return this.fill(offsetX, offsetY, width, height, objColor);
        }

        color = {
            r: color.r || 0,
            g: color.g || 0,
            b: color.b || 0,
            a: color.a === undefined || !this._alpha ? 255 : color.a
        };

        for (var y = 0; y < height; ++y) {
            for (var x = 0; x < width; ++x) {
                var idx = this._getIdx(offsetX + x, offsetY + y);
                this._png.data[idx] = color.r;
                this._png.data[idx + 1] = color.g;
                this._png.data[idx + 2] = color.b;
                this._png.data[idx + 3] = color.a;
            }
        }

        return this;
    },

    ///
    crop: function(offsetX, offsetY, width, height) {
        this._validateArgs(offsetX, offsetY, width, height);

        var dst = new PNG({width: width, height: height});
        this._png.bitblt(dst, offsetX, offsetY, width, height, 0, 0);
        this._png = dst;

        return this;
    },

    ///
    _validateArgs: function(offsetX, offsetY, width, height) {
        // `val > 0` also validates cases when `val` is not a number
        if (!((offsetX > 0 || offsetX === 0) && (offsetY > 0 || offsetY === 0) && width > 0 && height > 0)) {
            throw new Error('Bad arguments');
        }

        var size = this.size();
        if (offsetX + width > size.width || offsetY + height > size.height) {
            throw new Error('Out of the bounds');
        }
    },

    /**
     * @typedef {Function} SaveCallback
     * @param {String} error error message in case of fail
     */

    /**
     * Save image to file
     * @param  {String}   file     path to file
     * @param  {SaveCallback} callback
     */
    save: function(file, callback) {
        this._png.pack()
            .pipe(fs.createWriteStream(file))
            .on('error', function(error) {
                callback(error);
            })
            .on('finish', function() {
                callback(null);
            });
    }
}, {
    fromBuffer: function(buffer, cb) {
        var bufferStream = new stream.PassThrough();
        bufferStream.end(buffer);

        var alpha;
        bufferStream
            .pipe(new PNG())
            .on('error', function (e) {
                cb(e, null);
            })
            .on('metadata', function(metadata) {
                alpha = metadata.alpha;
            })
            .on('parsed', function () {
                cb(null, new PngImg(this, alpha));
            });
    }
});



module.exports = PngImg;
