/// <reference types="node" />
import type { SaveCallback, Size, Color } from './types';
export type { SaveCallback, Size, Color };
export default class PngImg {
    private img_;
    /**
     * Create PngImg object from passed buffer with image
     */
    constructor(rawImg: Buffer);
    /**
     * Get image size as an object.
     */
    size(): Size;
    /**
     * Get pixel color and alpha.
     * @param x x coordinate (left to right)
     * @param y y coordinate (top to bottom)
     */
    get(x: number, y: number): Color;
    /**
     * Set pixel color
     * Same as fill(x, y, 1, 1, color)
     * (shorthand)
     * @param x x coordinate (left to right)
     * @param y y coordinate (top to bottom)
     * @param color color as rgb object or as a '#XXXXXX' string
     */
    set(x: number, y: number, color: Color | string): this;
    /**
     * Fill region with passed color. Modifies current image.
     * @param offsetX offset from left side of the image
     * @param offsetY offset from top side of the image
     * @param x x coordinate (left to right)
     * @param y y coordinate (top to bottom)
     * @param color color as rgb object or as a '#XXXXXX' string
     */
    fill(offsetX: number, offsetY: number, width: number, height: number, color: Color | string): this;
    /**
     * Crop image. Modifies current image.
     * Throws if new image is not inside the current image.
     * @param offsetX offset from left side of the image
     * @param offsetY offset from top side of the image
     */
    crop(offsetX: number, offsetY: number, width: number, height: number): this;
    /**
     * Sets new image size. Modifies current image.
     * If new size is less or equal than current size, than crop will be performed.
     */
    setSize(width: number, height: number): this;
    /**
     * Inserts image into specified place.
     * @param img image to insert
     * @param offsetX offset from left side of the image
     * @param offsetY offset from top side of the image
     */
    insert(img: PngImg, offsetX: number, offsetY: number): this;
    /**
     * Rotates image 90 degrees clockwise
     */
    rotateRight(): this;
    /**
     * Rotates image 90 degrees counterclockwise
     */
    rotateLeft(): this;
    /**
     * Save image to file. Asynchronous operation.
     * @param file - path to file to save image
     * @param callback - will be called after save operation finish or on error
     */
    save(file: string, callback: SaveCallback): void;
}
