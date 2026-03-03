# 十、Graph（圖論）

## 題目目錄

- [133. Clone Graph (Med.)](#133-clone-graph-med)
- [200. Number of Islands (Med.)](#200-number-of-islands-med)
- [733. Flood Fill (Easy)](#733-flood-fill-easy)
- [994. Rotting Oranges (Med.)](#994-rotting-oranges-med)
- [542. 01 Matrix (Med.)](#542-01-matrix-med)
- [417. Pacific Atlantic Water Flow (Med.)](#417-pacific-atlantic-water-flow-med)
- [207. Course Schedule (Med.)](#207-course-schedule-med)
- [210. Course Schedule II (Med.)](#210-course-schedule-ii-med)
- [721. Accounts Merge (Med.)](#721-accounts-merge-med)
- [261. Graph Valid Tree (Med.)](#261-graph-valid-tree-med)
- [323. Number of Connected Components in an Undirected Graph (Med.)](#323-number-of-connected-components-in-an-undirected-graph-med)
- [269. Alien Dictionary (Hard)](#269-alien-dictionary-hard)
- [127. Word Ladder (Hard)](#127-word-ladder-hard)
- [787. Cheapest Flights Within K Stops (Med.)](#787-cheapest-flights-within-k-stops-med)
- [1197. Minimum Knight Moves (Med.)](#1197-minimum-knight-moves-med)
- [1730. Shortest Path to Get Food (Med.)](#1730-shortest-path-to-get-food-med)
- [815. Bus Routes (Hard)](#815-bus-routes-hard)

## 通用套路

**BFS**：最短路徑（無權圖）、逐層擴散。

**DFS**：連通分量、路徑搜尋、環偵測。

**Union Find**：合併集合、判斷連通性。

**拓撲排序**：有向無環圖 (DAG) 的依賴順序。

```python
# 套路模板：BFS 最短路徑
from collections import deque
def bfs_shortest(graph, start, end):
    queue = deque([(start, 0)])
    visited = {start}
    while queue:
        node, dist = queue.popleft()
        if node == end:
            return dist
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, dist + 1))
    return -1

# 套路模板：Union Find
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])  # 路徑壓縮
        return self.parent[x]
    def union(self, x, y):
        px, py = self.find(x), self.find(y)
        if px == py: return False
        if self.rank[px] < self.rank[py]: px, py = py, px
        self.parent[py] = px
        if self.rank[px] == self.rank[py]: self.rank[px] += 1
        return True
```

---

### 133. Clone Graph (Med.)

- **套路**：DFS/BFS + Hash Map 記錄 old→new
- **思路**：遍歷圖的同時建立複製節點，用 Hash Map 避免重複複製。
- **TC**：O(V+E)
  - 因為有 V 個節點，E 條邊，然後用 visited 保護，所以每個節點只會被 Processed 一次，每個邊是(u,v)，所以其實會被 Visited 兩次，一次從 u->v，一次從 v->u。然而 2 倍的常數在複雜度分析中通常被忽略，所以我們通常寫成 O(V+E)。
- **SC**：O(V)
  - 主要來自於兩個地方，一個是因為我們需要用 Hash Map 來記錄每個節點的複製，所以需要 O(V) 的空間，另一個是遞迴所造成的 Call stack，最悪情況下會有 O(V) 的空間複雜度。
- **其他思路**：
  - BFS: 可以用 queue 來實現，每次從 queue 中取出一個節點，然後遍歷它的鄰居，如果鄰居還沒有被訪問過，就將它加入 queue 中。TC: O(V+E), SC: O(V)
- **解法比較**：
  - DFS:
    - 優點：代碼簡潔、邏輯直觀。
    - 缺點：如果圖的深度極深，會有 Stack Overflow 的風險。
  - BFS:
    - 優點：不會有 Stack Overflow 問題，適合找「最短路徑」。
    - 缺點：需要手動維護一個 Queue 物件，代碼稍長。
- **測試重點 (Testing)**：
  - **空圖**：傳入 `None` 應回傳 `None`。
  - **有環圖**：如 1-2-1，驗證 `visited` 字典是否能成功回傳已建立的節點。
  - **孤立節點**：驗證 `neighbors` 為空時，`for` 迴圈不執行，正確回傳單一節點。

```python
# Definition for a Node.
class Node:
    def __init__(self, val = 0, neighbors = None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []
# DFS
def cloneGraph(node):
    if not node:
        return None
    # 使用字典紀錄「原節點 -> 複製節點」的映射，避免重複複製與處理環
    visited = {}
    def dfs(curr):
        # 如果已經複製過，直接回傳對應的複製節點
        if curr in visited:
            return visited[curr]
        # 建立當前節點的複本
        clone = Node(curr.val)
        # 先存入 visited，防止遞迴處理鄰居時發生無窮回環
        visited[curr] = clone
        # 遞迴複製所有鄰居並加入複製節點的 neighbors
        for neighbor in curr.neighbors:
            clone.neighbors.append(dfs(neighbor))
        return clone
    return dfs(node)

# BFS
def cloneGraph(node):
    if not node:
        return None
    # 初始化 visited 並建立起點的複本
    visited = {node: Node(node.val)}
    queue = deque([node])
    while queue:
        curr = queue.popleft()
        # 遍歷當前「原節點」的所有鄰居
        for neighbor in curr.neighbors:
            # 如果該鄰居尚未被複製
            if neighbor not in visited:
                # 建立複本並紀錄
                visited[neighbor] = Node(neighbor.val)
                # 將原鄰居節點入隊，以便後續處理它的鄰居
                queue.append(neighbor)
            # 將複製出來的鄰居節點連結到當前複製節點的 neighbors
            visited[curr].neighbors.append(visited[neighbor])
    return visited[node]
```

---

### 200. Number of Islands (Med.)

---

### 733. Flood Fill (Easy)

---

### 994. Rotting Oranges (Med.)

---

### 542. 01 Matrix (Med.)

---

### 417. Pacific Atlantic Water Flow (Med.)

---

### 133. Clone Graph (Med.)

---

### 207. Course Schedule (Med.)

---

### 210. Course Schedule II (Med.)

---

### 721. Accounts Merge (Med.)

---

### 261. Graph Valid Tree (Med.)

---

### 323. Number of Connected Components in an Undirected Graph (Med.)

---

### 269. Alien Dictionary (Hard)

---

### 127. Word Ladder (Hard)

---

### 787. Cheapest Flights Within K Stops (Med.)

---

### 1197. Minimum Knight Moves (Med.)

---

### 1730. Shortest Path to Get Food (Med.)

---

### 815. Bus Routes (Hard)
