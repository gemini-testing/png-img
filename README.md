png-img
=======

[![Build Status](https://travis-ci.org/gemini-testing/png-img.svg)](https://travis-ci.org/gemini-testing/png-img)

Lite self-contained png image processing library for macOS and Linux.

## Requirements
### Linux
- Depends on [GCC](https://gcc.gnu.org/) 4.6+

### macOs
- Tested with Xcode 6.0 (but should also work with 5.0) and Xcode 11.3
- [`node-gyp` installation docs](https://github.com/nodejs/node-gyp#on-macos)
- [`node-gyp` installation docs for Calalina](https://github.com/nodejs/node-gyp/blob/master/macOS_Catalina.md)

### Windows
- Tested with MSVC 2013 Express
- [`node-gyp` installation docs](https://github.com/nodejs/node-gyp#on-windows)

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
const fs = require('fs');
const {PngImg} = require('png-img');

const buf = fs.readFileSync('path/to/img.png');
const img = new PngImg(buf);
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

### setSize(width, height)
Sets new image size. Modifies current image.

Arguments:
 * `width` - new width
 * `height` - new height

Returns: current image object

If new size is less or equal than current size, than `crop` will be performed.

**Note**: this method doesn't strech current image, it just sets new size. If new dimension is less than previous
than image will be cut. If new dimension is greater than previous than image will be extended with black area.
```js
var size = img.size();
img
  .setSize(size.width/2, size.height*2);
```

### insert(img, offsetX, offsetY)
Inserts image into specified place.

Arguments:
 * `img` - image to insert. Should be a PngImg object
 * `offsetX` - horizontal offset from the left side of the image
 * `offsetY` - vertical offset from the top side of the image

Join to images (pretend that they have same witdh):
 ```js
var otherImg = new PngImg(/*...*/)
img
  .setSize(img.size().width, img.size().height + otherImg.size().height)
  .insert(otherImg, 0, img.size().height);
 ```

### rotateRight()
Rotates image 90 degrees clockwise

### rotateLeft()
Rotates image 90 degress counterclockwise

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

## Build
```
npm run build
```
This will build native node extension and place it to the `compiled` directory

## Release
1. Up version in package json, create tag, and push it to repo. **Note**: Do not publish the package.
```
$ npm version <patch|minor|major>
$ git push && git push --tags
```
2. Go to [tags page](https://github.com/gemini-testing/png-img/tags) and create release from pushed tag.
3. Wait for the release workflow to finish. See the [actions page](https://github.com/gemini-testing/png-img/actions) to find the workflow.

## Vagrant
Use [Vagrant](https://www.vagrantup.com/) to build and test on Linux and Windows from macOS.

Tested with Vagrant 1.7 and [VirtualBox](https://www.virtualbox.org/) 4.3.

1. Install Vagrant and VirtualBox.
2. Create Windows vagrant box (see [howto](dev/vagrant-win-box.md))
3. Run `vagrant up --provider virtualbox`
4. Specify `OS` env variable to run and test on specific platform:
  - `npm run build`, `npm test` - current platform
  - `OS=linux npm test` - [Ubuntu](https://ubuntu.com/) 14.04
  - `OS=linux-old npm test` - Ubuntu 12.04
  - `OS=win npm test` - Windows
  - `OS=all npm test` - all
