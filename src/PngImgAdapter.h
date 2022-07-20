#ifndef PNG_IMG_ADAPTER_H
#define PNG_IMG_ADAPTER_H

#include <napi.h>
#include <functional>

#include "./PngImg.h"

class PngImgAdapter
    : public Napi::ObjectWrap<PngImgAdapter>
{
public:
    static Napi::Function Init(Napi::Env env);

    explicit PngImgAdapter(Napi::CallbackInfo& info);
    ~PngImgAdapter() override;

private:
    Napi::Value Width(const Napi::CallbackInfo& info);
    Napi::Value Height(const Napi::CallbackInfo& info);
    Napi::Value Get(const Napi::CallbackInfo& info);
    Napi::Value Fill(const Napi::CallbackInfo& info);
    Napi::Value Crop(const Napi::CallbackInfo& info);
    Napi::Value SetSize(const Napi::CallbackInfo& info);
    Napi::Value Insert(const Napi::CallbackInfo& info);
    void RotateRight(const Napi::CallbackInfo& info);
    void RotateLeft(const Napi::CallbackInfo& info);
    Napi::Value Write(const Napi::CallbackInfo& info);

    PngImg* img_ = nullptr;
};

#endif  // PNG_IMG_ADAPTER_H
