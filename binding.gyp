{
  "variables": {
    "src_dir": "./src"
  },
  "targets": [
    {
      "target_name": "png_img",
      "sources": [
        "<(src_dir)/init.cc",
        "<(src_dir)/PngImgAdapter.cc",
        "<(src_dir)/PngImg.cc"
      ],
      "cflags!": [ "-fno-exceptions" ],
      "cflags_cc!": [ "-fno-exceptions" ],
      "include_dirs": [
        "<!(node -e \"require('nan')\")",
      ],
      "dependencies": [
        "./third_party/libpng/libpng.gyp:libpng"
      ],
      "conditions": [
        [ "OS=='mac'", {
            "xcode_settings": {
                "OTHER_CPLUSPLUSFLAGS" : ["-std=c++11", "-stdlib=libc++"],
                "OTHER_LDFLAGS": ["-stdlib=libc++"],
                "MACOSX_DEPLOYMENT_TARGET": "10.7",
                "GCC_ENABLE_CPP_EXCEPTIONS": "YES"
            }
        }],
        [ "OS=='linux'", {
            "cflags": ["-std=c++0x"]
        }],
        [ "OS=='win'", {
          "msvs_settings": {
            "VCCLCompilerTool": {
              "ExceptionHandling": 1,
              "AdditionalOptions": ["/wd4506"]
            },
            "VCLinkerTool": {
              "GenerateDebugInformation": "false" # Avoid 'incorrect MSPDB120.DLL version' link error
            }
          }
        }]
      ]
    }
  ]
}
