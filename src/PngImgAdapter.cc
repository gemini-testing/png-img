#include "./PngImgAdapter.h"
#include "./SaveWorker.h"

#include <node_buffer.h>
#include <png.h>

using namespace v8;
using namespace std;
using namespace Nan;

static Nan::Persistent<FunctionTemplate> pngImgAdapterConstructor;

///
void PngImgAdapter::Init() {
    Local<FunctionTemplate> tpl = Nan::New<FunctionTemplate>(PngImgAdapter::New);

    tpl->SetClassName(Nan::New<String>("PngImg").ToLocalChecked());
    tpl->InstanceTemplate()->SetInternalFieldCount(1);

    SetAccessor(tpl->InstanceTemplate(), Nan::New<String>("width").ToLocalChecked(), PngImgAdapter::Width);
    SetAccessor(tpl->InstanceTemplate(), Nan::New<String>("height").ToLocalChecked(), PngImgAdapter::Height);

    SetPrototypeMethod(tpl, "get", PngImgAdapter::Get);
    SetPrototypeMethod(tpl, "fill", PngImgAdapter::Fill);
    SetPrototypeMethod(tpl, "crop", PngImgAdapter::Crop);
    SetPrototypeMethod(tpl, "setSize", PngImgAdapter::SetSize);
    SetPrototypeMethod(tpl, "insert", PngImgAdapter::Insert);
    SetPrototypeMethod(tpl, "rotateRight", PngImgAdapter::RotateRight);
    SetPrototypeMethod(tpl, "rotateLeft", PngImgAdapter::RotateLeft);
    SetPrototypeMethod(tpl, "write", PngImgAdapter::Write);

    pngImgAdapterConstructor.Reset(tpl);
}

///
NAN_METHOD(PngImgAdapter::NewInstance) {
    if(!info.IsConstructCall()) {
        return ThrowError("Cannot call constructor as function");
    }

    if(info.Length() < 1) {
        return ThrowError("To few arguments");
    }

    if(!node::Buffer::HasInstance(info[0])) {
        return ThrowError("First argument should be a buffer");
    }

    Local<FunctionTemplate> constructorHandle = Nan::New(pngImgAdapterConstructor);
    Local<Object> imgBuffer = info[0].As<Object>();
    Handle<Value> argv[] = { imgBuffer };
    info.GetReturnValue().Set(constructorHandle->GetFunction()->NewInstance(1, argv));
}

///
NAN_METHOD(PngImgAdapter::New) {
    Local<Object> imgBuffer = info[0].As<Object>();
    const char* buf = node::Buffer::Data(imgBuffer);
    const size_t bufLen = node::Buffer::Length(imgBuffer);

    const size_t SIG_LEN = 8;
    if(bufLen < SIG_LEN || png_sig_cmp((png_const_bytep)buf, 0, SIG_LEN)) {
        return ThrowError("Not a PNG");
    }

    PngImgAdapter* obj = new PngImgAdapter(buf, bufLen);
    obj->Wrap(info.This());

    info.GetReturnValue().Set(info.This());
}

///
NAN_PROPERTY_GETTER(PngImgAdapter::Width) {
    info.GetReturnValue().Set(Nan::New<Number>(GetObj(info)->img_.Width()));
}

///
NAN_PROPERTY_GETTER(PngImgAdapter::Height) {
    info.GetReturnValue().Set(Nan::New<Number>(GetObj(info)->img_.Height()));
}

///
NAN_METHOD(PngImgAdapter::Get) {
    PngImg& img = GetObj(info)->img_;
    auto pPxl = img.Get(info[0]->Uint32Value(), info[1]->Uint32Value());
    if(!pPxl) {
       return ThrowError(img.LastError().c_str());
    }

    Local<Object> obj = Nan::New<Object>();
    obj->Set(Nan::New<String>("r").ToLocalChecked(), Nan::New<Number>(pPxl->r));
    obj->Set(Nan::New<String>("g").ToLocalChecked(), Nan::New<Number>(pPxl->g));
    obj->Set(Nan::New<String>("b").ToLocalChecked(), Nan::New<Number>(pPxl->b));
    obj->Set(Nan::New<String>("a").ToLocalChecked(), Nan::New<Number>(pPxl->a));

    info.GetReturnValue().Set(obj);
}

///
Pxl RGBObjToPxl(const Local<Object>& obj) {
    auto getIntVal_ = [&obj](const string& key) {
        String::Utf8Value val(obj->Get(Nan::New<String>(key.c_str()).ToLocalChecked()));
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
    PngImg& img = GetObj(info)->img_;
    const bool ok = img.Fill(
        info[0]->Uint32Value(),
        info[1]->Uint32Value(),
        info[2]->Uint32Value(),
        info[3]->Uint32Value(),
        RGBObjToPxl(info[4].As<Object>())
    );
    if(!ok) {
        return ThrowError(img.LastError().c_str());
    }

    info.GetReturnValue().SetUndefined();
}

///
NAN_METHOD(PngImgAdapter::Crop) {
    PngImg& img = GetObj(info)->img_;
    const bool ok = img.Crop(
        info[0]->Uint32Value(),
        info[1]->Uint32Value(),
        info[2]->Uint32Value(),
        info[3]->Uint32Value()
    );
    if(!ok) {
        return ThrowError(img.LastError().c_str());
    }

    info.GetReturnValue().SetUndefined();
}

///
NAN_METHOD(PngImgAdapter::SetSize) {
    PngImg& img = GetObj(info)->img_;
    img.SetSize(
        info[0]->Uint32Value(),
        info[1]->Uint32Value()
    );

    info.GetReturnValue().SetUndefined();
}

///
NAN_METHOD(PngImgAdapter::Insert) {
    PngImg& img = GetObj(info)->img_;
    img.Insert(
        node::ObjectWrap::Unwrap<PngImgAdapter>(info[0]->ToObject())->img_,
        info[1]->Uint32Value(),
        info[2]->Uint32Value()
    );

    info.GetReturnValue().SetUndefined();
}

///
NAN_METHOD(PngImgAdapter::RotateRight) {
    PngImg& img = GetObj(info)->img_;
    img.RotateRight();
}

///
NAN_METHOD(PngImgAdapter::RotateLeft) {
    PngImg& img = GetObj(info)->img_;
    img.RotateLeft();
}

///
NAN_METHOD(PngImgAdapter::Write) {
    PngImg& img = GetObj(info)->img_;
    Local<String> file = info[0].As<String>();
    Callback* callback = new Callback(info[1].As<Function>());

    AsyncQueueWorker(new SaveWorker(callback, img, *v8::String::Utf8Value(file), info.This()));
    info.GetReturnValue().SetUndefined();
}

///
template <class T>
PngImgAdapter* PngImgAdapter::GetObj(const T& args) {
    return node::ObjectWrap::Unwrap<PngImgAdapter>(args.Holder());
}

