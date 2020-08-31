#include <iostream>

using namespace std;

template <class T>
struct ListNode {
    T value;
    ListNode* next;
};

// todo
template <class T>
ListNode<T>* merge(ListNode<T>* h1, ListNode<T>* h2) {
    if (!h1) return h2;
    if (!h2) return h1;

    ListNode<T>* rv;
    if (h1->value <= h2->value) {
        rv = h1;
        h1 = h1->next;
    } else {
        rv = h2;
        h2 = h2->next;
    }

    ListNode<T>* p = rv;
    while (h1 && h2) {
        if (h1->value <= h2->value) {
            p->next = h1;
            h1 = h1->next;
        } else {
            p->next = h2;
            h2 = h2->next;
        }
        p = p->next;
    }

    while (h1) {
        p->next = h1;
        h1 = h1->next;
        p = p->next;
    }

    while (h2) {
        p->next = h2;
        h2 = h2->next;
        p = p->next;
    }
    p->next = nullptr;

    return rv;
}

template <class T>
ListNode<T>* mergeSort(ListNode<T>* head) {
    ListNode<T>* pos[64] = {nullptr};
    ListNode<T>* p = head;

    // use binary mode, to avoid recursive
    while (p) {
        ListNode<T>* q = p;
        p = p->next;
        q->next = nullptr;
        int i = 0;
        while (pos[i]) {
            q = merge(q, pos[i]);
            pos[i] = nullptr;
            i++;
        }
        pos[i] = q;
    }

    ListNode<T>* rv = nullptr;
    for (int i = 0; i < 64; i++) {
        rv = merge(pos[i], rv);
    }

    return rv;
}

/******************* test ************************/
int main() {
    int datas[11] = {10, 1, 2, 4, 3, 8, 5, 9, 6, 11, 7};
    ListNode<int>* dummy = new ListNode<int>;
    ListNode<int>* p = dummy;
    for (int i = 0; i < 11; i++) {
        p->next = new ListNode<int>;
        p = p->next;
        p->value = datas[i];
    }

    ListNode<int>* result = mergeSort(dummy->next);
    p = result;
    while (p) {
        cout << p->value << ",";
        p = p->next;
    }
    cout << endl;
}