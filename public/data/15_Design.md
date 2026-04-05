# 十五、Design（設計題）

## 題目目錄

- [146. LRU Cache (Med.)](#146-lru-cache-med)
- [208. Implement Trie - Prefix Tree (Med.)](#208-implement-trie---prefix-tree-med)
- [211. Design Add and Search Words (Med.)](#211-design-add-and-search-words-med)
- [212. Word Search II (Hard)](#212-word-search-ii-hard)
- [588. Design In-Memory File System (Hard)](#588-design-in-memory-file-system-hard)

## 通用套路

**組合多種資料結構**：設計題的核心不是某個單一技巧，而是根據操作需求，把查找、刪除、順序維護與層級結構正確拆給不同資料結構負責。

---

### 146. LRU Cache (Med.)

- **Problem (English)**:
	- Design a cache with a fixed `capacity` that supports `get` and `put` in average O(1) time.
	- When the cache is full and a new key is inserted, remove the least recently used item.
	- `get(key)` returns the stored value or `-1` if absent; `put(key, value)` inserts or updates a key.
- **題目（中文）**：
	- 設計一個固定容量為 `capacity` 的快取，並且 `get` 與 `put` 都要在平均 O(1) 時間內完成。
	- 當快取已滿又要插入新鍵時，必須移除最近最少使用的項目。
	- `get(key)` 回傳對應值，若不存在則回傳 `-1`；`put(key, value)` 用來插入或更新資料。

- **Examples**:
- **Constraints**:
  - `1 <= capacity <= 3000`
  - `0 <= key <= 10^4`
  - `0 <= value <= 10^5`
  - At most 2 * 10^5 calls will be made to get and put.

- **套路**：Hash Map + 雙向鏈結串列 / 有序字典
- **思路**：
	- 題目要求 `get` 與 `put` 都是 O(1)，因此需要同時解決「快速找 key」與「快速更新最近使用順序」。
	- Hash Map 負責 O(1) 找到節點；雙向鏈結串列或 `OrderedDict` 負責 O(1) 把節點移到最新位置。
	- 當容量超限時，刪掉最久沒被使用的那個節點，也就是鏈結串列頭部或 `OrderedDict` 最前面元素。
- **TC**：O(1)
	- `get`、`put`、刪除最舊節點與移動節點位置都能在平均常數時間完成。
- **SC**：O(capacity)
	- 最多只會保存 `capacity` 個鍵值對，以及對應的鏈結節點或順序資訊。
- **其他思路**：
	- **手刻雙向鏈結串列 + Hash Map**：最經典、最貼近面試原意。
	- **OrderedDict / LinkedHashMap 類內建結構**：若語言支援，可大幅縮短程式碼。
	- **純陣列 / list**：雖然能做，但每次更新使用順序會退化成 O(n)。
- **解法比較**：
	- **手刻雙向鏈結串列**：優點是最能展示資料結構實力。缺點是實作細節多，容易出 pointer bug。
	- **OrderedDict**：優點是最短、最穩。缺點是較少展示底層能力，部分面試官可能追問如何自己實作。
	- **純 list**：優點是概念簡單。缺點是不能滿足 O(1) 要求。
- **測試重點 (Testing)**：
	- **容量超限淘汰**：插入第 `capacity + 1` 個元素時是否刪掉最久未使用項。
	- **`get` 會更新新舊順序**：查詢過的 key 不應被下一次淘汰。
	- **重複 `put` 同一個 key**：應更新值並刷新最近使用順序，不應重複占位。
	- **查不存在 key**：應回傳 `-1`。
	- **容量為 1**：最容易暴露淘汰邏輯錯誤。

```python
from collections import OrderedDict


class LRUCache:
		def __init__(self, capacity):
				self.capacity = capacity
				self.cache = OrderedDict()

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

### 208. Implement Trie - Prefix Tree (Med.)

- **Problem (English)**:
	- Implement a trie that supports `insert(word)`, `search(word)`, and `startsWith(prefix)`.
	- `search` checks whether a full word exists, while `startsWith` checks whether any inserted word begins with the given prefix.
- **題目（中文）**：
	- 實作一個 Trie（前綴樹），支援 `insert(word)`、`search(word)` 與 `startsWith(prefix)`。
	- `search` 用來確認完整單字是否存在；`startsWith` 則用來判斷是否有任一已插入單字以該前綴開頭。

- **Examples**:
- **Constraints**:
  - `1 <= word.length, prefix.length <= 2000`
  - word and prefix consist only of lowercase English letters.
  - At most 3 * 10^4 calls in total will be made to insert, search, and startsWith.

- **套路**：Trie 前綴樹
- **思路**：
	- 把每個字串拆成字元路徑，沿路建立節點。
	- `insert` 逐字往下建立節點；`search` 必須走完整個字且結尾標記為單字；`startsWith` 只要求前綴路徑存在。
- **TC**：O(m)
	- `m` 是查詢或插入字串長度，每個操作最多只需沿路走一次。
- **SC**：O(total_chars)
	- 所有節點總數與插入的字元總量同階，取決於有多少前綴被共享。
- **其他思路**：
	- **Hash Set 保存所有單字**：`search` 很方便，但 `startsWith` 需要額外枚舉或維護前綴集合。
	- **排序後二分查詢前綴範圍**：適合離線問題，但不適合動態插入。
- **解法比較**：
	- **Trie**：優點是前綴查詢自然且效率穩定。缺點是記憶體開銷通常比 Hash Set 大。
	- **Hash Set + 前綴集合**：優點是實作短。缺點是結構不如 Trie 清楚，且空間可能重複存很多前綴。
- **測試重點 (Testing)**：
	- **插入後搜尋成功**：`insert("apple")` 後 `search("apple")` 應為 `True`。
	- **前綴但非完整單字**：`search("app")` 在未插入 `app` 時應為 `False`。
	- **`startsWith` 成立**：`startsWith("app")` 應為 `True`。
	- **多條共享前綴路徑**：例如 `apple` 與 `apply`。
	- **空字串邊界**：視題目規格確認是否需要支援。

```python
class TrieNode:
		def __init__(self):
				self.children = {}
				self.is_word = False


class Trie:
		def __init__(self):
				self.root = TrieNode()

		def insert(self, word):
				node = self.root
				for char in word:
						node = node.children.setdefault(char, TrieNode())
				node.is_word = True

		def search(self, word):
				node = self.root
				for char in word:
						if char not in node.children:
								return False
						node = node.children[char]
				return node.is_word

		def startsWith(self, prefix):
				node = self.root
				for char in prefix:
						if char not in node.children:
								return False
						node = node.children[char]
				return True
```

### 211. Design Add and Search Words (Med.)

- **Problem (English)**:
	- Design a data structure that supports `addWord(word)` and `search(word)`.
	- In `search`, the pattern may contain `'.'`, which matches any single lowercase letter.
- **題目（中文）**：
	- 設計一個資料結構，支援 `addWord(word)` 與 `search(word)`。
	- `search` 的查詢字串中可以包含 `'.'`，代表任意一個小寫字母。

- **Examples**:
- **Constraints**:
  - `1 <= word.length <= 25`
  - word in addWord consists of lowercase English letters.
  - word in search consist of '.' or lowercase English letters.
  - There will be at most 2 dots in word for search queries.
  - At most 10^4 calls will be made to addWord and search.

- **套路**：Trie + DFS 處理萬用字元
- **思路**：
	- 普通字元時，沿 Trie 的單一路徑往下找即可。
	- 遇到 `.` 時，表示可匹配任意一個字元，因此要對所有 child 分支做 DFS。
	- 只要有任一分支能剛好在字串末尾落到 `is_word = True` 的節點，就代表搜尋成功。
- **TC**：一般情況 O(m)，最壞可到 O(26^d)
	- 沒有萬用字元時和普通 Trie 搜尋一樣是 O(m)；當 `.` 很多時，會擴展多個分支。
- **SC**：O(total_chars)
	- Trie 節點數與所有插入字元總量同階；額外 DFS 遞迴深度最多為字串長度。
- **其他思路**：
	- **Hash Set + 長度分桶**：把相同長度單字分組，遇到 `.` 時暴力比對所有候選單字。
	- **Regex 直接比對**：若語言支援可暫時做，但通常不符合設計題本意。
- **解法比較**：
	- **Trie + DFS**：優點是結構清楚，也能延續 Trie 類設計題套路。缺點是在 `.` 很多時最壞仍會爆分支。
	- **長度分桶暴力比對**：優點是容易想到。缺點是查詢效率較差，單字越多越慢。
- **測試重點 (Testing)**：
	- **精確搜尋**：加入 `bad` 後搜尋 `bad` 應為 `True`。
	- **單一萬用字元**：搜尋 `.ad`。
	- **多個萬用字元**：搜尋 `b..`。
	- **不存在的長度或路徑**：應回傳 `False`。
	- **多個同長度單字共存**：驗證 DFS 分支邏輯。

```python
class TrieNode:
		def __init__(self):
				self.children = {}
				self.is_word = False


class WordDictionary:
		def __init__(self):
				self.root = TrieNode()

		def addWord(self, word):
				node = self.root
				for char in word:
						node = node.children.setdefault(char, TrieNode())
				node.is_word = True

		def search(self, word):
				def dfs(index, node):
						if index == len(word):
								return node.is_word
						char = word[index]
						if char == ".":
								return any(dfs(index + 1, child) for child in node.children.values())
						if char not in node.children:
								return False
						return dfs(index + 1, node.children[char])

				return dfs(0, self.root)
```

### 212. Word Search II (Hard)

- **Problem (English)**:
	- Given an `m x n` board of lowercase letters and a list of words, return all words that can be formed on the board.
	- A word is formed by moving horizontally or vertically to adjacent cells, and the same cell cannot be reused within one word.
- **題目（中文）**：
	- 給定一個 `m x n` 的小寫字母棋盤，以及一組單字列表，請找出所有能在棋盤上拼出的單字。
	- 單字只能由上下左右相鄰的格子組成，且同一格不能在同一個單字中重複使用。

- **Examples**:
  - Example 1: `board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath","pea","eat","rain"]`
    - Output: `["eat","oath"]`
  - Example 2: `board = [["a","b"],["c","d"]], words = ["abcb"]`
    - Output: `[]`
- **Constraints**:
  - `m == board.length`
  - `n == board[i].length`
  - `1 <= m, n <= 12`
  - board[i][j] is a lowercase English letter.
  - `1 <= words.length <= 3 * 10^4`
  - `1 <= words[i].length <= 10`
  - words[i] consists of lowercase English letters.
  - All the strings of words are unique.

- **套路**：Trie + Backtracking
- **思路**：
	- 若對每個單字各自跑 Word Search，會重複搜尋很多相同前綴，因此先把 `words` 建成 Trie。
	- 棋盤 DFS 時，只要目前字元不在 Trie 的子節點中，就能立刻剪枝。
	- 每找到一個單字就加入答案，並把對應 `word` 清空，避免同一單字被重複加入。
- **TC**：O(m * n * 4^L)
	- `m * n` 是起點數量，DFS 最壞分支是 4，深度為最長單字長度 `L`；實際上 Trie 剪枝會大幅減少分支。
- **SC**：O(total_chars + L)
	- Trie 佔 `total_chars`，遞迴路徑深度最壞為 `L`。
- **其他思路**：
	- **逐單字暴力搜索**：對每個字各自做一次 Word Search。思路直接，但在字典大時幾乎一定 TLE。
	- **Trie + 原地刪枝優化**：找到單字後，若該分支已無後續需求，可把空節點往上刪，進一步降低搜尋成本。
- **解法比較**：
	- **Trie + Backtracking**：優點是標準解，利用共享前綴與剪枝。缺點是實作細節較多。
	- **逐單字搜索**：優點是容易從 Word Search 延伸。缺點是重複工作極多，效率差。
- **測試重點 (Testing)**：
	- **多單字共享前綴**：如 `oath`、`oak`，驗證 Trie 共享效果。
	- **同一單字可由多路徑找到**：結果中仍只能出現一次。
	- **完全找不到任何單字**：應回傳空陣列。
	- **棋盤小但字典大**：驗證剪枝是否有效。
	- **單字彼此互為前綴**：如 `a`、`ab`，確保都能正確判定。

```python
class TrieNode:
		def __init__(self):
				self.children = {}
				self.word = None


def findWords(board, words):
		root = TrieNode()
		for word in words:
				node = root
				for char in word:
						node = node.children.setdefault(char, TrieNode())
				node.word = word

		rows, cols = len(board), len(board[0])
		result = []

		def dfs(r, c, node):
				char = board[r][c]
				if char not in node.children:
						return

				next_node = node.children[char]
				if next_node.word:
						result.append(next_node.word)
						next_node.word = None

				board[r][c] = "#"
				for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
						nr, nc = r + dr, c + dc
						if 0 <= nr < rows and 0 <= nc < cols and board[nr][nc] != "#":
								dfs(nr, nc, next_node)
				board[r][c] = char

		for r in range(rows):
				for c in range(cols):
						dfs(r, c, root)

		return result
```

### 588. Design In-Memory File System (Hard)

- **Problem (English)**:
	- Design a data structure that simulates an in-memory file system.
	- Support `ls(path)`, `mkdir(path)`, `addContentToFile(filePath, content)`, and `readContentFromFile(filePath)`.
	- If `path` is a file path, `ls` returns only that filename; if `path` is a directory, `ls` returns the names in that directory in lexicographic order.
	- `mkdir` creates missing intermediate directories, and `addContentToFile` creates the file if it does not already exist or appends content if it does.
- **題目（中文）**：
	- 設計一個模擬記憶體中檔案系統的資料結構。
	- 它需要支援 `ls(path)`、`mkdir(path)`、`addContentToFile(filePath, content)` 與 `readContentFromFile(filePath)`。
	- 若 `path` 指向檔案，`ls` 只回傳該檔名；若指向資料夾，`ls` 需以字典序回傳該目錄中的名稱。
	- `mkdir` 需要沿路建立缺少的中間資料夾；`addContentToFile` 若檔案不存在則建立，若已存在則把內容追加在原內容後。
- **Examples**:
	- Example 1: `FileSystem()`, `ls("/")`, `mkdir("/a/b/c")`, `addContentToFile("/a/b/c/d","hello")`, `ls("/")`, `readContentFromFile("/a/b/c/d")`
		- Output: `[null,[],null,null,["a"],"hello"]`
- **Constraints**:
	- `1 <= path.length, filePath.length <= 100`
	- `path` and `filePath` are absolute paths that begin with `'/'` and do not end with `'/'`, except for the root path `'/'`.
	- File and directory names consist only of lowercase English letters, and names do not repeat within the same directory.
	- All operations are valid; the user will not query a path that does not exist.
	- The parent directory of `filePath` in `addContentToFile` is guaranteed to exist.
	- `1 <= content.length <= 50`
	- At most `300` calls will be made to `ls`, `mkdir`, `addContentToFile`, and `readContentFromFile`.

- **套路**：Trie 目錄樹 + 節點保存檔案內容
- **思路**：
	- 將每個路徑切成多段名稱，沿著 Trie 逐層建立資料夾節點。
	- 每個節點保存 `children`、`is_file` 與 `content`，這樣同一結構可同時表示資料夾與檔案。
	- `ls` 要區分路徑指向檔案或目錄：若是檔案就只回傳檔名，若是目錄則列出所有子項目並排序。
- **TC**：`mkdir` / `addContentToFile` / `readContentFromFile` 為 O(k)，`ls` 為 O(k + s log s)
	- `k` 是路徑深度；`ls` 另外要對目錄中的 `s` 個子項目排序。
- **SC**：O(total_paths + total_content)
	- 需要保存整棵目錄樹結構與所有檔案內容字串。
- **其他思路**：
	- **巢狀字典**：可用多層 dict 表示目錄，概念簡單，但檔案與資料夾屬性容易混在一起。
	- **物件導向節點模型**：和 Trie 類似，但可額外拆出 `DirectoryNode` / `FileNode` 類別，語意更清楚。
- **解法比較**：
	- **Trie 目錄樹**：優點是最貼近真實檔案系統，也方便擴充。缺點是需要自己處理節點類型判斷。
	- **巢狀字典**：優點是程式短。缺點是結構語意不夠乾淨，操作愈多愈容易混亂。
- **測試重點 (Testing)**：
	- **多層 mkdir**：如 `/a/b/c`，驗證中間路徑會自動建立。
	- **ls 目錄**：應回傳排序後的子項目。
	- **ls 檔案**：應只回傳該檔名本身。
	- **同一檔案多次 append**：內容應累加而不是覆蓋。
	- **根目錄 `/`**：要能正確列出最上層項目。

```python
class Node:
		def __init__(self):
				self.children = {}
				self.content = ""
				self.is_file = False


class FileSystem:
		def __init__(self):
				self.root = Node()

		def _walk(self, path, create=False):
				node = self.root
				if path == "/":
						return node
				for name in path.split("/"):
						if not name:
								continue
						if create:
								node = node.children.setdefault(name, Node())
						else:
								node = node.children[name]
				return node

		def ls(self, path):
				if path == "/":
						return sorted(self.root.children)
				names = [name for name in path.split("/") if name]
				node = self._walk(path)
				if node.is_file:
						return [names[-1]]
				return sorted(node.children)

		def mkdir(self, path):
				self._walk(path, create=True)

		def addContentToFile(self, filePath, content):
				node = self._walk(filePath, create=True)
				node.is_file = True
				node.content += content

		def readContentFromFile(self, filePath):
				return self._walk(filePath).content
```
