'use strict';

var utils = require('./utils'),
    inherit = require('inherit'),
    PngImg = require('./build/Release/png_img').PngImg;

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

    /**
     * Get pixel
     * @param  {Number} x x coordinate (left to right)
     * @param  {Number} y y coordinate (top to bottom)
     * @return {Object}  {r, g, b, a}
     */
    get: function(x, y) {
        return this.img_.get(x, y);
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
            a: color.a === undefined ? 255 : color.a
        };

        this.img_.fill(offsetX, offsetY, width, height, color);
        return this;
    },

    ///
    crop: function(offsetX, offsetY, width, height) {
        this.img_.crop(offsetX, offsetY, width, height);
        return this;
    },

    /**
     * Save image to file
     * @param  {String}   file     path to file
     * @param  {SaveCallback} callback
     */
    save: function(file, callback) {
        this.img_.write(file, callback);
    }

    /**
     * @typedef {Function} SaveCallback
     * @param {String} error error message in case of fail
     */
});
