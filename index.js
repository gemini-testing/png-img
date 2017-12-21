'use strict';

const utils = require('./utils');
const PngImgImpl = require('./build/Release/png_img').PngImg;

module.exports = class PngImg {
    ///
    constructor(rawImg) {
        this.img_ = new PngImgImpl(rawImg);
    }

    ///
    size() {
        return {
            width: this.img_.width,
            height: this.img_.height
        };
    }

    /**
     * Get pixel
     * @param  {Number} x x coordinate (left to right)
     * @param  {Number} y y coordinate (top to bottom)
     * @return {Object}  {r, g, b, a}
     */
    get(x, y) {
        return this.img_.get(x, y);
    }

    /**
     * Set pixel color
     * @param {Number} x x coordinate (left to right)
     * @param {Number} y y coordinate (top to bottom)
     * @param {Object|String} color as rgb object or as a '#XXXXXX' string
     */
    set(x, y, color) {
        return this.fill(x, y, 1, 1, color);
    }

    /**
     * Fill region with some color
     * @param {Number} offsetX offset from left side of the image
     * @param {Number} offsetY offset from top side of the image
     * @param {Number} width
     * @param {Number} height
     * @param {Object|String} color as rgb object or as a '#XXXXXX' string
     */
    fill(offsetX, offsetY, width, height, color) {
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
    }

    ///
    crop(offsetX, offsetY, width, height) {
        this.img_.crop(offsetX, offsetY, width, height);
        return this;
    }

    /**
     * Set new image size. Doesn't strech image, just add more pixels
     * @param {Number} width
     * @param {Number} height
     */
    setSize(width, height) {
        const size = this.size();
        if(width <= size.width && height <= size.height) {
            return this.crop(0, 0, width, height);
        }

        this.img_.setSize(width, height);
        return this;
    }

    /**
     * Inserts image
     * @param {PngImg} img image to insert
     * @param {Number} offsetX
     * @param {Number} offsetY
     */
    insert(img, offsetX, offsetY) {
        if(!(img instanceof PngImg)) {
            throw new Error('Not a PngImg object');
        }

        const imgSize = img.size();
        const mySize = this.size();

        if(offsetX + imgSize.width > mySize.width || offsetY + imgSize.height > mySize.height) {
            throw new Error('Out of the bounds');
        }

        this.img_.insert(img.img_, offsetX, offsetY);
        return this;
    }

    /**
     * Rotates image 90 degrees clockwise
     */
    rotateRight() {
        this.img_.rotateRight();
        return this;
    }

    /**
     * Rotates image 90 degrees counterclockwise
     */
    rotateLeft() {
        this.img_.rotateLeft();
        return this;
    }

    /**
     * @param {PngImg}
     * @param {Object} rect – {top, left, width, height}
     */
    copyFrom(srcImg, rect) {
        for (let x = rect.left; x < rect.width; ++x) {
            for (let y = rect.top; y < rect.height; ++y) {
                const color = srcImg.get(x, y);

                this.set(x, y, color);
            }
        }

        return this;
    }

    /**
     * Save image to file
     * @param  {String}   file     path to file
     * @param  {SaveCallback} callback
     */
    save(file, callback) {
        this.img_.write(file, callback);
    }

    /**
     * @typedef {Function} SaveCallback
     * @param {String} error error message in case of fail
     */
};
