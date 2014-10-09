{
  "targets": [
    {
      "target_name": "png_img",
      "sources": [
        "src/init.cc",
        "src/PngImgAdapter.cc",
        "src/PngImg.cc"
      ],
      "include_dirs": ["<!(node -e \"require('nan')\")"],
      "libraries": ["-lpng"],
      "conditions": [
          [ "OS==\"mac\"", {
              "xcode_settings": {
                  "OTHER_CPLUSPLUSFLAGS" : ["-std=c++11","-stdlib=libc++"],
                  "OTHER_LDFLAGS": ["-stdlib=libc++"],
                  "MACOSX_DEPLOYMENT_TARGET": "10.7"
              }
          }]
      ]
    }
  ]
}
