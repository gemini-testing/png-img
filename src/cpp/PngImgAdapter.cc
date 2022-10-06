#include "./PngImgAdapter.h"
#include "./SaveWorker.h"

#include <napi.h>
#include <png.h>
#include <stdexcept>

///
Napi::Function PngImgAdapter::Init(Napi::Env env) {
    Napi::Function tpl = Napi::ObjectWrap<PngImgAdapter>::DefineClass(env, "PngImg", {
        InstanceAccessor<&PngImgAdapter::Width>("width"),
        InstanceAccessor<&PngImgAdapter::Height>("height"),
        InstanceMethod<&PngImgAdapter::Get>("get"),
        InstanceMethod<&PngImgAdapter::Fill>("fill"),
        InstanceMethod<&PngImgAdapter::Crop>("crop"),
        InstanceMethod<&PngImgAdapter::SetSize>("setSize"),
        InstanceMethod<&PngImgAdapter::Insert>("insert"),
        InstanceMethod<&PngImgAdapter::RotateRight>("rotateRight"),
        InstanceMethod<&PngImgAdapter::RotateLeft>("rotateLeft"),
        InstanceMethod<&PngImgAdapter::Write>("write"),
    });

    return tpl;
}

PngImgAdapter::PngImgAdapter(Napi::CallbackInfo &info) :
    Napi::ObjectWrap<PngImgAdapter>(info) {

    Napi::Object imgBuffer = info[0].As<Napi::Object>();
    const char* buf = imgBuffer.As<Napi::Buffer<char>>().Data();
    const size_t bufLen = imgBuffer.As<Napi::Buffer<char>>().Length();

    const size_t SIG_LEN = 8;
    if(bufLen < SIG_LEN || png_sig_cmp((png_const_bytep)buf, 0, SIG_LEN)) {
        throw Napi::Error::New(info.Env(), "Not a PNG");
    }

    img_ = new PngImg(buf, bufLen);
}

PngImgAdapter::~PngImgAdapter() {
    delete img_;
}

///
Napi::Value PngImgAdapter::Width(const Napi::CallbackInfo &info) {
    return Napi::Number::New(info.Env(), img_->Width());
}

///
Napi::Value PngImgAdapter::Height(const Napi::CallbackInfo &info) {
    return Napi::Number::New(info.Env(), img_->Height());
}

///
Napi::Value PngImgAdapter::Get(const Napi::CallbackInfo& info) {
    const Napi::Env &env = info.Env();

    try {
        auto pPxl = img_->Get(info[0].ToNumber().Uint32Value(), info[1].ToNumber().Uint32Value());

        Napi::Object obj = Napi::Object::New(env);
        obj.Set("r", Napi::Number::New(env, pPxl->r));
        obj.Set("g", Napi::Number::New(env, pPxl->g));
        obj.Set("b", Napi::Number::New(env, pPxl->b));
        obj.Set("a", Napi::Number::New(env, pPxl->a));

        return obj;
    } catch(const std::exception& e) {
        throw Napi::Error::New(env, e.what());
    }
}

///
Pxl RGBObjToPxl(Napi::Env env, const Napi::Object& obj) {
    auto getIntVal_ = [&obj](const std::string& key) {
        std::string val = obj.Get(key).ToString().Utf8Value();
        return static_cast<short>(stoi(val));
    };

    Pxl pxl{
        .r = getIntVal_("r"),
        .g = getIntVal_("g"),
        .b = getIntVal_("b"),
        .a = getIntVal_("a"),
    };
    return pxl;
}

///
Napi::Value PngImgAdapter::Fill(const Napi::CallbackInfo& info) {
    const Napi::Env &env = info.Env();

    try {
        img_->Fill(
            info[0].ToNumber().Uint32Value(),
            info[1].ToNumber().Uint32Value(),
            info[2].ToNumber().Uint32Value(),
            info[3].ToNumber().Uint32Value(),
            RGBObjToPxl(env, info[4].As<Napi::Object>())
        );

        return env.Undefined();
    } catch(const std::exception& e) {
        throw Napi::Error::New(env, e.what());
    }
}

///
Napi::Value PngImgAdapter::Crop(const Napi::CallbackInfo& info) {
    const Napi::Env &env = info.Env();

    try {
        img_->Crop(
            info[0].ToNumber().Uint32Value(),
            info[1].ToNumber().Uint32Value(),
            info[2].ToNumber().Uint32Value(),
            info[3].ToNumber().Uint32Value()
        );

        return env.Undefined();
    } catch(const std::exception& e) {
        throw Napi::Error::New(env, e.what());
    }
}

///
Napi::Value PngImgAdapter::SetSize(const Napi::CallbackInfo& info) {
    const Napi::Env &env = info.Env();

    img_->SetSize(
        info[0].ToNumber().Uint32Value(),
        info[1].ToNumber().Uint32Value()
    );

    return env.Undefined();
}

///
Napi::Value PngImgAdapter::Insert(const Napi::CallbackInfo& info) {
    const Napi::Env &env = info.Env();


    const Napi::Object &wrapper = info[0].ToObject();
    img_->Insert(
        *PngImgAdapter::Unwrap(wrapper)->img_,
        info[1].ToNumber().Uint32Value(),
        info[2].ToNumber().Uint32Value()
    );

    return env.Undefined();
}

///
void PngImgAdapter::RotateRight(const Napi::CallbackInfo& info) {
    img_->RotateRight();
}

///
void PngImgAdapter::RotateLeft(const Napi::CallbackInfo& info) {
    img_->RotateLeft();
}

///
Napi::Value PngImgAdapter::Write(const Napi::CallbackInfo& info) {
    Napi::Promise::Deferred deferred = Napi::Promise::Deferred::New(info.Env());
    Napi::String file = info[0].As<Napi::String>();

    auto *pWorker = new SaveWorker(deferred, *img_, file);
    pWorker->Queue();

    return deferred.Promise();
}
