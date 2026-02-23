# 十五、Design（設計題）

## 通用套路

**組合多種資料結構**：設計題的核心是根據操作的時間複雜度需求，選擇並組合正確的資料結構。

---

### 14. LRU Cache (Med.)

- **套路**：Hash Map + 雙向鏈結串列
- **💡 白話文解說**：這就像是你逛蝦皮的「最近瀏覽商品」！為了找的時候最快（Hash Map），也為了把「很久沒看的東西自動擠掉踢出清單」（雙向鏈結），我們把它串聯。看過的就拉到最上面（最前端），超過 5 個東西在購物車的話，最後一名就會被自動拋棄。
- **思路**：Hash Map 提供 O(1) 查找，雙向鏈結串列維護使用順序。存取時移到頭部，滿了就刪尾部。
- **複雜度**：get/put 都是 O(1)

```python
from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity):
        self.cache = OrderedDict()
        self.capacity = capacity

    def get(self, key):
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key, value):
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)
```

### 53. Implement Trie - Prefix Tree (Med.)

- **套路**：節點樹結構
- **💡 白話文解說**：你想把整本英文字典建起來？那就每一個字母挖一個洞當作指標陣列往下走。有這條路就一直走，沒有這條路就自己擴建一個洞。在走完最後一個字母時，別忘了這格蓋個章宣告「對！在這裡停下就是一個完整單字」。
- **思路**：每個節點有 26 個子節點（或用 dict），加一個 is_end 標記。
- **複雜度**：insert/search/startsWith 都是 O(m)，m=單字長度

```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
        node.is_end = True

    def search(self, word):
        node = self._find(word)
        return node is not None and node.is_end

    def startsWith(self, prefix):
        return self._find(prefix) is not None

    def _find(self, word):
        node = self.root
        for ch in word:
            if ch not in node.children:
                return None
            node = node.children[ch]
        return node
```

### 106. Design Add and Search Words (Med.)

- **套路**：Trie + DFS（處理萬用字元 '.'）
- **💡 白話文解說**：這跟字典樹幾乎一模一樣，唯一不同的當你拿著「. （萬用字元）」走來的時候，你不能只走其中一條特定的路。你要化身鳴人分身大法，把底下所有可能的字母路線全探索一遍！
- **思路**：同 Trie，但 search 遇到 '.' 時要嘗試所有子節點。
- **複雜度**：addWord O(m) / search O(26^m) 最壞

```python
class WordDictionary:
    def __init__(self):
        self.root = TrieNode()

    def addWord(self, word):
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
        node.is_end = True

    def search(self, word):
        def dfs(node, i):
            if i == len(word):
                return node.is_end
            if word[i] == '.':
                return any(dfs(child, i+1) for child in node.children.values())
            if word[i] not in node.children:
                return False
            return dfs(node.children[word[i]], i+1)
        return dfs(self.root, 0)
```

### 107. Word Search II (Hard)

- **套路**：Trie + DFS 回溯
- **💡 白話文解說**：這是在大大的格子上找單字。如果每次都在上面到處瞎走肯定時間來不及？這題超狂之處在於我們直接「帶著字典走」！只要我跨這一步發覺我的字典裡「根本沒有這種爛字首拼法」，我馬上轉頭死心，超強剪枝神技。
- **思路**：先把所有目標單字建成 Trie，然後在棋盤上做 DFS。每走一步沿著 Trie 往下走，如果 Trie 中沒有對應分支就剪枝。
- **複雜度**：O(m·n·3^L) / O(W·L)

```python
def findWords(board, words):
    root = {}
    for word in words:
        node = root
        for ch in word:
            node = node.setdefault(ch, {})
        node['#'] = word  # 標記完整單字

    m, n = len(board), len(board[0])
    result = []
    def dfs(i, j, node):
        ch = board[i][j]
        if ch not in node:
            return
        next_node = node[ch]
        if '#' in next_node:
            result.append(next_node.pop('#'))  # 找到，移除避免重複
        board[i][j] = '.'
        for di, dj in [(1,0),(-1,0),(0,1),(0,-1)]:
            ni, nj = i+di, j+dj
            if 0 <= ni < m and 0 <= nj < n and board[ni][nj] in next_node:
                dfs(ni, nj, next_node)
        board[i][j] = ch
        if not next_node:  # 剪枝：空節點清理
            del node[ch]

    for i in range(m):
        for j in range(n):
            dfs(i, j, root)
    return result
```

### 55. Design In-Memory File System (Hard)

- **套路**：Trie 變形（目錄結構）
- **💡 白話文解說**：寫一整個雲端文件總管理系統！檔案跟資料夾的唯一區別，只是它肚子裡有沒有裝資料而已。「看檔案」就是一直遞迴鑽進目錄，找到字典最下方的紙條；「創目錄」就是在 HashMap 裡多蓋幾本子圖層。
- **思路**：每個節點代表一個目錄或檔案。用 dict 存子目錄/檔案，另外存檔案內容。
- **複雜度**：各操作 O(path 長度)

```python
class FileSystem:
    def __init__(self):
        self.root = {'dirs': {}, 'files': {}}

    def ls(self, path):
        node = self._navigate(path)
        if isinstance(node, str):  # 是檔案
            return [path.split('/')[-1]]
        return sorted(list(node['dirs'].keys()) + list(node['files'].keys()))

    def mkdir(self, path):
        node = self.root
        for part in path.strip('/').split('/'):
            if part:
                if part not in node['dirs']:
                    node['dirs'][part] = {'dirs': {}, 'files': {}}
                node = node['dirs'][part]

    def addContentToFile(self, filePath, content):
        parts = filePath.strip('/').split('/')
        node = self.root
        for part in parts[:-1]:
            if part:
                node = node['dirs'][part]
        filename = parts[-1]
        node['files'][filename] = node['files'].get(filename, '') + content

    def readContentFromFile(self, filePath):
        parts = filePath.strip('/').split('/')
        node = self.root
        for part in parts[:-1]:
            if part:
                node = node['dirs'][part]
        return node['files'][parts[-1]]

    def _navigate(self, path):
        parts = path.strip('/').split('/')
        node = self.root
        for part in parts:
            if not part:
                continue
            if part in node['files']:
                return node['files'][part]
            node = node['dirs'][part]
        return node
```

---
