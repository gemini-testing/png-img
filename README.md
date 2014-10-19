png-img
=======

Lite self-contained png image processing library for OS X and Linux.

## Installation
```
npm install png-img
```

## API
### new PngImg(buffer)
Create `PngImg` object from passed buffer with image.

Arguments:
 * `buf` - `Buffer` with image file content.
```js
var fs = require('fs'),
    PngImg = require('png-img');

var buf = fs.readFileSync('path/to/img.png'),
    img = new PngImg(buf);
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


## Dev environment setup
Linux: Depends on GCC 4.7 or later

OS X: Tested with Xcode 6.0 development tools (but should be ok with Xcode 5.0 also)

```
npm run env-setup
```
This will install and build all necessary stuff

## Build
```
npm run build
```
This will build native node extension and place it to the `compiled` directory

