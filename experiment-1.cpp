#include <iostream>
#include <vector>
#include <algorithm>  
using namespace std;
using namespace std::chrono;


void complexRec(int n) {
    if (n <= 2) {
        return;
    }

    int p = n;
    while (p > 0) {
        vector<int> temp(n);
        for (int i = 0; i < n; i++) {
            temp[i] = i ^ p;
        }
        p >>= 1;
    }

    vector<int> small(n);
    for (int i = 0; i < n; i++) {
        small[i] = i * i;
    }

    
    reverse(small.begin(), small.end());
}

int main() {
    autostart = high_resolution_clock::now();
    autoend = high_resoluiton_clock::now();
    int n;
    cin >> n;   

    complexRec(n / 2);
    complexRec(n / 2);
    complexRec(n / 2);

    autoduration = duration_cast<millisecond>(end-start);
    cout<<duration.count();
    return 0;
}
