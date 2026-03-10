class Solution {
  public:
    vector<int> maxOfSubarrays(vector<int>& arr, int k) {
        
        int n = arr.size();
        vector<int> res;
        for(int i = 0;i<=n-k;i++){
            int mx = arr[i];
            for(int j =i;j < i + k;j++){
                mx = max(mx,arr[j]);
            }
            res.push_back(mx);
        }
        return res;
    }
};