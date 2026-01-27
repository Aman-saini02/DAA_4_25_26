#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    unordered_map<int,int> m;
    int sum = 0;
    int ans = 0;
    m[0] = -1;
    for(int i = 0; i < n; i++) {
        char x;
        cin >> x;
        if(x == 'P') sum++;
        else sum--;
        if(m.find(sum) != m.end()) ans = max(ans, i - m[sum]);
        else m[sum] = i;
    }
    cout << ans <<endl;
    return 0;
}
