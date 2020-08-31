

/**
 *  usage:
 *
 */
#include <functional>
#include <iostream>
#include <mutex>
#include <vector>

template <class T>
class ConditionTask {
   public:
    ConditionTask() {}

    void go() {
        std::vector<T> tmp;
        {
            std::unique_lock<std::mutex> locker(lock_);
            if (going_) return;
            going_ = true;
            tmp.swap(tasks_);
        }

        for (auto &task : tmp) {
            task();
        }
    }

    void reg(T &&task) {
        T *tmp = nullptr;
        {
            std::unique_lock<std::mutex> locker(lock_);
            if (going_) {
                tmp = &task;
            } else {
                tasks_.push_back(task);
            }
        }

        if (tmp) {
            (*tmp)();
        }
    }

   private:
    bool going_ = false;
    std::mutex lock_;
    std::vector<T> tasks_;
};

/******************* test ************************/
template <class T>
class Source : public ConditionTask<T> {};

int main() {
    Source<std::function<void()>> s;
    ConditionTask<std::function<void()>> c;
    s.reg([&]() { std::cout << "callback1" << std::endl; });

    std::cout << "go" << std::endl;
    s.go();

    s.reg([&]() { std::cout << "callback2" << std::endl; });
}