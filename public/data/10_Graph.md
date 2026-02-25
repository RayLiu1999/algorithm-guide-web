# 十、Graph（圖論）

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

### 200. Number of Islands (Med.)

- **套路**：DFS/BFS 連通分量
- **思路**：遍歷網格，遇到 '1' 就啟動 DFS 把整座島標記為已訪問。啟動次數 = 島嶼數。
- **💡 白話文解說**：想像你在直升機上往下看這片海。你只要看到有陸地，就投下一個標記，然後沿著這塊陸地能碰到水的地方一路探索到底。探索完這整片就是一座島！再繼續飛找下一塊新的陸地。
- **複雜度**：O(m·n) / O(m·n)

```python
def numIslands(grid):
    count = 0
    m, n = len(grid), len(grid[0])
    def dfs(i, j):
        if i < 0 or i >= m or j < 0 or j >= n or grid[i][j] != '1':
            return
        grid[i][j] = '0'  # 標記已訪問
        dfs(i+1,j); dfs(i-1,j); dfs(i,j+1); dfs(i,j-1)
    for i in range(m):
        for j in range(n):
            if grid[i][j] == '1':
                dfs(i, j)
                count += 1
    return count
```

### 733. Flood Fill (Easy)

- **套路**：DFS/BFS 擴散
- **💡 白話文解說**：這就是小畫家裡面的「油漆桶工具」。你點到哪一格，它就開始把那格周邊（上下左右）全部相同原色的地方，一路渲染成新的顏色，直到遇到邊界或是其他顏色的阻擋才停下。
- **思路**：從起點開始，把所有相同顏色的格子染成新顏色。
- **複雜度**：O(m·n) / O(m·n)

```python
def floodFill(image, sr, sc, color):
    original = image[sr][sc]
    if original == color:
        return image
    m, n = len(image), len(image[0])
    def dfs(i, j):
        if i < 0 or i >= m or j < 0 or j >= n or image[i][j] != original:
            return
        image[i][j] = color
        dfs(i+1,j); dfs(i-1,j); dfs(i,j+1); dfs(i,j-1)
    dfs(sr, sc)
    return image
```

### 994. Rotting Oranges (Med.)

- **套路**：多源 BFS
- **思路**：一開始把所有腐爛的橘子全部放入 Queue（多個起點），然後 BFS 層層擴散。層數 = 分鐘數。
- **💡 白話文解說**：你可以把腐爛的橘子當作傳染病帶原者。每過一分鐘，它們就會傳染給隔壁健康的新橘子。我們把所有帶原橘子放進等待名單，一分鐘一分鐘地擴散，最後檢查還有沒有沒被傳染到的健康橘子。
- **複雜度**：O(m·n) / O(m·n)

```python
from collections import deque

def orangesRotting(grid):
    m, n = len(grid), len(grid[0])
    queue = deque()
    fresh = 0
    for i in range(m):
        for j in range(n):
            if grid[i][j] == 2:
                queue.append((i, j))
            elif grid[i][j] == 1:
                fresh += 1
    minutes = 0
    while queue and fresh:
        minutes += 1
        for _ in range(len(queue)):
            x, y = queue.popleft()
            for dx, dy in [(1,0),(-1,0),(0,1),(0,-1)]:
                nx, ny = x+dx, y+dy
                if 0 <= nx < m and 0 <= ny < n and grid[nx][ny] == 1:
                    grid[nx][ny] = 2
                    fresh -= 1
                    queue.append((nx, ny))
    return minutes if fresh == 0 else -1
```

### 542. 01 Matrix (Med.)

- **套路**：多源 BFS（從 0 開始擴散）
- **💡 白話文解說**：這次是從 0 的視角出發找 1！想像 0 是水源地，1 是乾涸的農田。水源地同時朝四面八方流出去，每流過一格（一分鐘）距離就加 1。這樣流到的第一格剛好就是農田距離最近水源地的步數。
- **思路**：所有 0 作為起點，BFS 向外擴散計算每個 1 到最近 0 的距離。
- **複雜度**：O(m·n) / O(m·n)

```python
from collections import deque

def updateMatrix(mat):
    m, n = len(mat), len(mat[0])
    queue = deque()
    for i in range(m):
        for j in range(n):
            if mat[i][j] == 0:
                queue.append((i, j))
            else:
                mat[i][j] = float('inf')
    while queue:
        x, y = queue.popleft()
        for dx, dy in [(1,0),(-1,0),(0,1),(0,-1)]:
            nx, ny = x+dx, y+dy
            if 0 <= nx < m and 0 <= ny < n and mat[nx][ny] > mat[x][y] + 1:
                mat[nx][ny] = mat[x][y] + 1
                queue.append((nx, ny))
    return mat
```

### 417. Pacific Atlantic Water Flow (Med.)

- **套路**：從邊界反向 DFS/BFS
- **💡 白話文解說**：這題很有趣！我們想像從「太平洋」和「大西洋」分別倒水上去，看看水最高能爬上哪些陸地（要嘛平、要嘛往上爬）。只要有一塊陸地「既被太平洋的水淹到，也被大西洋的水淹到」，那就是雨水會分別流進兩邊的大陸分水嶺。
- **思路**：從太平洋邊界做 DFS 找哪些能流到太平洋，從大西洋邊界做 DFS 找哪些能流到大西洋。取交集。
- **複雜度**：O(m·n) / O(m·n)

```python
def pacificAtlantic(heights):
    m, n = len(heights), len(heights[0])
    pacific = set()
    atlantic = set()
    def dfs(i, j, reachable):
        reachable.add((i, j))
        for di, dj in [(1,0),(-1,0),(0,1),(0,-1)]:
            ni, nj = i+di, j+dj
            if (0 <= ni < m and 0 <= nj < n and
                (ni, nj) not in reachable and heights[ni][nj] >= heights[i][j]):
                dfs(ni, nj, reachable)
    for i in range(m):
        dfs(i, 0, pacific)
        dfs(i, n-1, atlantic)
    for j in range(n):
        dfs(0, j, pacific)
        dfs(m-1, j, atlantic)
    return list(pacific & atlantic)
```

### 133. Clone Graph (Med.)

- **套路**：DFS/BFS + Hash Map 記錄 old→new
- **思路**：遍歷圖的同時建立複製節點，用 Hash Map 避免重複複製。
- **💡 白話文解說**：這是二分搜尋最抽象的一題。你要找兩群人排隊的「中位數」，其實就是要在這兩條隊伍中各畫一條線，使得「左半邊的總人數 = 右半邊的總人數」，而且「左半邊所有人都比右半邊小」。只要我們對較短的那條隊伍做二分搜尋來決定畫線位置就可以了。
- **複雜度**：O(V+E) / O(V)

```python
def cloneGraph(node):
    if not node:
        return None
    cloned = {}
    def dfs(n):
        if n in cloned:
            return cloned[n]
        copy = Node(n.val)
        cloned[n] = copy
        for neighbor in n.neighbors:
            copy.neighbors.append(dfs(neighbor))
        return copy
    return dfs(node)
```

### 207. Course Schedule (Med.)

- **套路**：拓撲排序（BFS - Kahn's Algorithm）
- **💡 白話文解說**：大學選課系統！每個課程都有前置條件（一定要先修Ａ才能修Ｂ）。只要找到「沒有前置課程」的心結先解開修完它，所有被它擋住的課程「心靈負擔」就會減輕。如果最後有些課永遠解不開（循環依賴），那就無法畢業了。
- **思路**：建立入度表和鄰接表。從入度為 0 的節點開始 (不需要前置課程)，逐一移除並更新入度。最後能全部修完就沒有環。
- **複雜度**：O(V+E) / O(V+E)

```python
from collections import deque, defaultdict

def canFinish(numCourses, prerequisites):
    graph = defaultdict(list)
    in_degree = [0] * numCourses
    for course, prereq in prerequisites:
        graph[prereq].append(course)
        in_degree[course] += 1
    queue = deque(i for i in range(numCourses) if in_degree[i] == 0)
    count = 0
    while queue:
        node = queue.popleft()
        count += 1
        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    return count == numCourses
```

### 210. Course Schedule II (Med.)

- **套路**：拓撲排序 + 記錄順序
- **💡 白話文解說**：承接排課的問題。當一個「沒有前置課程的絆腳石」被你修掉時，你就順便把它加進你的「成績單（選課順序）」。只要一路順暢地加到最後發現學分都修滿了，那這份成績單就是正確的通關路線。
- **思路**：同 Course Schedule，但把 BFS 出列的順序記錄下來就是合法的修課順序。
- **複雜度**：O(V+E) / O(V+E)

```python
from collections import deque, defaultdict

def findOrder(numCourses, prerequisites):
    graph = defaultdict(list)
    in_degree = [0] * numCourses
    for course, prereq in prerequisites:
        graph[prereq].append(course)
        in_degree[course] += 1
    queue = deque(i for i in range(numCourses) if in_degree[i] == 0)
    order = []
    while queue:
        node = queue.popleft()
        order.append(node)
        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    return order if len(order) == numCourses else []
```

### 721. Accounts Merge (Med.)

- **套路**：Union Find
- **💡 白話文解說**：每個帳號都有自己的信箱，如果兩個帳號擁有「至少一個一模一樣的信箱」，那他們根本就是同一個人。這就像把所有信箱當成麻吉，只要同一個帳號就是連在一起的麻吉小圈圈（Union Find），最後我們只要照名單找出幾個派系小圈圈幫他們取名字就好了。
- **思路**：每個 email 都有一個擁有者。用 Union Find 把屬於同一帳號的 email 合併，最後按照根節點分組。
- **複雜度**：O(n·α(n)) / O(n)

```python
from collections import defaultdict

def accountsMerge(accounts):
    parent = {}
    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]
    def union(x, y):
        parent[find(x)] = find(y)

    email_to_name = {}
    for account in accounts:
        name = account[0]
        for email in account[1:]:
            if email not in parent:
                parent[email] = email
            email_to_name[email] = name
            union(account[1], email)  # 同帳號的 email 全部合併

    groups = defaultdict(list)
    for email in parent:
        groups[find(email)].append(email)
    return [[email_to_name[root]] + sorted(emails) for root, emails in groups.items()]
```

### 261. Graph Valid Tree (Med.)

- **套路**：Union Find（邊數 = n-1 且無環）
- **💡 白話文解說**：在密室逃脫裡，一個圖能構成「樹」有兩個鐵則：第一，總共只能有 節點數扣一 條線（線太少連不起來、太多絕對會結網）。第二，所有節點最後都要拉在一塊！如果拉線的時候發現「這兩個傢伙早就同一派了還拉在一起」，那就是有環結網了。
- **思路**：樹 = n-1 條邊 + 所有節點連通 + 無環。用 Union Find，如果 union 時發現已連通就有環。
- **複雜度**：O(n·α(n)) / O(n)

```python
def validTree(n, edges):
    if len(edges) != n - 1:
        return False
    parent = list(range(n))
    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]
    for u, v in edges:
        pu, pv = find(u), find(v)
        if pu == pv:
            return False  # 環
        parent[pu] = pv
    return True
```

### 323. Number of Connected Components in an Undirected Graph (Med.)

- **套路**：Union Find 計數
- **💡 白話文解說**：初始狀態大家各自為政（N 個孤島）。每當我們發現一條線把兩個人連在一起，就代表少了一個需要獨立統治的島噢。最後算算剩幾個島主就是答案！
- **思路**：初始 n 個連通分量，每成功 union 一次就 -1。
- **複雜度**：O(n·α(n)) / O(n)

```python
def countComponents(n, edges):
    parent = list(range(n))
    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]
    components = n
    for u, v in edges:
        pu, pv = find(u), find(v)
        if pu != pv:
            parent[pu] = pv
            components -= 1
    return components
```

### 269. Alien Dictionary (Hard)

- **套路**：拓撲排序
- **💡 白話文解說**：這是分析外星語「誰先誰後」的密碼學。只要把相鄰的字上下比較，看到第一個不一樣的字母如 W 變成 E，就代表在外星球字典裡 W 一定排在 E 前面。有了這份順序圖鑑後，就能用排課法則（拓撲 sorting）算出它的 ABC 歌。
- **思路**：比較相鄰兩個單字找出字母的先後順序，建立有向圖。拓撲排序出合法順序。
- **複雜度**：O(C) / O(1)，C = 所有字元總數

```python
from collections import defaultdict, deque

def alienOrder(words):
    graph = defaultdict(set)
    in_degree = {ch: 0 for word in words for ch in word}
    for i in range(len(words) - 1):
        w1, w2 = words[i], words[i+1]
        min_len = min(len(w1), len(w2))
        if len(w1) > len(w2) and w1[:min_len] == w2[:min_len]:
            return ""  # 無效：longer word 在前
        for j in range(min_len):
            if w1[j] != w2[j]:
                if w2[j] not in graph[w1[j]]:
                    graph[w1[j]].add(w2[j])
                    in_degree[w2[j]] += 1
                break
    queue = deque(ch for ch in in_degree if in_degree[ch] == 0)
    result = []
    while queue:
        ch = queue.popleft()
        result.append(ch)
        for neighbor in graph[ch]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    return ''.join(result) if len(result) == len(in_degree) else ""
```

### 127. Word Ladder (Hard)

- **套路**：BFS 最短路徑
- **💡 白話文解說**：每個單字就像是一個車站，只要兩個單字只差一個字母，它們中間就有一條鐵軌。這就是從起點站搭最少幾站的捷運能到終點站的問題！一站一站像水波紋一樣找過去（BFS 最短路徑），如果找到終點就結束。
- **思路**：每個單字是一個節點，差一個字母的兩個單字之間有邊。BFS 找從 beginWord 到 endWord 的最短路徑。
- **複雜度**：O(M²·N) / O(M²·N)，M=單字長度，N=單字數

```python
from collections import deque

def ladderLength(beginWord, endWord, wordList):
    word_set = set(wordList)
    if endWord not in word_set:
        return 0
    queue = deque([(beginWord, 1)])
    visited = {beginWord}
    while queue:
        word, length = queue.popleft()
        for i in range(len(word)):
            for c in 'abcdefghijklmnopqrstuvwxyz':
                new_word = word[:i] + c + word[i+1:]
                if new_word == endWord:
                    return length + 1
                if new_word in word_set and new_word not in visited:
                    visited.add(new_word)
                    queue.append((new_word, length + 1))
    return 0
```

### 787. Cheapest Flights Within K Stops (Med.)

- **套路**：BFS / Bellman-Ford 變形
- **💡 白話文解說**：搭廉價航空轉機。你可以從出發地搭飛機不斷向外找各種轉機法，但只要「轉機次數超過 K 次」就算破壞規則，不能繼續搭。如果到了同一個機場發現前人比較便宜，那就記下新價錢並繼續轉機；如果被當盤子買貴了就不搭了！
- **思路**：用 BFS 搜尋，限制最多 K 步。維護每個節點的最低成本。
- **複雜度**：O(K·E) / O(V)

```python
from collections import defaultdict, deque

def findCheapestPrice(n, flights, src, dst, k):
    graph = defaultdict(list)
    for u, v, w in flights:
        graph[u].append((v, w))
    costs = [float('inf')] * n
    costs[src] = 0
    queue = deque([(src, 0, 0)])  # (node, cost, stops)
    while queue:
        node, cost, stops = queue.popleft()
        if stops > k:
            continue
        for neighbor, price in graph[node]:
            new_cost = cost + price
            if new_cost < costs[neighbor]:
                costs[neighbor] = new_cost
                queue.append((neighbor, new_cost, stops + 1))
    return costs[dst] if costs[dst] != float('inf') else -1
```

### 1197. Minimum Knight Moves (Med.)

- **套路**：BFS 最短路徑
- **思路**：騎士在無限棋盤上的 8 個移動方向，BFS 找到目標格的最短路徑。
- **💡 白話文解說**：想知道兩個字是不是由同樣的字母組成的，最簡單的方法就是「點名」。我們先把第一個字的每個字母出現幾次數清楚，然後看第二個字的字母是不是剛好填滿這張點名表，不多不少剛剛好就是 Anagram！
- **複雜度**：O(|x|·|y|) / O(|x|·|y|)

```python
from collections import deque

def minKnightMoves(x, y):
    x, y = abs(x), abs(y)  # 對稱性
    queue = deque([(0, 0, 0)])
    visited = {(0, 0)}
    moves = [(2,1),(1,2),(-1,2),(-2,1),(2,-1),(1,-2),(-1,-2),(-2,-1)]
    while queue:
        cx, cy, steps = queue.popleft()
        if cx == x and cy == y:
            return steps
        for dx, dy in moves:
            nx, ny = cx+dx, cy+dy
            if (nx, ny) not in visited and nx >= -2 and ny >= -2:
                visited.add((nx, ny))
                queue.append((nx, ny, steps + 1))
```

### 1730. Shortest Path to Get Food (Med.)

- **套路**：多源 BFS
- **思路**：從你的位置 `*` 開始做 BFS，找到第一個食物 `#` 時就是最短路徑。`X` 是障礙不能走，`O` 是空地，`+` 是起點。
- **💡 白話文解說**：你在一個迷宮裡餓壞了，想找最近的食物！這和腐爛橘子的概念一樣，從起點像水波紋般往四面八方擴展，第一次踩到食物的那一步就是最短距離。
- **複雜度**：O(m·n) / O(m·n)

```python
from collections import deque

def getFood(grid):
    m, n = len(grid), len(grid[0])
    for i in range(m):
        for j in range(n):
            if grid[i][j] == '*':
                start = (i, j)
    queue = deque([(start[0], start[1], 0)])
    visited = {start}
    while queue:
        x, y, steps = queue.popleft()
        if grid[x][y] == '#':
            return steps
        for dx, dy in [(1,0),(-1,0),(0,1),(0,-1)]:
            nx, ny = x+dx, y+dy
            if 0 <= nx < m and 0 <= ny < n and (nx, ny) not in visited and grid[nx][ny] != 'X':
                visited.add((nx, ny))
                queue.append((nx, ny, steps+1))
    return -1
```

### 815. Bus Routes (Hard)

- **套路**：BFS（以路線為節點）
- **思路**：不要以站牌為節點，而是以**路線**為節點做 BFS。預先建立「站牌 → 路線清單」的對應表，每次換乘算作 +1 步。
- **💡 白話文解說**：你在搭公車時，只要搭上一條路線，沿線所有站都可以免費抵達。所以我們把「搭上哪條路線」當成一步來算，從起點站出發，看看需要換乘幾次路線才能到達終點站。
- **要點**：BFS 的節點是「路線」而非「站牌」，這樣才能正確計算換乘次數。
- **複雜度**：O(n²) / O(n²)

```python
from collections import defaultdict, deque

def numBusesToDestination(routes, source, target):
    if source == target:
        return 0
    # 建立「站牌 → 路線清單」
    stop_to_routes = defaultdict(set)
    for i, route in enumerate(routes):
        for stop in route:
            stop_to_routes[stop].add(i)

    visited_stops = {source}
    visited_routes = set()
    queue = deque([(source, 0)])  # (站牌, 換乘次數)

    while queue:
        stop, buses = queue.popleft()
        for route_id in stop_to_routes[stop]:
            if route_id in visited_routes:
                continue
            visited_routes.add(route_id)
            for next_stop in routes[route_id]:
                if next_stop == target:
                    return buses + 1
                if next_stop not in visited_stops:
                    visited_stops.add(next_stop)
                    queue.append((next_stop, buses + 1))
    return -1
```

---
