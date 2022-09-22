#ifndef PROMISE_WORKER_H
#define PROMISE_WORKER_H

#include <napi.h>

class PromiseWorker
    : public Napi::AsyncWorker
{
public:
    PromiseWorker(const Napi::Promise::Deferred& d)
        : AsyncWorker(get_fake_callback(d.Env()).Value())
        , deferred_(d)
    {}

    virtual void Resolve(const Napi::Promise::Deferred& d) = 0;

    void OnOK() override {
        Resolve(deferred_);
    }

    void OnError(const Napi::Error& error) override {
        deferred_.Reject(error.Value());
    }

private:
    static Napi::Value noop(const Napi::CallbackInfo& info) {
        return info.Env().Undefined();
    }

    const Napi::Reference<Napi::Function>& get_fake_callback(const Napi::Env& env) {
        static Napi::Reference<Napi::Function> fake_callback
                = Napi::Reference<Napi::Function>::New(Napi::Function::New(env, noop), 1);
        fake_callback.SuppressDestruct();

        return fake_callback;
    }

    Napi::Promise::Deferred deferred_;
};

#endif
