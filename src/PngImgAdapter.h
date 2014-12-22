#ifndef PNG_IMG_ADAPTER_H
#define PNG_IMG_ADAPTER_H

#include <node.h>
#include <functional>

#include "./PngImg.h"

class PngImgAdapter
    : node::ObjectWrap
{
public:
    static void Init();
    static v8::Handle<v8::Value> NewInstance(const v8::Arguments& args);

    PngImgAdapter(const char* buf, const size_t bufLen) : img_(buf, bufLen) {}

private:
    static v8::Handle<v8::Value> New(const v8::Arguments& args);
    static v8::Handle<v8::Value> Width(v8::Local<v8::String> property, const v8::AccessorInfo& info);
    static v8::Handle<v8::Value> Height(v8::Local<v8::String> property, const v8::AccessorInfo& info);
    static v8::Handle<v8::Value> Get(const v8::Arguments& args);
    static v8::Handle<v8::Value> Fill(const v8::Arguments& args);
    static v8::Handle<v8::Value> Crop(const v8::Arguments& args);
    static v8::Handle<v8::Value> Write(const v8::Arguments& args);

    static v8::Local<v8::Number> GetProperty(const v8::AccessorInfo& info, std::function<unsigned(const PngImg&)> getter);
    static v8::Handle<v8::Value> Call(const v8::Arguments& args, std::function<bool(PngImg&)> fn);

    PngImg img_;
};

#endif  // PNG_IMG_ADAPTER_H
