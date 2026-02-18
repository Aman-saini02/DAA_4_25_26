#include <bits/stdc++.h>
using namespace std;
int upperBound(vector<int>& arr, int target) {
    int n = arr.size();
    int low = 0, high = n - 1;
    int ans = n; 
    
    while(low <= high) {
        int mid = low + (high - low) / 2;
        
        if(arr[mid] > target) {
            ans = mid;
            high = mid - 1;
        }
        else {
            low = mid + 1;
        }
    }
    
    return ans;
}
int lowerBound(vector<int>& arr, int target) {
    int n = arr.size();
    int low = 0, high = n - 1;
    int ans = n;
    
    while(low <= high) {
        int mid = low + (high - low) / 2;
        
        if(arr[mid] >= target) {
            ans = mid;
            high = mid - 1;
        }
        else {
            low = mid + 1;
        }
    }
    
    return ans;
}

int main() {
    vector<int> arr = {1, 2, 2, 2, 4, 6};
    int target = 2;

    cout << "Lower Bound: " << lowerBound(arr, target) << endl;
    cout << "Upper Bound: " << upperBound(arr, target) << endl;

    return 0;
}