#include <nan.h>
#include "./PngImgAdapter.h"

using namespace v8;
using namespace Nan;

///
NAN_MODULE_INIT(InitAll) {
    PngImgAdapter::Init();
    Nan::Set(
        target,
        New<String>("PngImg").ToLocalChecked(),
        Nan::GetFunction(New<FunctionTemplate>(PngImgAdapter::NewInstance)).ToLocalChecked()
    );
}

NODE_MODULE(png_img, InitAll)
