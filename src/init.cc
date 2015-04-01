#include <nan.h>
#include "./PngImgAdapter.h"

using namespace v8;

///
void InitAll(Handle<Object> exports) {
    PngImgAdapter::Init();

    exports->Set(NanNew<String>("PngImg"), NanNew<FunctionTemplate>(PngImgAdapter::NewInstance)->GetFunction());
}

NODE_MODULE(png_img, InitAll)
