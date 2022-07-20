#include <napi.h>
#include "./PngImgAdapter.h"

///
Napi::Object InitAll(Napi::Env env, Napi::Object exports) {
    exports.Set(
        "PngImg",
        PngImgAdapter::Init(env)
    );
    return exports;
}

NODE_API_MODULE(png_img, InitAll)
