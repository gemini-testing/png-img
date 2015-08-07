#include <nan.h>
#include "./PngImgAdapter.h"

using namespace v8;
using namespace Nan;

///
NAN_MODULE_INIT(InitAll) {
    PngImgAdapter::Init();
    Set(target, New<String>("PngImg").ToLocalChecked(), New<FunctionTemplate>(PngImgAdapter::NewInstance)->GetFunction());
}

NODE_MODULE(png_img, InitAll)
