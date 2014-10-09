#include <node.h>
#include "./PngImgAdapter.h"

using namespace v8;

///
void InitAll(Handle<Object> exports) {
    PngImgAdapter::Init();

    exports->Set(String::New("PngImg"), FunctionTemplate::New(PngImgAdapter::NewInstance)->GetFunction());
}

NODE_MODULE(png_img, InitAll)
