#ifndef PNG_IMG_ADAPTER_H
#define PNG_IMG_ADAPTER_H

#include <nan.h>
#include <functional>

#include "./PngImg.h"

class PngImgAdapter
    : public node::ObjectWrap
{
public:
    static void Init();
    static NAN_METHOD(NewInstance);

    PngImgAdapter(const char* buf, const size_t bufLen) : img_(buf, bufLen) {}

private:
    static NAN_METHOD(New);
    static NAN_PROPERTY_GETTER(Width);
    static NAN_PROPERTY_GETTER(Height);
    static NAN_METHOD(Get);
    static NAN_METHOD(Fill);
    static NAN_METHOD(Crop);
    static NAN_METHOD(SetSize);
    static NAN_METHOD(Write);

    template <class T> static PngImgAdapter* GetObj(const T& args);

    PngImg img_;
};

#endif  // PNG_IMG_ADAPTER_H
