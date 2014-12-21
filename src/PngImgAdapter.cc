#include "./PngImgAdapter.h"
#include "./SaveWorker.h"

#include <node_buffer.h>
#include <png.h>

using namespace v8;
using namespace std;

static Persistent<FunctionTemplate> pngImgAdapterConstructor;

///
void PngImgAdapter::Init() {
    Local<FunctionTemplate> tpl = FunctionTemplate::New(PngImgAdapter::New);
    pngImgAdapterConstructor = Persistent<FunctionTemplate>::New(tpl);

    tpl->SetClassName(String::New("PngImg"));
    tpl->InstanceTemplate()->SetInternalFieldCount(1);
    tpl->InstanceTemplate()->SetAccessor(String::New("width"), PngImgAdapter::Width);
    tpl->InstanceTemplate()->SetAccessor(String::New("height"), PngImgAdapter::Height);

    NODE_SET_PROTOTYPE_METHOD(tpl, "get", PngImgAdapter::Get);
    NODE_SET_PROTOTYPE_METHOD(tpl, "fill", PngImgAdapter::Fill);
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
Handle<Value> PngImgAdapter::Width(Local<String>, const AccessorInfo& info) {
    return GetProperty(info, [](const PngImg& img) { return img.Width(); });
}

///
Handle<Value> PngImgAdapter::Height(Local<String>, const AccessorInfo& info) {
    return GetProperty(info, [](const PngImg& img) { return img.Height(); });
}

///
Local<Number> PngImgAdapter::GetProperty(const AccessorInfo& info, function<unsigned(const PngImg&)> getter) {
    HandleScope scope;
    PngImg& img = node::ObjectWrap::Unwrap<PngImgAdapter>(info.Holder())->img_;
    return scope.Close(Number::New(getter(img)));
}

///
Handle<Value> PngImgAdapter::Get(const Arguments& args) {
    HandleScope scope;

    PngImg& img = node::ObjectWrap::Unwrap<PngImgAdapter>(args.This())->img_;
    auto pPxl = img.Get(args[0]->Uint32Value(), args[1]->Uint32Value());
    if(!pPxl) {
       return ThrowException(String::New(img.LastError().c_str()));
    }

    Local<Object> obj = Object::New();
    obj->Set(String::NewSymbol("r"), Number::New(pPxl->r));
    obj->Set(String::NewSymbol("g"), Number::New(pPxl->g));
    obj->Set(String::NewSymbol("b"), Number::New(pPxl->b));
    obj->Set(String::NewSymbol("a"), Number::New(pPxl->a));

    return scope.Close(obj);
}

///
Pxl RGBObjToPxl(const Local<Object>& obj) {
    HandleScope scope;

    auto getIntVal_ = [&obj](const string& key) {
        String::Utf8Value val(obj->Get(String::NewSymbol(key.c_str())));
        return stoi(*val);
    };

    Pxl pxl;
    pxl.r = getIntVal_("r");
    pxl.g = getIntVal_("g");
    pxl.b = getIntVal_("b");
    pxl.a = getIntVal_("a");
    return pxl;
}

///
Handle<Value> PngImgAdapter::Fill(const Arguments& args) {
    return Call(args, [&args](PngImg& img) {
        return img.Fill(
            args[0]->Uint32Value(),
            args[1]->Uint32Value(),
            args[2]->Uint32Value(),
            args[3]->Uint32Value(),
            RGBObjToPxl(args[4].As<Object>())
        );
    });
}

///
Handle<Value> PngImgAdapter::Crop(const Arguments& args) {
    return Call(args, [&args](PngImg& img) {
        return img.Crop(
            args[0]->Uint32Value(),
            args[1]->Uint32Value(),
            args[2]->Uint32Value(),
            args[3]->Uint32Value()
        );
    });
}

///
Handle<Value> PngImgAdapter::Call(const Arguments& args, function<bool(PngImg&)> fn) {
    HandleScope scope;

    PngImg& img = node::ObjectWrap::Unwrap<PngImgAdapter>(args.This())->img_;
    const bool ok = fn(img);
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
