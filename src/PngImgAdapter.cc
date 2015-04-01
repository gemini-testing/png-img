#include "./PngImgAdapter.h"
#include "./SaveWorker.h"

#include <node_buffer.h>
#include <png.h>

using namespace v8;
using namespace std;

static Persistent<FunctionTemplate> pngImgAdapterConstructor;

///
void PngImgAdapter::Init() {
    Local<FunctionTemplate> tpl = NanNew<FunctionTemplate>(PngImgAdapter::New);
    NanAssignPersistent(pngImgAdapterConstructor, tpl);

    tpl->SetClassName(NanNew<String>("PngImg"));
    tpl->InstanceTemplate()->SetInternalFieldCount(1);
    tpl->InstanceTemplate()->SetAccessor(NanNew<String>("width"), PngImgAdapter::Width);
    tpl->InstanceTemplate()->SetAccessor(NanNew<String>("height"), PngImgAdapter::Height);

    NODE_SET_PROTOTYPE_METHOD(tpl, "get", PngImgAdapter::Get);
    NODE_SET_PROTOTYPE_METHOD(tpl, "fill", PngImgAdapter::Fill);
    NODE_SET_PROTOTYPE_METHOD(tpl, "crop", PngImgAdapter::Crop);
    NODE_SET_PROTOTYPE_METHOD(tpl, "write", PngImgAdapter::Write);
}

///
NAN_METHOD(PngImgAdapter::NewInstance) {
    NanScope();

    if(!args.IsConstructCall()) {
        return NanThrowError("Cannot call constructor as function");
    }

    if(args.Length() < 1) {
        return NanThrowError("To few arguments");
    }

    if(!node::Buffer::HasInstance(args[0])) {
        return NanThrowError("First argument should be a buffer");
    }

    Local<Object> imgBuffer = args[0].As<Object>();
    Handle<Value> argv[] = { imgBuffer };

    Local<FunctionTemplate> constructorHandle = NanNew(pngImgAdapterConstructor);
    NanReturnValue(constructorHandle->GetFunction()->NewInstance(1, argv));
}

///
NAN_METHOD(PngImgAdapter::New) {
    NanScope();

    Local<Object> imgBuffer = args[0].As<Object>();
    const char* buf = node::Buffer::Data(imgBuffer);
    const size_t bufLen = node::Buffer::Length(imgBuffer);

    const size_t SIG_LEN = 8;
    if(bufLen < SIG_LEN || png_sig_cmp((png_const_bytep)buf, 0, SIG_LEN)) {
        return NanThrowError("Not a PNG");
    }

    PngImgAdapter* obj = new PngImgAdapter(buf, bufLen);
    obj->Wrap(args.This());

    NanReturnThis();
}

///
NAN_PROPERTY_GETTER(PngImgAdapter::Width) {
    NanScope();
    NanReturnValue(NanNew<Number>(GetObj(args)->img_.Width()));
}

///
NAN_PROPERTY_GETTER(PngImgAdapter::Height) {
    NanScope();
    NanReturnValue(NanNew<Number>(GetObj(args)->img_.Height()));
}

///
NAN_METHOD(PngImgAdapter::Get) {
    NanScope();

    PngImg& img = GetObj(args)->img_;
    auto pPxl = img.Get(args[0]->Uint32Value(), args[1]->Uint32Value());
    if(!pPxl) {
       return NanThrowError(img.LastError().c_str());
    }

    Local<Object> obj = NanNew<Object>();
    obj->Set(NanNew<String>("r"), NanNew<Number>(pPxl->r));
    obj->Set(NanNew<String>("g"), NanNew<Number>(pPxl->g));
    obj->Set(NanNew<String>("b"), NanNew<Number>(pPxl->b));
    obj->Set(NanNew<String>("a"), NanNew<Number>(pPxl->a));

    NanReturnValue(obj);
}

///
Pxl RGBObjToPxl(const Local<Object>& obj) {
    NanScope();

    auto getIntVal_ = [&obj](const string& key) {
        String::Utf8Value val(obj->Get(NanNew<String>(key.c_str())));
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
NAN_METHOD(PngImgAdapter::Fill) {
    NanScope();

    PngImg& img = GetObj(args)->img_;
    const bool ok = img.Fill(
        args[0]->Uint32Value(),
        args[1]->Uint32Value(),
        args[2]->Uint32Value(),
        args[3]->Uint32Value(),
        RGBObjToPxl(args[4].As<Object>())
    );
    if(!ok) {
        return NanThrowError(img.LastError().c_str());
    }

    NanReturnUndefined();
}

///
NAN_METHOD(PngImgAdapter::Crop) {
    NanScope();

    PngImg& img = GetObj(args)->img_;
    const bool ok = img.Crop(
        args[0]->Uint32Value(),
        args[1]->Uint32Value(),
        args[2]->Uint32Value(),
        args[3]->Uint32Value()
    );
    if(!ok) {
        return NanThrowError(img.LastError().c_str());
    }

    NanReturnUndefined();
}

///
NAN_METHOD(PngImgAdapter::Write) {
    NanScope();

    PngImg& img = GetObj(args)->img_;
    Local<String> file = args[0].As<String>();
    NanCallback* callback = new NanCallback(args[1].As<Function>());

    NanAsyncQueueWorker(new SaveWorker(callback, img, *v8::String::Utf8Value(file)));
    NanReturnUndefined();
}

///
template <class T>
PngImgAdapter* PngImgAdapter::GetObj(const T& args) {
    return node::ObjectWrap::Unwrap<PngImgAdapter>(args.Holder());
}

