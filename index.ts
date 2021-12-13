//@ts-expect-error
import { PngImg as PngImgImpl } from './build/Release/png_img';
import * as utils from './utils';

import type { SaveCallback, Size, Color } from './types';
export type { SaveCallback, Size, Color };

export default class PngImg {
    private img_: PngImgImpl;

    /**
     * Create PngImg object from passed buffer with image
     */
    constructor(rawImg: Buffer) {
        this.img_ = new PngImgImpl(rawImg);
    }

    /**
     * Get image size as an object.
     */
    public size(): Size {
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
    public get(x: number, y: number): Color {
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
    public set(x: number, y: number, color: Color | string): this {
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
    public fill(offsetX: number, offsetY: number, width: number, height: number, color: Color | string): this {
        if(typeof color === 'string') {
            const objColor = utils.stringToRGBA(color);

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

    /**
     * Crop image. Modifies current image.
     * Throws if new image is not inside the current image.
     * @param offsetX offset from left side of the image
     * @param offsetY offset from top side of the image
     */
    public crop(offsetX: number, offsetY: number, width: number, height: number): this {
        this.img_.crop(offsetX, offsetY, width, height);

        return this;
    }

    /**
     * Sets new image size. Modifies current image.
     * If new size is less or equal than current size, than crop will be performed.
     */
    public setSize(width: number, height: number): this {
        const size = this.size();

        if(width <= size.width && height <= size.height) {
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
    public insert(img: PngImg, offsetX: number, offsetY: number): this {
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
    public rotateRight(): this {
        this.img_.rotateRight();

        return this;
    }

    /**
     * Rotates image 90 degrees counterclockwise
     */
    public rotateLeft(): this {
        this.img_.rotateLeft();

        return this;
    }

    /**
     * Save image to file. Asynchronous operation.
     * @param file - path to file to save image
     * @param callback - will be called after save operation finish or on error
     */
    public save(file: string, callback: SaveCallback): void {
        this.img_.write(file, callback);
    }
};
