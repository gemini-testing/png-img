"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-expect-error
const png_img_1 = require("./build/Release/png_img");
const utils = __importStar(require("./utils"));
class PngImg {
    /**
     * Create PngImg object from passed buffer with image
     */
    constructor(rawImg) {
        this.img_ = new png_img_1.PngImg(rawImg);
    }
    /**
     * Get image size as an object.
     */
    size() {
        return {
            width: this.img_.width,
            height: this.img_.height
        };
    }
    /**
     * Get pixel color and alpha.
     * @param x x coordinate (left to right)
     * @param y y coordinate (top to bottom)
     */
    get(x, y) {
        return this.img_.get(x, y);
    }
    /**
     * Set pixel color
     * Same as fill(x, y, 1, 1, color)
     * (shorthand)
     * @param x x coordinate (left to right)
     * @param y y coordinate (top to bottom)
     * @param color color as rgb object or as a '#XXXXXX' string
     */
    set(x, y, color) {
        return this.fill(x, y, 1, 1, color);
    }
    /**
     * Fill region with passed color. Modifies current image.
     * @param offsetX offset from left side of the image
     * @param offsetY offset from top side of the image
     * @param x x coordinate (left to right)
     * @param y y coordinate (top to bottom)
     * @param color color as rgb object or as a '#XXXXXX' string
     */
    fill(offsetX, offsetY, width, height, color) {
        if (typeof color === 'string') {
            const objColor = utils.stringToRGBA(color);
            if (!objColor) {
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
    /**
     * Crop image. Modifies current image.
     * Throws if new image is not inside the current image.
     * @param offsetX offset from left side of the image
     * @param offsetY offset from top side of the image
     */
    crop(offsetX, offsetY, width, height) {
        this.img_.crop(offsetX, offsetY, width, height);
        return this;
    }
    /**
     * Sets new image size. Modifies current image.
     * If new size is less or equal than current size, than crop will be performed.
     */
    setSize(width, height) {
        const size = this.size();
        if (width <= size.width && height <= size.height) {
            return this.crop(0, 0, width, height);
        }
        this.img_.setSize(width, height);
        return this;
    }
    /**
     * Inserts image into specified place.
     * @param img image to insert
     * @param offsetX offset from left side of the image
     * @param offsetY offset from top side of the image
     */
    insert(img, offsetX, offsetY) {
        if (!(img instanceof PngImg)) {
            throw new Error('Not a PngImg object');
        }
        const imgSize = img.size();
        const mySize = this.size();
        if (offsetX + imgSize.width > mySize.width || offsetY + imgSize.height > mySize.height) {
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
     * Save image to file. Asynchronous operation.
     * @param file - path to file to save image
     * @param callback - will be called after save operation finish or on error
     */
    save(file, callback) {
        this.img_.write(file, callback);
    }
}
exports.default = PngImg;
;
