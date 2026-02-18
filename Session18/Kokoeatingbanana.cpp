class Solution {
public:
    int minEatingSpeed(vector<int>& piles, int h) {
        int limit = *max_element(piles.begin() , piles.end());
        int n = piles.size();
        int l = 1 , r = limit;
        int ans = 0;
        while(l <= r){
            long long time = 0;
            int mid = (l+r)/2;
            for(int i = 0; i<n; i++){
                time = time + ceil(piles[i] / (double)mid);
            }
            if(time <= h){
                ans = mid;
                r = mid - 1;
            }else{
                l = mid + 1;
            }
        }
        return ans;
    }
};