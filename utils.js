'use strict';

/**
 * @param {Object} rgb object {r:Number, g:Number, b:Number}
 * @return {String} '#XXXXXX' string
 */
exports.RGBToString = function(rgb) {
    return '#' + toStr_(rgb.r) + toStr_(rgb.g) + toStr_(rgb.b);

    ///
    function toStr_(n, minLen) {
        var str = n.toString(16);
        return str.length < 2 ? '0' + str : str;
    }
};

/**
 * @param {String} string '#XXXXXX' string
 * @return {Object} rgb object {r:Number, g:Number, b:Number}
 */
exports.StringToRGBA = function(string) {
    var match = string.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
    if(!match) {
        return null;
    }

    return {
        r: parseInt(match[1], 16),
        g: parseInt(match[2], 16),
        b: parseInt(match[3], 16),
        a: 255
    };
};
