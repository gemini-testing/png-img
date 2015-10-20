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
                "MACOSX_DEPLOYMENT_TARGET": "10.7"
            }
        }],
        [ "OS=='linux'", {
            "cflags": ["-std=c++0x"]
        }],
        [ "OS=='win'", {
          "msvs_settings": {
            "VCCLCompilerTool": {
              "AdditionalOptions": ["/EHsc", "/wd4506"]
            },
            "VCLinkerTool": {
              "GenerateDebugInformation": "false" # Avoid 'incorrect MSPDB120.DLL version' link error
            }
          }
        }]
      ]
    },
    {
      "target_name": "move_module",
      "type": "none",
      "dependencies": [ "<(module_name)" ],
      "copies": [
        {
          "files": [ "<(PRODUCT_DIR)/<(module_name).node" ],
          "destination": "<(module_path)"
        }
      ]
    }
  ]
}
