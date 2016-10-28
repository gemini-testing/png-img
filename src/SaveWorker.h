#ifndef SAVE_WORKER_H
#define SAVE_WORKER_H

#include <nan.h>
#include <string>

class PngImg;

///
class SaveWorker
    : public Nan::AsyncWorker
{
public:
    ///
    SaveWorker(Nan::Callback* cb, PngImg& img, std::string file, const v8::Local<v8::Object>& obj)
        : Nan::AsyncWorker(cb)
        , img_(img)
        , file_(file)
    {
        SaveToPersistent(0u, obj);
    }

    ///
    void Execute() {
        if(!img_.Write(file_)) {
            SetErrorMessage(img_.LastError().c_str());
        }
    }

private:
    PngImg& img_;
    std::string file_;
};

#endif // SAVE_WORKER_H
