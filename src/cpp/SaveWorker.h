#ifndef SAVE_WORKER_H
#define SAVE_WORKER_H

#include <napi.h>
#include <string>
#include <utility>

class PngImg;

///
class SaveWorker
    : public Napi::AsyncWorker
{
public:
    ///
    SaveWorker(Napi::Function& callback, PngImg& img, std::string file)
        : Napi::AsyncWorker(callback)
        , img_(img)
        , file_(std::move(file))
    {
    }

    ///
    void Execute() override {
        if(!img_.Write(file_)) {
            SetError(img_.LastError());
        }
    }

private:
    PngImg& img_;
    std::string file_;
};

#endif // SAVE_WORKER_H
