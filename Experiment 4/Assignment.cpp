#include <queue>
#include <iostream>
using namespace std;

int main(){
    int n,k;cin>>k>>n;
    priority_queue<int,vector<int>,greater<int>> pq;
    for(int i = 0; i < n; i++){
        int num;cin>>num;
        pq.push(num);
        if(pq.size() >k)pq.pop();
        if(pq.size() < k)cout<<-1;
        else cout<<pq.top();
        cout<<'\n';
    }

}