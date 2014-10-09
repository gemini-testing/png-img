#include "./PngImgAdapter.h"
#include "./SaveWorker.h"

#include <node_buffer.h>
#include <png.h>
#include <functional>
#include <iostream>

using namespace v8;

static Persistent<FunctionTemplate> pngImgAdapterConstructor;

///
void PngImgAdapter::Init() {
    Local<FunctionTemplate> tpl = FunctionTemplate::New(PngImgAdapter::New);
    pngImgAdapterConstructor = Persistent<FunctionTemplate>::New(tpl);

    tpl->SetClassName(String::New("PngImg"));
    tpl->InstanceTemplate()->SetInternalFieldCount(1);
    tpl->InstanceTemplate()->SetAccessor(String::New("width"), PngImgAdapter::Width);
    tpl->InstanceTemplate()->SetAccessor(String::New("height"), PngImgAdapter::Height);

    NODE_SET_PROTOTYPE_METHOD(tpl, "crop", PngImgAdapter::Crop);
    NODE_SET_PROTOTYPE_METHOD(tpl, "write", PngImgAdapter::Write);
}

///
Handle<Value> PngImgAdapter::NewInstance(const Arguments& args) {
    HandleScope scope;

    if(!args.IsConstructCall()) {
        return ThrowException(String::New("Cannot call constructor as function"));
    }

    if(args.Length() < 1) {
        return ThrowException(String::New("To few arguments"));
    }

    if(!node::Buffer::HasInstance(args[0])) {
        return ThrowException(String::New("First argument should be a buffer"));
    }

    Local<Object> imgBuffer = args[0].As<Object>();
    Handle<Value> argv[] = { imgBuffer };
    return pngImgAdapterConstructor->GetFunction()->NewInstance(1, argv);
}

///
Handle<Value> PngImgAdapter::New(const Arguments& args) {
    HandleScope scope;

    Local<Object> imgBuffer = args[0].As<Object>();
    const char* buf = node::Buffer::Data(imgBuffer);
    const size_t bufLen = node::Buffer::Length(imgBuffer);

    const size_t SIG_LEN = 8;
    if(bufLen < SIG_LEN || png_sig_cmp((png_const_bytep)buf, 0, SIG_LEN)) {
        return ThrowException(String::New("Not a PNG"));
    }

    PngImgAdapter* obj = new PngImgAdapter(buf, bufLen);
    obj->Wrap(args.This());

    return scope.Close(args.This());
}

///
Local<Number> GetProperty(const AccessorInfo& info, std::function<unsigned(const PngImgAdapter&)> getter) {
    HandleScope scope;
    PngImgAdapter* img = node::ObjectWrap::Unwrap<PngImgAdapter>(info.Holder());
    return scope.Close(Number::New(getter(*img)));
}

///
Handle<Value> PngImgAdapter::Width(Local<String>, const AccessorInfo& info) {
    return GetProperty(info, [](const PngImgAdapter& adapter) { return adapter.img_.Width(); });
}

///
Handle<Value> PngImgAdapter::Height(Local<String>, const AccessorInfo& info) {
    return GetProperty(info, [](const PngImgAdapter& adapter) { return adapter.img_.Height(); });
}

///
Handle<Value> PngImgAdapter::Crop(const Arguments& args) {
    HandleScope scope;

    PngImg& img = node::ObjectWrap::Unwrap<PngImgAdapter>(args.This())->img_;
    const bool ok = img.Crop(
        args[0]->Uint32Value(),
        args[1]->Uint32Value(),
        args[2]->Uint32Value(),
        args[3]->Uint32Value()
    );

    if(!ok) {
        return ThrowException(String::New(img.LastError().c_str()));
    }

    return Undefined();
}

///
Handle<Value> PngImgAdapter::Write(const Arguments& args) {
    HandleScope scope;

    PngImg& img = node::ObjectWrap::Unwrap<PngImgAdapter>(args.This())->img_;
    Local<String> file = args[0].As<String>();
    NanCallback* callback = new NanCallback(args[1].As<Function>());

    NanAsyncQueueWorker(new SaveWorker(callback, img, *v8::String::Utf8Value(file)));
    return Undefined();
}
