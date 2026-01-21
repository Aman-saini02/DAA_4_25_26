#include<iostream>
using namespace std;

class Node{
public:
    int val;
    Node* next;
    Node* prev;
    Node(int val){
        this->val = val;
        next = NULL;
        prev = NULL;
    }
};

void display(Node* head){
    Node* temp = head;
    while(temp != NULL){
        cout << temp->val << " ";
        temp = temp->next;
    }
    cout << endl;
}

void insertAtStart(Node* &head, int val){
    Node* t = new Node(val);
    if(head != NULL){
        t->next = head;
        head->prev = t;
    }
    head = t;
}

void insertAtEnd(Node* &head, int val){
    Node* t = new Node(val);
    if(head == NULL){
        head = t;
        return;
    }
    Node* temp = head;
    while(temp->next != NULL)
        temp = temp->next;
    temp->next = t;
    t->prev = temp;
}

void insertAtIdx(int idx, int val, Node* &head){
    if(idx == 0){
        insertAtStart(head, val);
        return;
    }
    Node* temp = head;
    for(int i = 0; i < idx-1; i++)
        temp = temp->next;
    Node* n = new Node(val);
    n->next = temp->next;
    if(temp->next != NULL)
        temp->next->prev = n;
    temp->next = n;
    n->prev = temp;
}

void deleationAtStart(Node* &head){
    if(head == NULL) return;
    Node* temp = head;
    head = head->next;
    if(head != NULL)
        head->prev = NULL;
    delete temp;
}

void deleationAtEnd(Node* &head){
    if(head == NULL) return;
    if(head->next == NULL){
        delete head;
        head = NULL;
        return;
    }
    Node* temp = head;
    while(temp->next != NULL)
        temp = temp->next;
    temp->prev->next = NULL;
    delete temp;
}

void deletion(Node* &head, int num){
    if(head == NULL) return;
    Node* temp = head;
    while(temp != NULL && temp->val != num)
        temp = temp->next;
    if(temp == NULL) return;
    if(temp->prev != NULL)
        temp->prev->next = temp->next;
    else
        head = temp->next;
    if(temp->next != NULL)
        temp->next->prev = temp->prev;
    delete temp;
}

int main(){
    Node* a = NULL;
    insertAtStart(a, 5);
    display(a);
    insertAtEnd(a, 40);
    display(a);
    deleationAtStart(a);
    display(a);
    deleationAtEnd(a);
    display(a);
    insertAtIdx(1, 15, a);
    display(a);
    deletion(a, 15);
    display(a);
    return 0;
}
