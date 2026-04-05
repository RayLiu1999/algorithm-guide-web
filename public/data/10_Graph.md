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

**拓樸排序**：有向無環圖 (DAG) 的依賴順序。

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
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        px, py = self.find(x), self.find(y)
        if px == py:
            return False
        if self.rank[px] < self.rank[py]:
            px, py = py, px
        self.parent[py] = px
        if self.rank[px] == self.rank[py]:
            self.rank[px] += 1
        return True
```

---

### 133. Clone Graph (Med.)

- **Problem (English)**: Given a reference to a node in a connected, finite, undirected graph, return a deep copy of the graph.
- **題目（中文）**：給定一個連通、有限、無向圖中的某個節點參考，請回傳整張圖的深度複製。

- **Examples**:
  - Example 1: `adjList = [[2,4],[1,3],[2,4],[1,3]]`
    - Output: `[[2,4],[1,3],[2,4],[1,3]]`
    - Explanation: There are 4 nodes in the graph.
1st node (val = 1)'s neighbors are 2nd node (val = 2) and 4th node (val = 4).
2nd node (val = 2)'s neighbors are 1st node (val = 1) and 3rd node (val = 3).
3rd node (val = 3)'s neighbors are 2nd node (val = 2) and 4th node (val = 4).
4th node (val = 4)'s neighbors are 1st node (val = 1) and 3rd node (val = 3).
  - Example 2: `adjList = [[]]`
    - Output: `[[]]`
    - Explanation: Note that the input contains one empty list. The graph consists of only one node with val = 1 and it does not have any neighbors.
  - Example 3: `adjList = []`
    - Output: `[]`
    - Explanation: This an empty graph, it does not have any nodes.
- **Constraints**:
  - The number of nodes in the graph is in the range [0, 100].
  - `1 <= Node.val <= 100`
  - Node.val is unique for each node.
  - There are no repeated edges and no self-loops in the graph.
  - The Graph is connected and all nodes can be visited starting from the given node.

- **套路**：DFS/BFS + Hash Map 建立 old -> new 映射
- **思路**：
  - 圖可能有環，也可能多個節點共享同一個鄰居，所以不能直接遞迴複製；第一次看到某個原節點時，要先建立 clone 並放進映射表。
  - 之後若又從別的邊走回同一節點，就直接回傳已建立的 clone，這樣既能保留原圖結構，也能避免無限遞迴。
- **TC**：O(V + E)
  - 每個節點只建立一次，每條邊只會沿 adjacency list 被掃過固定次數。
- **SC**：O(V)
  - `visited` 映射會存所有已複製節點，DFS 遞迴堆疊最壞也可能到 O(V)。
- **其他思路**：
  - BFS：改用 queue 逐層擴展，同樣搭配 `visited` 建立複本；適合圖很深時避免遞迴深度限制。
- **解法比較**：
  - DFS：寫法最短，對「複製當前節點並複製所有鄰居」這件事很直觀。
  - BFS：不依賴遞迴，但程式結構通常比 DFS 多一些初始化與 queue 操作。
- **測試重點 (Testing)**：
  - 空圖 `None`，應直接回傳 `None`。
  - 單一節點且沒有鄰居，確認最基本複製正確。
  - 含環或自環的圖，確認不會無限遞迴。
  - 多個節點共享同一鄰居，確認 clone 後仍指向同一個新節點，而不是重複建節點。

```python
class Node:
    def __init__(self, val=0, neighbors=None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []


def cloneGraph(node):
    if not node:
        return None

    visited = {}

    def dfs(curr):
        if curr in visited:
            return visited[curr]

        clone = Node(curr.val)
        visited[curr] = clone

        for neighbor in curr.neighbors:
            clone.neighbors.append(dfs(neighbor))

        return clone

    return dfs(node)
```

### 200. Number of Islands (Med.)

- **Problem (English)**: Given an `m x n` grid of `1`s (land) and `0`s (water), count the number of islands, where an island is formed by horizontally or vertically adjacent lands and all four edges of the grid are surrounded by water.
- **題目（中文）**：給定一個 `m x n` 的網格，其中 `1` 代表陸地、`0` 代表水，請計算島嶼數量；島嶼由水平或垂直相鄰的陸地組成，且整個網格的四條邊都可視為被水包圍。

- **Examples**:
  - Example 1: `grid = [
["1","1","1","1","0"],
["1","1","0","1","0"],
["1","1","0","0","0"],
["0","0","0","0","0"]
]`
    - Output: `1`
  - Example 2: `grid = [
["1","1","0","0","0"],
["1","1","0","0","0"],
["0","0","1","0","0"],
["0","0","0","1","1"]
]`
    - Output: `3`
- **Constraints**:
  - `m == grid.length`
  - `n == grid[i].length`
  - `1 <= m, n <= 300`
  - grid[i][j] is '0' or '1'.

- **套路**：DFS/BFS 掃連通塊
- **思路**：
  - 逐格掃描 `grid`，一旦遇到陸地 `1`，就代表發現一座還沒處理過的島，立刻啟動 DFS/BFS 把整個四向連通區塊都標記掉。
  - 因為同一座島上的格子會在第一次搜尋時全部被改成 `0`，後面就不會被重複計數，所以每啟動一次搜尋就恰好對應一座島。
- **TC**：O(m * n)
  - 每個格子最多只會被掃描與標記一次，總工作量與網格大小成正比。
- **SC**：O(m * n)
  - 若整張圖幾乎都是陸地，遞迴堆疊或 BFS queue 最壞情況可達整個網格大小。
- **其他思路**：
  - Union Find：把每個陸地視為節點，再把上下左右相鄰陸地 union，最後統計不同 root 的數量。
- **解法比較**：
  - DFS/BFS：最適合單次計數，程式短而且直觀。
  - Union Find：更適合延伸到動態加點、查連通性之類的變形題，但模板較重。
- **測試重點 (Testing)**：
  - 全部都是海洋，答案應為 `0`。
  - 整張圖是一座大島，確認不會重複計數。
  - 對角相鄰但四方向不連通的陸地，應被算成不同島。
  - 島嶼貼邊界或貼角落，確認邊界判斷沒漏。

```python
def numIslands(grid):
    rows, cols = len(grid), len(grid[0])

    def dfs(r, c):
        if r < 0 or c < 0 or r >= rows or c >= cols or grid[r][c] != "1":
            return

        grid[r][c] = "0"
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)

    islands = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "1":
                islands += 1
                dfs(r, c)

    return islands
```

### 733. Flood Fill (Easy)

- **Problem (English)**: Given an `m x n` image, a starting pixel `(sr, sc)`, and a new color, flood-fill the starting pixel and every 4-directionally connected pixel that has the same original color.
- **題目（中文）**：給定一張 `m x n` 影像、一個起始像素 `(sr, sc)`，以及新顏色，請把起點與所有和它四方向連通、且原本顏色相同的像素一起染成新顏色。

- **Examples**:
  - Example 1: `image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2`
    - Output: `[[2,2,2],[2,2,0],[2,0,1]]`
  - Example 2: `image = [[0,0,0],[0,0,0]], sr = 0, sc = 0, color = 0`
    - Output: `[[0,0,0],[0,0,0]]`
- **Constraints**:
  - `m == image.length`
  - `n == image[i].length`
  - `1 <= m, n <= 50`
  - `0 <= image[i][j], color < 2^16`
  - `0 <= sr < m`
  - `0 <= sc < n`

- **套路**：DFS/BFS 同色擴散
- **思路**：
  - 先記住起點原本的顏色 `original`，接著只要四方向相連且顏色仍是 `original`，就把它改成新顏色。
  - 若起點原色本來就等於目標顏色，必須直接返回，否則搜尋會在已塗色區域中來回擴散。
- **TC**：O(m * n)
  - 最壞情況下整張圖都和起點同色，每個格子都要被拜訪一次。
- **SC**：O(m * n)
  - 遞迴堆疊或 BFS queue 在最壞情況下可能包含整個連通區塊。
- **其他思路**：
  - BFS：用 queue 逐層染色，對非常深的連通區塊可避免遞迴深度問題。
- **解法比較**：
  - DFS：程式最短，對網格染色題很順手。
  - BFS：更穩定，不怕遞迴深度，但需要額外 queue。
- **測試重點 (Testing)**：
  - 新顏色和原顏色相同，應原樣返回。
  - 起點在角落或邊界，確認越界判斷正確。
  - 只有單一像素需要改色，確認不會多改。
  - 同色區塊中間夾雜其他顏色，確認只會改到四方向連通部分。

```python
def floodFill(image, sr, sc, color):
    original = image[sr][sc]
    if original == color:
        return image

    rows, cols = len(image), len(image[0])

    def dfs(r, c):
        if r < 0 or c < 0 or r >= rows or c >= cols or image[r][c] != original:
            return

        image[r][c] = color
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)

    dfs(sr, sc)
    return image
```

### 994. Rotting Oranges (Med.)

- **Problem (English)**: Given an m x n grid with fresh oranges (1), rotten oranges (2), and empty cells (0), return the minimum number of minutes until all fresh oranges rot via 4-directional spreading, or -1 if impossible.
- **題目（中文）**：給定 m x n 的網格，標記為新鮮橘子(1)、腐爛橘子(2)和空格(0)。返回讓所有新鮮橘子腐爛的最少分鐘數，若不可能返回 -1。

- **Examples**:
  - Example 1: `grid = [[2,1,1],[1,1,0],[0,1,1]]`
    - Output: `4`
  - Example 2: `grid = [[2,1,1],[0,1,1],[1,0,1]]`
    - Output: `-1`
    - Explanation: The orange in the bottom left corner (row 2, column 0) is never rotten, because rotting only happens 4-directionally.
  - Example 3: `grid = [[0,2]]`
    - Output: `0`
    - Explanation: Since there are already no fresh oranges at minute 0, the answer is just 0.
- **Constraints**:
  - `m == grid.length`
  - `n == grid[i].length`
  - `1 <= m, n <= 10`
  - grid[i][j] is 0, 1, or 2.

- **套路**：多源 BFS
- **思路**：
  - 所有腐爛橘子會在同一時間開始感染，因此應把它們一起放進 queue，當成多個同時出發的起點。
  - BFS 每一層剛好代表 1 分鐘，當某顆新鮮橘子第一次被感染時，那個分鐘數就是它的最早腐爛時間。
- **TC**：O(m * n)
  - 每個格子最多進 queue 一次，四方向檢查也是固定常數次。
- **SC**：O(m * n)
  - queue 最壞情況可能暫存整層網格中的大量橘子。
- **其他思路**：
  - DFS 記錄最早感染時間：從每個腐爛橘子出發，把感染分鐘寫進另一張矩陣，保留較小值；可行但實作明顯更複雜。
- **解法比較**：
  - 多源 BFS：最符合「等權最短時間」語意，寫起來也最穩。
  - DFS 時間擴散：概念上能做，但容易因覆寫順序錯誤導致時間不是最短。
- **測試重點 (Testing)**：
  - 一開始沒有新鮮橘子，答案應為 `0`。
  - 有新鮮橘子被空格隔開，永遠感染不到，應回傳 `-1`。
  - 多個腐爛源同時擴散，確認分鐘數不是用某一個源單獨計算。
  - 只有一顆新鮮橘子且緊鄰腐爛橘子，答案應為 `1`。

```python
from collections import deque


def orangesRotting(grid):
    rows, cols = len(grid), len(grid[0])
    queue = deque()
    fresh = 0

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:
                queue.append((r, c))
            elif grid[r][c] == 1:
                fresh += 1

    if fresh == 0:
        return 0

    minutes = 0
    while queue and fresh > 0:
        for _ in range(len(queue)):
            r, c = queue.popleft()
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                    grid[nr][nc] = 2
                    fresh -= 1
                    queue.append((nr, nc))
        minutes += 1

    return minutes if fresh == 0 else -1
```

### 542. 01 Matrix (Med.)

- **Problem (English)**: Given an m x n binary matrix, return a matrix of the same size where each cell contains the distance to the nearest 0.
- **題目（中文）**：給定 m x n 的二進制矩陣，返回相同大小的矩陣，其中每個格子包含到最近 0 的距離。

- **Examples**:
  - Example 1: `mat = [[0,0,0],[0,1,0],[0,0,0]]`
    - Output: `[[0,0,0],[0,1,0],[0,0,0]]`
  - Example 2: `mat = [[0,0,0],[0,1,0],[1,1,1]]`
    - Output: `[[0,0,0],[0,1,0],[1,2,1]]`
- **Constraints**:
  - `m == mat.length`
  - `n == mat[i].length`
  - `1 <= m, n <= 10^4`
  - `1 <= m * n <= 10^4`
  - mat[i][j] is either 0 or 1.
  - There is at least one 0 in mat.

- **套路**：多源 BFS 求最近距離
- **思路**：
  - 每個 `0` 到自己的距離都是 `0`，所以可以把所有 `0` 一起丟進 queue，作為距離擴散的起點。
  - 對任何 `1` 來說，第一次被 BFS 擴展到時，得到的距離就是它到最近 `0` 的最短距離，因為無權圖 BFS 保證先到先最短。
- **TC**：O(m * n)
  - 每個格子只會被設定距離一次，並在那次入 queue。
- **SC**：O(m * n)
  - 距離矩陣與 queue 在最壞情況下都可能接近整張網格大小。
- **其他思路**：
  - 兩次 DP 掃描：先從左上到右下，再從右下到左上，用相鄰格子的最佳值修正答案。
- **解法比較**：
  - 多源 BFS：最容易連結到「最近 0」的最短路概念，面試時很好講。
  - 兩次 DP：常數因子較小、沒有 queue，但要比較熟悉距離轉移技巧。
- **測試重點 (Testing)**：
  - 全部都是 `0`，答案應維持全 `0`。
  - 唯一的 `0` 在角落，確認距離呈同心擴散。
  - 中間有單獨的 `0`，確認不同方向都能取到最近值。
  - 多個 `0` 同時存在，確認取到的是最近那個而不是先掃到的那個。

```python
from collections import deque


def updateMatrix(mat):
    rows, cols = len(mat), len(mat[0])
    dist = [[-1] * cols for _ in range(rows)]
    queue = deque()

    for r in range(rows):
        for c in range(cols):
            if mat[r][c] == 0:
                dist[r][c] = 0
                queue.append((r, c))

    while queue:
        r, c = queue.popleft()
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and dist[nr][nc] == -1:
                dist[nr][nc] = dist[r][c] + 1
                queue.append((nr, nc))

    return dist
```

### 417. Pacific Atlantic Water Flow (Med.)

- **Problem (English)**: Given an m x n matrix of elevation heights, determine which cells can flow water to both the Pacific Ocean (top/left borders) and the Atlantic Ocean (bottom/right borders).
- **題目（中文）**：給定 m x n 的高度矩陣，找出可同時向太平洋(上/左邊界)和大西洋(下/右邊界)流水的格子。

- **Examples**:
  - Example 1: `heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]`
    - Output: `[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]`
    - Explanation: The following cells can flow to the Pacific and Atlantic oceans, as shown below:
[0,4]: [0,4] -> Pacific Ocean
[0,4] -> Atlantic Ocean
[1,3]: [1,3] -> [0,3] -> Pacific Ocean
[1,3] -> [1,4] -> Atlantic Ocean
[1,4]: [1,4] -> [1,3] -> [0,3] -> Pacific Ocean
[1,4] -> Atlantic Ocean
[2,2]: [2,2] -> [1,2] -> [0,2] -> Pacific Ocean
[2,2] -> [2,3] -> [2,4] -> Atlantic Ocean
[3,0]: [3,0] -> Pacific Ocean
[3,0] -> [4,0] -> Atlantic Ocean
[3,1]: [3,1] -> [3,0] -> Pacific Ocean
[3,1] -> [4,1] -> Atlantic Ocean
[4,0]: [4,0] -> Pacific Ocean
[4,0] -> Atlantic Ocean
Note that there are other possible paths for these cells to flow to the Pacific and Atlantic oceans.
  - Example 2: `heights = [[1]]`
    - Output: `[[0,0]]`
    - Explanation: The water can flow from the only cell to the Pacific and Atlantic oceans.
- **Constraints**:
  - `m == heights.length`
  - `n == heights[r].length`
  - `1 <= m, n <= 200`
  - `0 <= heights[r][c] <= 10^5`

- **套路**：反向 DFS/BFS 從海邊往高處爬
- **思路**：
  - 若從每個格子正向判斷能否流到兩個海，會重複做很多搜尋；更好的做法是反過來，從兩個海的邊界開始，只走向高度更高或相等的格子。
  - 能被太平洋邊界反向走到的格子，代表水能流向太平洋；同理能被大西洋走到的格子，兩者交集就是答案。
- **TC**：O(m * n)
  - 太平洋和大西洋各自的搜尋都最多拜訪每個格子一次。
- **SC**：O(m * n)
  - 兩個 visited 集合加上 DFS 遞迴堆疊，最壞情況都可能接近整張網格。
- **其他思路**：
  - BFS：同樣從邊界出發，但用 queue 取代 DFS，流程與正確性完全相同。
- **解法比較**：
  - DFS：寫法短，對網格可達性問題很順手。
  - BFS：對超大輸入更穩，不受遞迴深度影響。
- **測試重點 (Testing)**：
  - 單行或單列，確認邊界初始化沒有漏。
  - 所有高度都相同，理論上每格都能流到兩海。
  - 中央高地、四周低地，確認反向搜尋方向判斷正確。
  - 僅部分格子同時可達兩海，確認交集計算正確。

```python
def pacificAtlantic(heights):
    if not heights or not heights[0]:
        return []

    rows, cols = len(heights), len(heights[0])
    pacific = set()
    atlantic = set()

    def dfs(r, c, visited):
        visited.add((r, c))
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if (
                0 <= nr < rows
                and 0 <= nc < cols
                and (nr, nc) not in visited
                and heights[nr][nc] >= heights[r][c]
            ):
                dfs(nr, nc, visited)

    for r in range(rows):
        dfs(r, 0, pacific)
        dfs(r, cols - 1, atlantic)

    for c in range(cols):
        dfs(0, c, pacific)
        dfs(rows - 1, c, atlantic)

    return [[r, c] for r in range(rows) for c in range(cols) if (r, c) in pacific and (r, c) in atlantic]
```

### 207. Course Schedule (Med.)

- **Problem (English)**: Given n courses and their prerequisite relationships, determine if it's possible to complete all courses without circular dependencies.
- **題目（中文）**：給定 n 門課程及其前置課程關係，判斷是否可能在無環依賴的情況下完成所有課程。

- **Examples**:
  - Example 1: `numCourses = 2, prerequisites = [[1,0]]`
    - Output: `true`
    - Explanation: There are a total of 2 courses to take.
To take course 1 you should have finished course 0. So it is possible.
  - Example 2: `numCourses = 2, prerequisites = [[1,0],[0,1]]`
    - Output: `false`
    - Explanation: There are a total of 2 courses to take.
To take course 1 you should have finished course 0, and to take course 0 you should also have finished course 1. So it is impossible.
- **Constraints**:
  - `1 <= numCourses <= 2000`
  - `0 <= prerequisites.length <= 5000`
  - `prerequisites[i].length == 2`
  - `0 <= ai, bi < numCourses`
  - All the pairs prerequisites[i] are unique.

- **套路**：拓樸排序判斷有無環
- **思路**：
  - 把 prerequisite 關係建成有向圖，並計算每門課的入度；入度為 `0` 代表目前沒有前置課，能先修。
  - 每次從 queue 取出一門可修課，就等於移除它的出邊；若最後能處理完全部課程，代表圖中沒有環。
- **TC**：O(V + E)
  - 建圖會走過每門課和每條 prerequisite 一次，BFS 過程也只會再處理每條邊一次。
- **SC**：O(V + E)
  - adjacency list、indegree 陣列和 queue 都與節點數、邊數成正比。
- **其他思路**：
  - DFS 三色標記：用 `0/1/2` 表示未訪問、正在遞迴、已完成；若走到正在遞迴的節點，就代表有環。
- **解法比較**：
  - Kahn 拓樸排序：很適合直接回答「能不能修完」以及後續延伸到輸出順序。
  - DFS 判環：不必維護入度，但遞迴狀態管理要更小心。
- **測試重點 (Testing)**：
  - 沒有任何 prerequisite，應回傳 `True`。
  - 簡單二點成環，應回傳 `False`。
  - 多個互不相干的課程群，確認會全部計入已處理數量。
  - 長鏈依賴與分支依賴混合，確認入度更新正確。

```python
from collections import deque


def canFinish(numCourses, prerequisites):
    graph = [[] for _ in range(numCourses)]
    indegree = [0] * numCourses

    for course, pre in prerequisites:
        graph[pre].append(course)
        indegree[course] += 1

    queue = deque([course for course in range(numCourses) if indegree[course] == 0])
    taken = 0

    while queue:
        course = queue.popleft()
        taken += 1
        for neighbor in graph[course]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                queue.append(neighbor)

    return taken == numCourses
```

### 210. Course Schedule II (Med.)

- **Problem (English)**: Given `numCourses` and prerequisite pairs, return a valid order to finish all courses, or an empty array if impossible. If there are multiple valid orders, return any of them.
- **題目（中文）**：給定 `numCourses` 與先修課關係，請回傳任一個可完成所有課程的合法修課順序；若不存在則回傳空陣列。若有多種合法答案，回傳任一種即可。

- **Examples**:
  - Example 1: `numCourses = 2, prerequisites = [[1,0]]`
    - Output: `[0,1]`
    - Explanation: There are a total of 2 courses to take. To take course 1 you should have finished course 0. So the correct course order is [0,1].
  - Example 2: `numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]`
    - Output: `[0,2,1,3]`
    - Explanation: There are a total of 4 courses to take. To take course 3 you should have finished both courses 1 and 2. Both courses 1 and 2 should be taken after you finished course 0.
So one correct course order is [0,1,2,3]. Another correct ordering is [0,2,1,3].
  - Example 3: `numCourses = 1, prerequisites = []`
    - Output: `[0]`
- **Constraints**:
  - `1 <= numCourses <= 2000`
  - `0 <= prerequisites.length <= numCourses * (numCourses - 1)`
  - `prerequisites[i].length == 2`
  - `0 <= ai, bi < numCourses`
  - `ai != bi`
  - All the pairs [ai, bi] are distinct.

- **套路**：拓樸排序輸出修課順序
- **思路**：
  - 和上一題相同，先把所有入度為 `0` 的課程入 queue，表示這些課可以立刻修。
  - 每次彈出一門課就把它加入答案序列，若最後序列長度不等於課程總數，代表圖中有環，因此不存在合法順序。
- **TC**：O(V + E)
  - 建圖與拓樸排序都只會對每個節點、每條邊處理固定次數。
- **SC**：O(V + E)
  - adjacency list、indegree 與輸出陣列都需要額外空間。
- **其他思路**：
  - DFS 後序遍歷：把節點在所有後繼處理完後加入答案，最後反轉即可得到拓樸序；若遞迴途中遇到回邊則代表有環。
- **解法比較**：
  - Kahn：容易保證輸出順序合法，也很好解釋為「每次拿一門現在能修的課」。
  - DFS 後序：對熟悉遞迴的人很自然，但 cycle detection 狀態較抽象。
- **測試重點 (Testing)**：
  - 有多種合法答案時，只要回傳任一合法序即可。
  - 圖中有環時，必須回傳空陣列。
  - 存在完全沒有關聯的課程，答案中也要包含它們。
  - 只有一門課或沒有 prerequisite 的小案例，確認 base case 正確。

```python
from collections import deque


def findOrder(numCourses, prerequisites):
    graph = [[] for _ in range(numCourses)]
    indegree = [0] * numCourses

    for course, pre in prerequisites:
        graph[pre].append(course)
        indegree[course] += 1

    queue = deque([course for course in range(numCourses) if indegree[course] == 0])
    order = []

    while queue:
        course = queue.popleft()
        order.append(course)
        for neighbor in graph[course]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                queue.append(neighbor)

    return order if len(order) == numCourses else []
```

### 721. Accounts Merge (Med.)

- **Problem (English)**: Given a list of accounts, merge accounts that belong to the same person because they share at least one email address. Return the merged accounts in any order, with emails sorted and the name preserved.
- **題目（中文）**：給定一組帳戶資料，若兩個帳戶至少共用一個電子郵件，就代表它們屬於同一個人。請合併後回傳結果，帳戶順序不限，但每筆帳戶中的 email 需排序且保留姓名。

- **Examples**:
  - Example 1: `accounts = [["John","johnsmith@mail.com","john_newyork@mail.com"],["John","johnsmith@mail.com","john00@mail.com"],["Mary","mary@mail.com"],["John","johnnybravo@mail.com"]]`
    - Output: `[["John","john00@mail.com","john_newyork@mail.com","johnsmith@mail.com"],["Mary","mary@mail.com"],["John","johnnybravo@mail.com"]]`
    - Explanation: The first and second John's are the same person as they have the common email "johnsmith@mail.com".
The third John and Mary are different people as none of their email addresses are used by other accounts.
We could return these lists in any order, for example the answer [['Mary', 'mary@mail.com'], ['John', 'johnnybravo@mail.com'],
['John', 'john00@mail.com', 'john_newyork@mail.com', 'johnsmith@mail.com']] would still be accepted.
  - Example 2: `accounts = [["Gabe","Gabe0@m.co","Gabe3@m.co","Gabe1@m.co"],["Kevin","Kevin3@m.co","Kevin5@m.co","Kevin0@m.co"],["Ethan","Ethan5@m.co","Ethan4@m.co","Ethan0@m.co"],["Hanzo","Hanzo3@m.co","Hanzo1@m.co","Hanzo0@m.co"],["Fern","Fern5@m.co","Fern1@m.co","Fern0@m.co"]]`
    - Output: `[["Ethan","Ethan0@m.co","Ethan4@m.co","Ethan5@m.co"],["Gabe","Gabe0@m.co","Gabe1@m.co","Gabe3@m.co"],["Hanzo","Hanzo0@m.co","Hanzo1@m.co","Hanzo3@m.co"],["Kevin","Kevin0@m.co","Kevin3@m.co","Kevin5@m.co"],["Fern","Fern0@m.co","Fern1@m.co","Fern5@m.co"]]`
- **Constraints**:
  - `1 <= accounts.length <= 1000`
  - `2 <= accounts[i].length <= 10`
  - `1 <= accounts[i][j].length <= 30`
  - accounts[i][0] consists of English letters.
  - accounts[i][j] (for j > 0) is a valid email.

- **套路**：Union Find 合併 email 所屬帳號
- **思路**：
  - 同一筆 account 裡的 email 一定屬於同一個人，所以可把第一個 email 當代表，將同帳號中的其他 email 全部 union 起來。
  - 合併完成後，只要把所有 email 依 root 分組，再把對應姓名放到最前面即可得到答案。
- **TC**：O(N * α(N) + N log N)
  - `N` 是 email 總數；union/find 幾乎是常數攤還成本，最後每組 email 還要排序，總排序成本最壞可到 O(N log N)。
- **SC**：O(N)
  - `parent`、`owner` 與分組結果都會把每個 email 至少存一次。
- **其他思路**：
  - 建圖 + DFS：把同帳號中的 email 兩兩連邊，最後找連通分量並依分量輸出。
- **解法比較**：
  - Union Find：對這種「看到一條關係就合併集合」的題型最自然。
  - DFS：若本來就習慣把 email 視為圖節點，會比較直覺，但需要額外建 adjacency list。
- **測試重點 (Testing)**：
  - 兩個帳號透過共同 email 串起來，應合併成同一人。
  - 名字相同但 email 完全不同，不能因名字一樣就合併。
  - 鏈式合併 `A-B`、`B-C`，確認最後三者全併在一起。
  - 帳號只有一個 email，確認也能正常輸出。

```python
from collections import defaultdict


def accountsMerge(accounts):
    parent = {}
    owner = {}

    def find(email):
        parent.setdefault(email, email)
        if parent[email] != email:
            parent[email] = find(parent[email])
        return parent[email]

    def union(a, b):
        parent[find(a)] = find(b)

    for account in accounts:
        name = account[0]
        first_email = account[1]
        for email in account[1:]:
            owner[email] = name
            union(first_email, email)

    groups = defaultdict(list)
    for email in owner:
        groups[find(email)].append(email)

    return [[owner[root]] + sorted(emails) for root, emails in groups.items()]
```

### 261. Graph Valid Tree (Med.)

- **Problem (English)**:
  - You have a graph of `n` nodes labeled from `0` to `n - 1`.
  - `edges[i] = [a_i, b_i]` indicates an undirected edge between nodes `a_i` and `b_i`.
  - Return `true` if the given edges make up a valid tree, and `false` otherwise.
- **題目（中文）**：
  - 給定一張有 `n` 個節點、編號從 `0` 到 `n - 1` 的圖。
  - `edges[i] = [a_i, b_i]` 表示節點 `a_i` 與 `b_i` 之間有一條無向邊。
  - 若這些邊能構成一棵合法的樹，回傳 `true`；否則回傳 `false`。
- **Examples**:
  - Example 1: `n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]`
    - Output: `true`
  - Example 2: `n = 5, edges = [[0,1],[1,2],[2,3],[1,3],[1,4]]`
    - Output: `false`
- **Constraints**:
  - `1 <= n <= 2000`
  - `0 <= edges.length <= 5000`
  - `edges[i].length == 2`
  - `0 <= a_i, b_i < n`
  - `a_i != b_i`
  - There are no self-loops or repeated edges.

- **套路**：Union Find + 邊數檢查
- **思路**：
  - 一棵樹要同時滿足兩件事：邊數必須是 `n - 1`，而且不能有環；缺一不可。
  - 先用邊數做快速剪枝，再用 Union Find 合併每條邊；若某條邊的兩端本來就在同一集合，代表形成環，不是樹。
- **TC**：O(n + e * α(n))
  - 初始化 parent 需要 O(n)，之後每條邊做常數次 union/find。
- **SC**：O(n)
  - 只需要 parent 陣列與遞迴壓縮時的少量額外空間。
- **其他思路**：
  - DFS/BFS：先建 adjacency list，檢查邊數是否為 `n - 1`，再從任一節點出發看是否能拜訪全部節點。
- **解法比較**：
  - Union Find：不用真的走訪整張圖，就能快速判斷是否出現環。
  - DFS/BFS：若後續還要取出實際 traversal 或節點關係，建圖後會更方便延伸。
- **測試重點 (Testing)**：
  - `n = 1` 且沒有邊，答案應為 `True`。
  - 邊數不是 `n - 1`，應直接回傳 `False`。
  - 有環的圖，即使邊數接近，也不能算樹。
  - 不連通的圖，應回傳 `False`。

```python
def validTree(n, edges):
    if len(edges) != n - 1:
        return False

    parent = list(range(n))

    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    for a, b in edges:
        pa, pb = find(a), find(b)
        if pa == pb:
            return False
        parent[pa] = pb

    return True
```

### 323. Number of Connected Components in an Undirected Graph (Med.)

- **Problem (English)**:
  - You have a graph of `n` nodes.
  - `edges[i] = [a_i, b_i]` indicates there is an undirected edge between `a_i` and `b_i`.
  - Return the number of connected components in the graph.
- **題目（中文）**：
  - 給定一張有 `n` 個節點的圖。
  - `edges[i] = [a_i, b_i]` 表示 `a_i` 與 `b_i` 之間有一條無向邊。
  - 請回傳這張圖中的連通分量數量。
- **Examples**:
  - Example 1: `n = 5, edges = [[0,1],[1,2],[3,4]]`
    - Output: `2`
  - Example 2: `n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]`
    - Output: `1`
- **Constraints**:
  - `1 <= n <= 2000`
  - `1 <= edges.length <= 5000`
  - `edges[i].length == 2`
  - `0 <= a_i <= b_i < n`
  - `a_i != b_i`
  - There are no repeated edges.

- **套路**：Union Find / DFS 計算連通塊
- **思路**：
  - 一開始每個節點都是自己的 component，數量先設成 `n`。
  - 每當一條邊成功把兩個不同集合 union 起來，component 數量就減一；最後剩下的數字就是答案。
- **TC**：O(n + e * α(n))
  - 初始化 `parent` 是 O(n)，每條邊只做固定次數的 union/find。
- **SC**：O(n)
  - Union Find 只需要 parent 陣列與少量遞迴壓縮空間。
- **其他思路**：
  - DFS/BFS：先建無向圖 adjacency list，然後從每個未訪問節點出發做一次搜尋，每啟動一次就是一個 component。
- **解法比較**：
  - Union Find：適合邊一條條進來時即時更新 component 數量。
  - DFS/BFS：若題目同時還要列出每個 component 成員，遍歷圖會更直接。
- **測試重點 (Testing)**：
  - 沒有任何邊，答案應為 `n`。
  - 所有節點都連在一起，答案應為 `1`。
  - 多個小型 component 混合，確認 union 成功次數正確。
  - 存在冗餘邊時，不應把 component 重複減少。

```python
def countComponents(n, edges):
    parent = list(range(n))
    components = n

    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    for a, b in edges:
        pa, pb = find(a), find(b)
        if pa != pb:
            parent[pa] = pb
            components -= 1

    return components
```

### 269. Alien Dictionary (Hard)

- **Problem (English)**:
  - There is a new alien language that uses the English alphabet, but the order of the letters is unknown.
  - You are given a list of words that are already sorted lexicographically according to this alien language.
  - If the given ordering is invalid, return `""`. Otherwise, return a string of the unique letters in lexicographically increasing order by the alien language. If multiple valid orders exist, return any of them.
- **題目（中文）**：
  - 有一種新的外星語言使用英文字母，但字母順序未知。
  - 給定一串已依照外星語言字典序排序好的單字列表。
  - 若這份排序不可能成立，請回傳 `""`；否則請回傳由所有出現過的唯一字元組成、依外星語言字典序遞增排列的字串。若有多種合法答案，回傳任一種即可。
- **Examples**: Input: words = ["wrt","wrf","er","ett","rftt"] → Output: "wertf"; Input: words = ["z","x"] → Output: "zx"; Input: words = ["z","x","z"] → Output: ""
- **Constraints**:
  - `1 <= words.length <= 100`
  - `1 <= words[i].length <= 100`
  - `words[i]` consists of lowercase English letters.

- **套路**：建字元圖後做拓樸排序
- **思路**：
  - 比較相鄰兩個單字時，第一個不同字元 `a != b` 就能確定 `a -> b` 的先後順序；之後的字元不用再看。
  - 若前一個字比較長，且後一個字是它的前綴，排序規則會自相矛盾；建完圖後再用 Kahn 拓樸排序，若無法輸出全部字元就代表有環。
- **TC**：O(total_chars)
  - 比較相鄰單字總共只會掃過有限字元，拓樸排序再額外處理每個字元與每條字元邊一次。
- **SC**：O(unique_chars + edges)
  - adjacency set、indegree 與 queue 都只和唯一字元數及關係邊數有關。
- **其他思路**：
  - DFS 拓樸排序：用三色標記做 cycle detection，離開節點時把字元加入答案，最後反轉。
- **解法比較**：
  - Kahn：很容易檢查是否成功處理完全部字元，對判斷有環很直接。
  - DFS：後序結果自然就是拓樸序，但狀態管理與 invalid cycle 判斷較容易寫錯。
- **測試重點 (Testing)**：
  - 無效前綴，如 `['abc', 'ab']`，必須回傳空字串。
  - 只有一個單字時，答案至少要包含所有出現過的字元。
  - 有多種合法答案的案例，確認只要輸出任一合法序即可。
  - 含環或矛盾順序時，應回傳空字串。

```python
from collections import deque


def alienOrder(words):
    graph = {char: set() for word in words for char in word}
    indegree = {char: 0 for char in graph}

    for i in range(len(words) - 1):
        first, second = words[i], words[i + 1]
        if len(first) > len(second) and first.startswith(second):
            return ""

        for a, b in zip(first, second):
            if a != b:
                if b not in graph[a]:
                    graph[a].add(b)
                    indegree[b] += 1
                break

    queue = deque([char for char, degree in indegree.items() if degree == 0])
    order = []

    while queue:
        char = queue.popleft()
        order.append(char)
        for neighbor in graph[char]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                queue.append(neighbor)

    return "".join(order) if len(order) == len(graph) else ""
```

### 127. Word Ladder (Hard)

- **Problem (English)**: Given a start word, an end word, and a dictionary of words, return the length of the shortest transformation sequence where each step changes only one letter and must be a valid dictionary word.
- **題目（中文）**：給定起始字、終止字和字典，返回最短轉換序列的長度，其中每步只改一個字母且必須是字典中的有效字。

- **Examples**:
  - Example 1: `beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]`
    - Output: `5`
    - Explanation: One shortest transformation sequence is "hit" -> "hot" -> "dot" -> "dog" -> cog", which is 5 words long.
  - Example 2: `beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]`
    - Output: `0`
    - Explanation: The endWord "cog" is not in wordList, therefore there is no valid transformation sequence.
- **Constraints**:
  - `1 <= beginWord.length <= 10`
  - `endWord.length == beginWord.length`
  - `1 <= wordList.length <= 5000`
  - `wordList[i].length == beginWord.length`
  - beginWord, endWord, and wordList[i] consist of lowercase English letters.
  - `beginWord != endWord`
  - All the words in wordList are unique.

- **套路**：BFS 最短轉換步數 + wildcard 鄰居映射
- **思路**：
  - 每個合法轉換都只改一個字母，因此可以先把單字映射到像 `h*t`、`*ot` 這種 pattern，之後就能快速找到只差一個字母的鄰居。
  - 這是一張無權圖，從 `beginWord` 做 BFS 時，第一次到達 `endWord` 的步數就是最短轉換長度。
- **TC**：O(N * L^2)
  - `N` 是單字數、`L` 是單字長度；建立每個 pattern 需要切字串，BFS 過程中每個單字的 `L` 個 pattern 也只會被有效處理固定次數。
- **SC**：O(N * L)
  - pattern 映射、visited 與 queue 都與單字數及每個單字的 pattern 數量成正比。
- **其他思路**：
  - 雙向 BFS：同時從 `beginWord` 和 `endWord` 擴展，通常能大幅縮小搜尋層數。
- **解法比較**：
  - 一般 BFS：概念最單純，最容易保證正確性。
  - 雙向 BFS：在字典很大時更快，但需要更細緻地同步兩側 frontier。
- **測試重點 (Testing)**：
  - `endWord` 不在字典中，應直接回傳 `0`。
  - 只差一步即可到達，確認答案是 `2`（包含起點與終點）。
  - 有多條轉換路徑時，必須選最短那條。
  - 字典中有很多干擾單字，確認 visited 能防止重複擴展。

```python
from collections import defaultdict, deque


def ladderLength(beginWord, endWord, wordList):
    if endWord not in wordList:
        return 0

    pattern_to_words = defaultdict(list)
    all_words = wordList + [beginWord]

    for word in all_words:
        for i in range(len(word)):
            pattern = word[:i] + "*" + word[i + 1:]
            pattern_to_words[pattern].append(word)

    queue = deque([(beginWord, 1)])
    visited = {beginWord}

    while queue:
        word, steps = queue.popleft()
        if word == endWord:
            return steps

        for i in range(len(word)):
            pattern = word[:i] + "*" + word[i + 1:]
            for neighbor in pattern_to_words[pattern]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append((neighbor, steps + 1))
            pattern_to_words[pattern] = []

    return 0
```

### 787. Cheapest Flights Within K Stops (Med.)

- **Problem (English)**: Given n cities, flight routes with prices, a source, destination, and maximum stops k, return the minimum cost to reach the destination or -1 if impossible.
- **題目（中文）**：給定 n 個城市、標記價格的航線、來源、目標和最多中轉次數 k，返回到達目標的最低成本或 -1。

- **Examples**:
  - Example 1: `n = 4, flights = [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src = 0, dst = 3, k = 1`
    - Output: `700`
    - Explanation: The graph is shown above.
The optimal path with at most 1 stop from city 0 to 3 is marked in red and has cost 100 + 600 = 700.
Note that the path through cities [0,1,2,3] is cheaper but is invalid because it uses 2 stops.
  - Example 2: `n = 3, flights = [[0,1,100],[1,2,100],[0,2,500]], src = 0, dst = 2, k = 1`
    - Output: `200`
    - Explanation: The graph is shown above.
The optimal path with at most 1 stop from city 0 to 2 is marked in red and has cost 100 + 100 = 200.
  - Example 3: `n = 3, flights = [[0,1,100],[1,2,100],[0,2,500]], src = 0, dst = 2, k = 0`
    - Output: `500`
    - Explanation: The graph is shown above.
The optimal path with no stops from city 0 to 2 is marked in red and has cost 500.
- **Constraints**:
  - `2 <= n <= 100`
  - `0 <= flights.length <= (n * (n - 1) / 2)`
  - `flights[i].length == 3`
  - `0 <= fromi, toi < n`
  - `fromi != toi`
  - `1 <= pricei <= 10^4`
  - There will not be any multiple flights between two cities.
  - `0 <= src, dst, k < n`
  - `src != dst`

- **套路**：Bellman-Ford 限制邊數
- **思路**：
  - 最多 `k` 次中轉，等價於最多使用 `k + 1` 條邊；因此只要做 `k + 1` 輪鬆弛即可。
  - 每一輪都必須基於上一輪的結果更新新陣列，這樣才能保證同一輪不會偷用超過限制的邊數。
- **TC**：O(k * E)
  - 每一輪都完整掃過所有航班邊，共做 `k + 1` 輪。
- **SC**：O(n)
  - 只需要兩個長度為城市數 `n` 的價格陣列。
- **其他思路**：
  - 最小堆 / Dijkstra 變形：把狀態擴充成 `(cost, city, used_edges)`，用優先佇列優先擴展便宜路徑。
- **解法比較**：
  - Bellman-Ford：對「最多走幾條邊」的限制非常直觀，不容易寫錯。
  - Heap 變形：在圖很稀疏時可能提早剪枝，但狀態去重與比較規則更複雜。
- **測試重點 (Testing)**：
  - 剛好需要 `k` 次中轉才能到達，確認不會被誤判為不可達。
  - 便宜路徑需要更多中轉，但超過限制時不能用。
  - 直飛雖貴但中轉限制下仍是唯一可行解。
  - 完全不可達時，應回傳 `-1`。

```python
def findCheapestPrice(n, flights, src, dst, k):
    prices = [float("inf")] * n
    prices[src] = 0

    for _ in range(k + 1):
        next_prices = prices[:]
        for start, end, cost in flights:
            if prices[start] != float("inf"):
                next_prices[end] = min(next_prices[end], prices[start] + cost)
        prices = next_prices

    return -1 if prices[dst] == float("inf") else prices[dst]
```

### 1197. Minimum Knight Moves (Med.)

- **Problem (English)**:
  - On an infinite chessboard with coordinates from `-infinity` to `+infinity`, a knight starts at square `[0, 0]`.
  - Return the minimum number of moves needed to reach square `[x, y]`.
- **題目（中文）**：
  - 在一個座標範圍可延伸到 `-infinity` 到 `+infinity` 的無限棋盤上，有一匹騎士從 `[0, 0]` 出發。
  - 請回傳它移動到 `[x, y]` 所需的最少步數。
- **Examples**:
  - Example 1: `x = 2, y = 1`
    - Output: `1`
    - Explanation: `[0, 0] -> [2, 1]`
  - Example 2: `x = 5, y = 5`
    - Output: `4`
    - Explanation: `[0, 0] -> [2, 1] -> [4, 2] -> [3, 4] -> [5, 5]`
- **Constraints**:
  - `-300 <= x, y <= 300`
  - `0 <= |x| + |y| <= 300`

- **套路**：BFS + 利用對稱性縮小搜尋空間
- **思路**：
  - 騎士走法對四象限對稱，所以可先把目標轉成第一象限的 `(abs(x), abs(y))`，減少重複狀態。
  - 之後從 `(0, 0)` 做 BFS，第一次走到目標的層數就是最短步數；為了不漏最短路，搜尋範圍只需稍微允許進到負座標一點點。
- **TC**：O(x * y)
  - 利用對稱性後，實際會探索的狀態被限制在目標周圍常數倍矩形區域內，每個狀態只進 queue 一次。
- **SC**：O(x * y)
  - `visited` 與 queue 都會儲存探索過的棋盤位置。
- **其他思路**：
  - 雙向 BFS：從起點與終點同時擴展，對大座標時通常更快收斂。
- **解法比較**：
  - 單向 BFS：寫法簡單，證明也直接。
  - 雙向 BFS：狀態數更少，但 frontier 交換與 visited 管理更繁瑣。
- **測試重點 (Testing)**：
  - 目標就是原點 `(0, 0)`，答案應為 `0`。
  - 小範圍特例如 `(1, 1)`、`(2, 1)`，確認沒有被錯誤剪枝。
  - 負座標輸入應和對應正座標得到相同答案。
  - 較大座標，確認演算法仍能正常收斂。

```python
from collections import deque


def minKnightMoves(x, y):
    x, y = abs(x), abs(y)
    moves = [(1, 2), (2, 1), (-1, 2), (-2, 1), (1, -2), (2, -1), (-1, -2), (-2, -1)]
    queue = deque([(0, 0, 0)])
    visited = {(0, 0)}

    while queue:
        r, c, steps = queue.popleft()
        if (r, c) == (x, y):
            return steps

        for dr, dc in moves:
            nr, nc = r + dr, c + dc
            if nr >= -2 and nc >= -2 and (nr, nc) not in visited:
                visited.add((nr, nc))
                queue.append((nr, nc, steps + 1))
```

### 1730. Shortest Path to Get Food (Med.)

- **Problem (English)**:
  - You are given an `m x n` character matrix `grid`.
  - `'*'` is your location, and there is exactly one `'*'` in the grid.
  - `'#'` is a food cell, there may be multiple food cells, `'O'` is free space, and `'X'` is an obstacle.
  - You may move north, east, south, or west to an adjacent non-obstacle cell.
  - Return the length of the shortest path to reach any food cell, or `-1` if impossible.
- **題目（中文）**：
  - 給定一個 `m x n` 的字元矩陣 `grid`。
  - `'*'` 代表你的起點，且整張圖中恰好只有一個 `'*'`。
  - `'#'` 代表食物，可能有多個；`'O'` 代表可通行空地；`'X'` 代表障礙物。
  - 你每次可以往上、右、下、左移動到相鄰且不是障礙物的格子。
  - 請回傳到達任一食物格的最短路徑長度；若無法到達，回傳 `-1`。
- **Examples**:
  - Example 1: `grid = [["X","X","X","X","X","X"],["X","*","O","O","O","X"],["X","O","O","#","O","X"],["X","X","X","X","X","X"]]`
    - Output: `3`
  - Example 2: `grid = [["X","X","X","X","X"],["X","*","X","O","X"],["X","O","X","#","X"],["X","X","X","X","X"]]`
    - Output: `-1`
  - Example 3: `grid = [["X","X","X","X","X","X","X","X"],["X","*","O","X","O","#","O","X"],["X","O","O","X","O","O","X","X"],["X","O","O","O","O","#","O","X"],["X","X","X","X","X","X","X","X"]]`
    - Output: `6`
    - Explanation: There can be multiple food cells; the bottom food is the closest reachable one.
  - Example 4: `grid = [["X","X","X","X","X","X","X","X"],["X","*","O","X","O","#","O","X"],["X","O","O","X","O","O","X","X"],["X","O","O","O","O","#","O","X"],["O","O","O","O","O","O","O","O"]]`
    - Output: `5`
- **Constraints**:
  - `m == grid.length`
  - `n == grid[i].length`
  - `1 <= m, n <= 200`
  - `grid[row][col]` is `'*'`, `'X'`, `'O'`, or `'#'`.
  - The grid contains exactly one `'*'`.

- **套路**：網格 BFS 最短路徑
- **思路**：
  - 從唯一的起點 `*` 出發做 BFS，牆 `X` 不能走，空地 `O` 和食物 `#` 可以走。
  - 因為網格每走一步成本都相同，所以第一次走到任何一個 `#` 時，當前步數就是最短距離。
- **TC**：O(m * n)
  - 每個可走格子最多只會被加入 queue 一次。
- **SC**：O(m * n)
  - `visited` 與 queue 最壞情況可能包含整張可達網格。
- **其他思路**：
  - 反向多源 BFS：把所有食物格子同時入 queue，反過來找起點 `*`，本質上得到相同最短距離。
- **解法比較**：
  - 從起點 BFS：題意最直觀，而且起點只有一個時初始化最簡單。
  - 從食物反推：若未來題目改成很多目標點、想找離起點最近者，會更方便延伸。
- **測試重點 (Testing)**：
  - 食物就在起點旁邊，答案應為 `1`。
  - 食物被牆完全擋住，應回傳 `-1`。
  - 有多個食物時，必須回傳最近那一個的距離。
  - 迷宮中有很多死路，確認 visited 能避免重複繞圈。

```python
from collections import deque


def getFood(grid):
    rows, cols = len(grid), len(grid[0])
    queue = deque()
    visited = set()

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "*":
                queue.append((r, c, 0))
                visited.add((r, c))

    while queue:
        r, c, steps = queue.popleft()
        if grid[r][c] == "#":
            return steps

        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and (nr, nc) not in visited and grid[nr][nc] != "X":
                visited.add((nr, nc))
                queue.append((nr, nc, steps + 1))

    return -1
```

### 815. Bus Routes (Hard)

- **Problem (English)**: Given bus routes (each stop in a route is reachable), find the minimum number of buses needed to travel from source to target.
- **題目（中文）**：給定公車路線(每條路線中的站點可到達)，找從起點到目標所需的最少公車數。

- **Examples**:
  - Example 1: `routes = [[1,2,7],[3,6,7]], source = 1, target = 6`
    - Output: `2`
    - Explanation: The best strategy is take the first bus to the bus stop 7, then take the second bus to the bus stop 6.
  - Example 2: `routes = [[7,12],[4,5,15],[6],[15,19],[9,12,13]], source = 15, target = 12`
    - Output: `-1`
- **Constraints**:
  - 1 <= routes.length <= 500.
  - `1 <= routes[i].length <= 10^5`
  - All the values of routes[i] are unique.
  - `sum(routes[i].length) <= 10^5`
  - `0 <= routes[i][j] < 10^6`
  - `0 <= source, target < 10^6`

- **套路**：站點到路線映射 + BFS
- **思路**：
  - 乘客真正做的動作是「在某個站上某條路線」，所以先建立 `stop -> routes` 映射，才能從目前站點快速找到所有可搭的公車。
  - BFS 每擴展一條新路線就代表多搭了一班車；當某條路線包含 `target` 時，當前公車數加一就是最少搭車次數。
- **TC**：O(total_stops)
  - 每條路線最多只會被處理一次，每個站點也只會被加入 queue 一次，所以總成本和所有站點出現次數成正比。
- **SC**：O(total_stops)
  - `stop_to_routes`、`visited_stops`、`used_routes` 與 queue 都需要依輸入規模儲存資料。
- **其他思路**：
  - 路線圖 BFS：先把每條 route 視為圖節點，若兩條 route 有共同站點就連邊，再從包含 `source` 的路線群 BFS 到包含 `target` 的路線群。
- **解法比較**：
  - 站點 BFS：避免先建 route-to-route 的二次關係，通常更省事。
  - 路線圖 BFS：如果同一組 routes 會被多次查詢不同起終點，預先建 route graph 可能更有價值。
- **測試重點 (Testing)**：
  - `source == target`，答案應為 `0`。
  - 起點和終點在同一條路線上，答案應為 `1`。
  - 需要多次轉乘，確認公車數量而不是站點距離被正確計算。
  - 目標站不存在於任何可達路線時，應回傳 `-1`。

```python
from collections import defaultdict, deque


def numBusesToDestination(routes, source, target):
    if source == target:
        return 0

    stop_to_routes = defaultdict(list)
    for route_index, route in enumerate(routes):
        for stop in route:
            stop_to_routes[stop].append(route_index)

    queue = deque([(source, 0)])
    visited_stops = {source}
    used_routes = set()

    while queue:
        stop, buses = queue.popleft()
        for route_index in stop_to_routes[stop]:
            if route_index in used_routes:
                continue

            used_routes.add(route_index)
            for next_stop in routes[route_index]:
                if next_stop == target:
                    return buses + 1
                if next_stop not in visited_stops:
                    visited_stops.add(next_stop)
                    queue.append((next_stop, buses + 1))

    return -1
```
