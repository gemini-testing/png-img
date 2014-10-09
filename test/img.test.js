'use strict';

var PngImg = require('../');

describe('constructor', function() {
    it('should throw if not a buffer passed', function() {
        (function() {
            return new PngImg({});
        }.must.throw());
    });

    it('should throw if bad buffer passed', function() {
        (function() {
            return new PngImg(new Buffer({}));
        }).must.throw();
    });
});
