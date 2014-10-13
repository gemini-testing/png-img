{
  "variables": {
    "src_dir": "../src",
    "arch": "<!(node -e 'console.log(process.arch);')",
    "libpng": "<!(pwd)/libpng/$${BUILD_ARCH:-<(arch)}"
  },
  "targets": [
    {
      "target_name": "png_img",
      "sources": [
        "<(src_dir)/init.cc",
        "<(src_dir)/PngImgAdapter.cc",
        "<(src_dir)/PngImg.cc"
      ],
      "include_dirs": [
        "<!(node -e \"require('nan')\")",
        "<(libpng)/include"
      ],
      "libraries": ["<(libpng)/lib/libpng.a"],
      "conditions": [
          [ "OS=='mac'", {
              "xcode_settings": {
                  "OTHER_CPLUSPLUSFLAGS" : ["-std=c++11", "-stdlib=libc++"],
                  "OTHER_LDFLAGS": ["-stdlib=libc++"],
                  "MACOSX_DEPLOYMENT_TARGET": "10.7"
              }
          }],
          [ "OS=='linux'", {
              "cflags": ["-std=c++11"]
          }]
      ]
    }
  ]
}
