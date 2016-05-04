var Benchmark = require('benchmark'),
    fs = require('fs'),
    pngjs2 = require('./index'),
    NativePngImg = require('../png-img-native');

var suite = new Benchmark.Suite(),
    rawImg = fs.readFileSync('./test.png');

// add tests
suite.add('Native module', {
    defer: true,
    fn: function(deferred) {
        var img = new NativePngImg(rawImg);
        img.crop(100, 100, 640, 512);
        img.save('native.png', function(err) {
            if (err) {
                console.error(err);
            }
            deferred.resolve();
        });
    }
})
.add('pngjs2', {
    defer: true,
    fn: function(deferred) {
        pngjs2.fromBuffer(rawImg, function(err, img) {
            if(err) {
                deferred.reject();
                return;
            }

            img.crop(100, 100, 640, 512);
            img.save('pngjs2.png', function(err) {
                if (err) {
                    console.error(err);
                }
                deferred.resolve();
            });
        });
    }
})
// add listeners
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
})
// run async
.run({ 'async': true });
