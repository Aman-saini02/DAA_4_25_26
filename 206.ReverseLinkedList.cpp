class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        ListNode* prev=NULL;
        ListNode* curr=head;
        ListNode* nest=head;
        while(nest!=NULL){
            nest=curr->next;
            curr->next=prev;
            prev=curr;
            curr=nest;
        }
        return prev;
    }
};