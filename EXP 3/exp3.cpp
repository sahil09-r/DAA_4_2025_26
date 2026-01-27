#include<iostream>
#include<vector>
#include<unordered_map>
#include<algorithm>
using namespace std;
int main(){
    int n;
    cin >> n;
    vector<char> records(n);
    for(int i=0;i<n;i++){
        cin>>records[i];
    }
unordered_map<int,int>mp;
int sum=0;
int maxlength=0;
 mp[0] = -1;

for (int i = 0; i < n; i++) {
    if (records[i] == 'P') sum += 1;
    else if (records[i] == 'A') sum -= 1;

    if (mp.find(sum) != mp.end()) {
        maxlength = max(maxlength, i - mp[sum]);
    } else {
        mp[sum] = i;
    }
}
cout << maxlength << endl;
return 0;
}