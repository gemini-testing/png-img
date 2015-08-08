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
    SaveWorker(Nan::Callback* cb, PngImg& img, std::string file)
        : Nan::AsyncWorker(cb)
        , img_(img)
        , file_(file)
    {}

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
