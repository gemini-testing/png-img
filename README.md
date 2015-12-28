png-img
=======

[![Build Status](https://travis-ci.org/gemini-testing/png-img.svg)](https://travis-ci.org/gemini-testing/png-img)

Liteweight png image processing library.

**Note**: since `v2.0.0` this lib based on [pngjs2](https://github.com/lukeapage/pngjs) and doesn't build any native modules.

## Installation
```
npm install png-img
```

## API
### PngImg.fromBuffer(buffer, cb)
Create `PngImg` object from passed buffer with image.

Arguments:
 * `buf` - `Buffer` with image file content
 * `cb` - callback. Will be called when image will be parsed
```js
var fs = require('fs'),
    PngImg = require('png-img');

var buf = fs.readFileSync('path/to/img.png');

PngImg.fromBuffer(buf, function(err, img) {
  if (err) {
    console.error(err);
  } else {
    // Use `img`
  }
});
```

### size()
Get image size as an object.
```js
console.log(img.size());
```
for 32x32 image will print out:
```
{ width: 32, height: 32 }
```

### get(x, y)
Get pixel color and alpha.

Returns object:
 * r: red channel (0 to 255)
 * g: green channel (0 to 255)
 * b: blue channel (0 to 255)
 * a: alpha (0 to 255). 0 - transparent

```js
console.log(img.get(0, 0));
```
will print pixel and color for pixel (0, 0):
```js
{
  r: 100,
  g: 150,
  b: 200,
  a: 255
}
```

### fill(offsetX, offsetY, widht, height, color)
Fill region with passed color. Modifies current image.

Arguments:
 * `offsetX` - horizontal offset from the left side of the image
 * `offsetY` - vertical offset from the top side of the image
 * `width` - region width
 * `height` - region height
 * `color` - color as {r,g,b,a} object or as a '#XXXXXX' string

Returns: current image object

Throws if region is not inside the current image
```js
img
  .fill(0, 0, 16, 16, '#00ffFF') // fill with cyan
  .fill(16, 16, 16, 16, {r: 0, g: 255, b: 255, a: 127}); // fill with half-transparent cyan
```

### set(x, y, color)
Same as `fill(x, y, 1, 1, color)`

### crop(offsetX, offsetY, widht, height)
Crop image. Modifies current image.

Arguments:
 * `offsetX` - horizontal offset from the left side of the image
 * `offsetY` - vertical offset from the top side of the image
 * `width` - new width
 * `height` - new height

Returns: current image object

Throws if new image is not inside the current image.
```js
img
    .crop(0, 0, 16, 16)
    .crop(8, 8, 8, 8);
```

### save(file, callback)
Save image to file. Asynchronous operation.

Arguments:
 * `file` - path to file to save image
 * `callback` - function with one argument (`error`). Will be called after save operation finish or on error.

Overwrites existing file.

```js
img.save('path/to/file.png', function(error) {
    if(error) {
        console.error('Error:', error);
    } else {
        console.log('OK');
    }
});
```
