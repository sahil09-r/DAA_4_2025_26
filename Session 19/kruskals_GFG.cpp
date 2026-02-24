class Solution {
  public:
  
    vector<int> parent, rankArr;
    
    int find(int x) {
        if(parent[x] != x)
            parent[x] = find(parent[x]);
        return parent[x];
    }
    
    void unite(int x, int y) {
        int px = find(x);
        int py = find(y);
        
        if(px == py) return;
        
        if(rankArr[px] < rankArr[py]) {
            parent[px] = py;
        }
        else if(rankArr[px] > rankArr[py]) {
            parent[py] = px;
        }
        else {
            parent[py] = px;
            rankArr[px]++;
        }
    }
  
    int kruskalsMST(int V, vector<vector<int>> &edges) {
        
        sort(edges.begin(), edges.end(), [](vector<int> &a, vector<int> &b) {
            return a[2] < b[2];
        });
        
        parent.resize(V);
        rankArr.resize(V, 0);
        
        for(int i = 0; i < V; i++)
            parent[i] = i;
        
        int mstWeight = 0;
        int count = 0;
        
        for(auto &e : edges) {
            int u = e[0];
            int v = e[1];
            int w = e[2];
            
            if(find(u) != find(v)) {
                unite(u, v);
                mstWeight += w;
                count++;
                
                if(count == V - 1)
                    break;
            }
        }
        
        return mstWeight;
    }
};