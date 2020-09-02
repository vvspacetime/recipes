#include <stdlib.h>

#include <cstring>
#include <deque>
#include <iostream>
#include <new>
using namespace std;

template <class T>
class MyDeque {
   public:
    MyDeque() {
        map_ = (T **)malloc(map_cap_ * sizeof(T *));
        map_[map_start_index_] = new T[node_cap_];
    }

    void push_back(T &item) {
        if (end_node_end_index_ >= node_cap_) {
            if (map_start_index_ + map_len_ >= map_cap_) {
                realloc_map(0);
            }
            map_[map_start_index_ + map_len_] = new T[node_cap_];
            // map[map_start_index_ + map_len_] = (T*)malloc(node_cap_ *
            // sizeof(T));
            map_len_++;
            end_node_end_index_ = 0;
        }

        new (map_[map_start_index_ + map_len_ - 1] + end_node_end_index_)
            T(item);
        end_node_end_index_++;
    }

    void pop_back() {
        if (end_node_end_index_ > 1) {
            end_node_end_index_--;
            T *p = &map_[map_start_index_ + map_len_ - 1][end_node_end_index_];
            p->~T();
        } else {
            if (map_len_ > 1) {
                delete map_[map_start_index_ + map_len_ - 1];
                map_len_--;
                end_node_end_index_ = node_cap_;
            } else {
                first_node_start_index_ = 0;
                end_node_end_index_ = 0;
            }
        }
    }

    T &back() {
        return map_[map_start_index_ + map_len_ - 1][end_node_end_index_ - 1];
    }

    void push_front(T &item) {
        if (first_node_start_index_ == 0) {
            if (map_start_index_ == 0) {
                realloc_map(1);
            }
            map_[map_start_index_ - 1] = new T[node_cap_];
            map_len_++;
            map_start_index_--;
            first_node_start_index_ = node_cap_;
        }

        new (map_[map_start_index_] + first_node_start_index_ - 1) T(item);
        first_node_start_index_--;
    }

    void pop_front() {
        if (first_node_start_index_ != node_cap_ - 1) {
            T *p = &map_[map_start_index_][first_node_start_index_];
            p->~T();
            first_node_start_index_++;
        } else {
            if (map_len_ > 1) {
                delete map_[map_start_index_];
                map_start_index_++;
                map_len_--;
            } else {
                end_node_end_index_ = 0;
            }
            first_node_start_index_ = 0;
        }
    }

    T &front() { return map_[map_start_index_][first_node_start_index_]; }

   private:
    void realloc_map(int add_to_front) {
        auto new_cap = map_cap_ * 2;
        auto new_map = (T **)malloc(new_cap * sizeof(T *));
        auto new_start = (new_cap - map_len_) / 2 + add_to_front;
        memcpy((void *)(new_map + new_start),
               (const void *)(map_ + map_start_index_),
               map_len_ * sizeof(T **));
        map_cap_ = new_cap;
        map_start_index_ = new_start;
        map_ = new_map;
    }

    T **map_;
    size_t map_cap_ = 1;
    int map_start_index_ = 0;  // start point in map
    size_t map_len_ = 1;

    const size_t node_cap_ = 32;
    int first_node_start_index_ = 0;
    int end_node_end_index_ = 0;  // [)
};

constexpr int CNT = 1000;

int main() {
#if 0
    MyDeque<int> dq;
#else
    deque<int> dq;
#endif

    for (int i = 0; i < 10; i++) {
        for (int i = 0; i < CNT; i++) {
            dq.push_back(i);
        }
        for (int i = 0; i < CNT; i++) {
            dq.pop_back();
        }
        for (int i = 0; i < CNT; i++) {
            dq.push_front(i);
        }
        for (int i = 0; i < CNT; i++) {
            dq.pop_front();
        }
        for (int i = 0; i < CNT * 2; i++) {
            dq.push_back(i);
        }
        for (int i = 0; i < CNT * 2; i++) {
            auto y = dq.front();
            cout << y << ",";
            dq.pop_front();
        }
    }
}