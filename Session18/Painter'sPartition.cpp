int findLargestMinDistance(vector<int> &boards, int k)
{
    int n = boards.size();
    
    long long low = 0, high = 0;
    
    for(int i = 0; i < n; i++) {
        low = max(low, (long long)boards[i]);
        high += boards[i];
    }
    
    long long ans = high;
    
    while(low <= high) {
        long long mid = low + (high - low) / 2;
        
        long long currentSum = 0;
        int painters = 1;
        
        for(int i = 0; i < n; i++) {
            
            if(currentSum + boards[i] <= mid) {
                currentSum += boards[i];
            } 
            else {
                painters++;
                currentSum = boards[i];
            }
        }
        
        if(painters <= k) {
            ans = mid;
            high = mid - 1;
        }
        else {
            low = mid + 1;
        }
    }
    
    return ans;
}