"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringToRGBA = exports.RGBToString = void 0;
function RGBToString(rgb) {
    return '#' + toStr_(rgb.r) + toStr_(rgb.g) + toStr_(rgb.b);
    ///
    function toStr_(n) {
        const str = n.toString(16);
        return str.length < 2 ? '0' + str : str;
    }
}
exports.RGBToString = RGBToString;
;
function stringToRGBA(string) {
    const match = string.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
    if (!match) {
        return null;
    }
    return {
        r: parseInt(match[1], 16),
        g: parseInt(match[2], 16),
        b: parseInt(match[3], 16),
        a: 255
    };
}
exports.stringToRGBA = stringToRGBA;
;
