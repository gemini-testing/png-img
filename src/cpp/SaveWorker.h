#ifndef SAVE_WORKER_H
#define SAVE_WORKER_H

#include  "./PromiseWorker.h"

class PngImg;

///
class SaveWorker
    : public PromiseWorker
{
public:
    SaveWorker(const Napi::Promise::Deferred& d, const PngImg& img, std::string file)
        : PromiseWorker(d)
        , img_(img)
        , file_(std::move(file))
    {
    }

    void Resolve(Napi::Promise::Deferred const &deferred) override {
        deferred.Resolve(deferred.Env().Undefined());
    }

    void Execute() override {
        img_.Write(file_);
    }

private:
    const PngImg& img_;
    std::string file_;
};

#endif // SAVE_WORKER_H
