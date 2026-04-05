# 九、Backtracking（回溯法）

## 題目目錄

- [78. Subsets (Med.)](#78-subsets-med)
- [39. Combination Sum (Med.)](#39-combination-sum-med)
- [46. Permutations (Med.)](#46-permutations-med)
- [17. Letter Combinations of a Phone Number (Med.)](#17-letter-combinations-of-a-phone-number-med)
- [79. Word Search (Med.)](#79-word-search-med)
- [36. Valid Sudoku (Med.)](#36-valid-sudoku-med)
- [37. Sudoku Solver (Hard)](#37-sudoku-solver-hard)
- [51. N-Queens (Hard)](#51-n-queens-hard)

## 通用套路

**核心框架**：做選擇 -> 遞迴 -> 撤銷選擇。

**何時用回溯**：求「所有組合/排列/子集」或「是否存在一條路徑」。

**剪枝**：提前判斷當前分支不可能成功，跳過不必要的搜尋。

```python
# 套路模板：回溯框架
def backtrack(candidates, path, result, start):
        if 滿足結束條件:
                result.append(path[:])  # 記錄結果（要複製！）
                return
        for i in range(start, len(candidates)):
                # 剪枝條件
                path.append(candidates[i])
                backtrack(candidates, path, result, i + 1)
                path.pop()
```

---

### 78. Subsets (Med.)

- **Problem (English)**:
    - Given an integer array `nums` whose elements are unique, return all possible subsets.
    - The solution set must not contain duplicate subsets, and the subsets may be returned in any order.
- **題目（中文）**：
    - 給定一個元素互不相同的整數陣列 `nums`，請回傳所有可能的子集合。
    - 答案中不能有重複子集合，回傳順序不限。

- **Examples**:
  - Example 1: `nums = [1,2,3]`
    - Output: `[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]`
  - Example 2: `nums = [0]`
    - Output: `[[],[0]]`
- **Constraints**:
  - `1 <= nums.length <= 10`
  - `-10 <= nums[i] <= 10`
  - All the numbers of nums are unique.

- **套路**：回溯從 `start` 往後展開
- **思路**：
    - 當前 `path` 本身就是一個合法子集，所以每次進入遞迴時先把它收進答案。
    - 接著從 `start` 之後挑下一個元素加入，避免回頭重複選同一位置。
    - 這等價於每個元素都有「選 / 不選」兩種決策，最後會列舉出所有 $2^n$ 個子集。
- **TC**：O(n * 2^n)
    - 一共有 $2^n$ 個子集，而且把 `path` 複製進答案時最壞要花 O(n)。
- **SC**：O(n)
    - 遞迴深度與當前路徑長度最多都是 `n`，這裡不計輸出答案本身。
- **其他思路**：
    - **迭代擴張**：從 `[[]]` 開始，讀到新數字時，把它附加到目前所有子集後面，形成新一批子集。
- **解法比較**：
    - **回溯**：優點是模板通用，之後延伸到 `Subsets II`、`Combination Sum` 很自然。缺點是要先習慣 `start` 與回溯的寫法。
    - **迭代擴張**：優點是直觀。缺點是遇到剪枝或額外限制時，彈性不如回溯。
- **測試重點 (Testing)**：
    - **空陣列**：`nums = []`，預期 `[[]]`。
    - **單一元素**：`nums = [1]`，預期 `[[], [1]]`。
    - **一般案例**：`nums = [1, 2, 3]`，應有 `8` 個子集。
    - **負數與 0**：例如 `nums = [-1, 0, 1]`，確認演算法不依賴正整數假設。

```python
def subsets(nums):
        result = []

        def backtrack(start, path):
                result.append(path[:])

                for i in range(start, len(nums)):
                        path.append(nums[i])
                        backtrack(i + 1, path)
                        path.pop()

        backtrack(0, [])
        return result
```

### 39. Combination Sum (Med.)

- **Problem (English)**:
        - Given an array of distinct integers `candidates` and an integer `target`, return all unique combinations of `candidates` where the chosen numbers sum to `target`.
        - You may use the same number in `candidates` any number of times.
        - Two combinations are different if at least one chosen number appears a different number of times.
    - You may return the combinations in any order.
- **題目（中文）**：
        - 給定一個由互不相同整數組成的陣列 `candidates` 與整數 `target`，請回傳所有總和等於 `target` 的不同組合。
        - `candidates` 中的每個數字都可以被重複使用任意次。
        - 若某個數字在兩組答案中的使用次數不同，則視為不同組合。
    - 答案順序不限。

- **Examples**:
  - Example 1: `candidates = [2,3,6,7], target = 7`
    - Output: `[[2,2,3],[7]]`
    - Explanation: 2 and 3 are candidates, and 2 + 2 + 3 = 7. Note that 2 can be used multiple times.
7 is a candidate, and 7 = 7.
These are the only two combinations.
  - Example 2: `candidates = [2,3,5], target = 8`
    - Output: `[[2,2,2,2],[2,3,3],[3,5]]`
  - Example 3: `candidates = [2], target = 1`
    - Output: `[]`
- **Constraints**:
  - `1 <= candidates.length <= 30`
  - `2 <= candidates[i] <= 40`
  - All elements of candidates are distinct.
  - `1 <= target <= 40`

- **套路**：回溯 + 同一元素可重複使用
- **思路**：
    - 先排序 `candidates`，這樣一旦某個數字已經大於剩餘目標，就可以直接停止當前迴圈。
    - 當選了 `candidates[i]` 之後，下一層仍從 `i` 開始遞迴，表示同一個數字可以重複選。
    - `remain == 0` 代表找到一組合法組合；之後就回傳。若後續值過大，直接剪枝。
- **TC**：O(n^(target / min(candidates)))
    - 最壞情況下深度大約是 `target / min(candidates)`，每層都可能嘗試多個候選數，因此整體是指數級。
- **SC**：O(target / min(candidates))
    - 遞迴深度最多等於組合中可放入多少個最小數字，不計輸出答案本身。
- **其他思路**：
    - **DP 列舉所有和**：令 `dp[s]` 保存湊出總和 `s` 的所有組合，逐步往上推到 `target`。可做，但組合複製與去重處理較麻煩。
- **解法比較**：
    - **回溯**：優點是最容易加剪枝，也最符合面試對這題的期待。缺點是最壞情況仍是指數級。
    - **DP**：優點是狀態清楚。缺點是要保存大量中間組合，空間與實作負擔都較大。
- **測試重點 (Testing)**：
    - **標準案例**：`candidates = [2, 3, 6, 7], target = 7`，預期 `[[2,2,3], [7]]`。
    - **可重複使用同一數字**：`candidates = [2, 3, 5], target = 8`，應包含 `[3,5]` 與 `[2,3,3]`。
    - **完全無解**：`candidates = [5, 10], target = 3`，預期 `[]`。
    - **輸入未排序**：例如 `candidates = [7, 3, 2]`，確認排序與剪枝後仍正確。

```python
def combinationSum(candidates, target):
        candidates.sort()
        result = []

        def backtrack(start, remain, path):
                if remain == 0:
                        result.append(path[:])
                        return

                for i in range(start, len(candidates)):
                        value = candidates[i]
                        if value > remain:
                                break
                        path.append(value)
                        backtrack(i, remain - value, path)
                        path.pop()

        backtrack(0, target, [])
        return result
```

### 46. Permutations (Med.)

- **Problem (English)**:
        - Given an array `nums` of distinct integers, return all possible permutations.
        - You may return the answer in any order.
- **題目（中文）**：
        - 給定一個由互不相同整數組成的陣列 `nums`，請回傳所有可能的排列。
        - 回傳順序不限。

- **Examples**:
  - Example 1: `nums = [1,2,3]`
    - Output: `[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]`
  - Example 2: `nums = [0,1]`
    - Output: `[[0,1],[1,0]]`
  - Example 3: `nums = [1]`
    - Output: `[[1]]`
- **Constraints**:
  - `1 <= nums.length <= 6`
  - `-10 <= nums[i] <= 10`
  - All the integers of nums are unique.

- **套路**：回溯 + `used` 陣列
- **思路**：
    - 排列的本質是每一層都要決定「下一個位置放哪個還沒用過的數字」。
    - 用 `used[i]` 記錄 `nums[i]` 是否已經放進目前排列，避免同一元素重複出現。
    - 當 `path` 長度等於 `len(nums)` 時，就得到一個完整排列。
- **TC**：O(n * n!)
    - 總共有 `n!` 個排列，而每次收答案時最多要複製 `n` 個元素。
- **SC**：O(n)
    - `used` 陣列、遞迴深度與 `path` 長度都最多為 `n`，不計輸出答案本身。
- **其他思路**：
    - **原地交換 (Swap Backtracking)**：固定位置 `index`，把它和後面的元素輪流交換，再遞迴處理下一格。
- **解法比較**：
    - **`used` 陣列**：優點是邏輯最直觀，也容易改成處理重複元素的版本。缺點是需要額外布林陣列。
    - **原地交換**：優點是省去 `used` 陣列。缺點是交換與還原步驟較容易寫錯。
- **測試重點 (Testing)**：
    - **一般案例**：`nums = [1, 2, 3]`，應有 `6` 種排列。
    - **單一元素**：`nums = [1]`，預期 `[[1]]`。
    - **含負數**：例如 `nums = [-1, 0, 1]`，確認不依賴值域。
    - **重複元素提醒**：若輸入像 `[1,1,2]`，這版會產生重複答案，需要改用 `Permutations II` 的去重做法。

```python
def permute(nums):
        result = []
        used = [False] * len(nums)

        def backtrack(path):
                if len(path) == len(nums):
                        result.append(path[:])
                        return

                for i, num in enumerate(nums):
                        if used[i]:
                                continue
                        used[i] = True
                        path.append(num)
                        backtrack(path)
                        path.pop()
                        used[i] = False

        backtrack([])
        return result
```

### 17. Letter Combinations of a Phone Number (Med.)

- **Problem (English)**:
        - Given a string `digits` containing digits from `2` to `9`, return all letter combinations the number could represent.
        - Return the answer in any order.
        - The digit-to-letter mapping follows the standard telephone keypad.
- **題目（中文）**：
        - 給定一個只包含 `2` 到 `9` 的字串 `digits`，請回傳它在電話按鍵對應下可能表示的所有字母組合。
        - 回傳順序不限。
        - 數字與字母的對應關係採用一般電話鍵盤規則。

- **Examples**:
  - Example 1: `digits = "23"`
    - Output: `["ad","ae","af","bd","be","bf","cd","ce","cf"]`
  - Example 2: `digits = "2"`
    - Output: `["a","b","c"]`
- **Constraints**:
  - `1 <= digits.length <= 4`
  - digits[i] is a digit in the range ['2', '9'].

- **套路**：回溯枚舉每一位數可對應的字母
- **思路**：
    - 每個數字都對應一組固定字母，因此可以把題目視為多層選擇樹。
    - 遞迴到第 `index` 層時，嘗試把 `digits[index]` 對應的每個字母加入 `path`。
    - 當 `path` 長度等於 `digits` 長度時，就形成一個完整字串。
- **TC**：O(n * 4^n)
    - 最壞情況每位都是 `7` 或 `9`，每層有 4 個分支，而收答案時還要把長度 `n` 的路徑組成字串。
- **SC**：O(n)
    - 遞迴深度與 `path` 長度都最多為 `n`，不計輸出答案本身。
- **其他思路**：
    - **BFS / 逐層組字串**：從空字串開始，讀到一個新數字時，把目前所有部分答案和它對應的字母做笛卡兒積展開。
- **解法比較**：
    - **回溯**：優點是和其他搜尋題模板一致，容易講清楚。缺點是對這題來說比迭代法稍微抽象。
    - **BFS**：優點是很像逐層拼字串，概念直接。缺點是若再加其他限制，通常不如回溯好擴充。
- **測試重點 (Testing)**：
    - **空字串**：`digits = ""`，預期 `[]`。
    - **單一數字**：`digits = "2"`，預期 `['a', 'b', 'c']`。
    - **含 `7` / `9`**：`digits = "79"`，確認四字母分支都被處理。
    - **一般案例**：`digits = "23"`，預期共 `9` 組答案。

```python
def letterCombinations(digits):
        if not digits:
                return []

        mapping = {
                "2": "abc",
                "3": "def",
                "4": "ghi",
                "5": "jkl",
                "6": "mno",
                "7": "pqrs",
                "8": "tuv",
                "9": "wxyz",
        }
        result = []

        def backtrack(index, path):
                if index == len(digits):
                        result.append("".join(path))
                        return

                for char in mapping[digits[index]]:
                        path.append(char)
                        backtrack(index + 1, path)
                        path.pop()

        backtrack(0, [])
        return result
```

### 79. Word Search (Med.)

- **Problem (English)**:
        - Given an `m x n` grid of characters `board` and a string `word`, return `true` if `word` exists in the grid.
        - The word must be built from sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring.
        - A cell may not be used more than once in the same path.
- **題目（中文）**：
        - 給定一個 `m x n` 的字元矩陣 `board` 與字串 `word`，請判斷 `word` 是否存在於棋盤中。
        - 單字必須由相鄰格子依序組成，相鄰只包含上下左右四個方向。
        - 同一個格子在同一條搜尋路徑中不能重複使用。

- **Examples**:
  - Example 1: `board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"`
    - Output: `true`
  - Example 2: `board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"`
    - Output: `true`
  - Example 3: `board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCB"`
    - Output: `false`
- **Constraints**:
  - `m == board.length`
  - `n = board[i].length`
  - `1 <= m, n <= 6`
  - `1 <= word.length <= 15`
  - board and word consists of only lowercase and uppercase English letters.

- **套路**：DFS + 回溯走格子
- **思路**：
    - 以每個格子作為起點，嘗試匹配 `word[0]`，成功後再往上下左右搜尋下一個字元。
    - 走過的格子在當前路徑中不能重複使用，因此進遞迴前先暫時標記，返回時再還原。
    - 只要任一條路徑能走完整個單字，就可以直接回傳 `True`。
- **TC**：O(m * n * 3^(L - 1))
    - 有 `m * n` 個起點，第一步之後每層最多只剩 3 個可走方向，深度為單字長度 `L`。
- **SC**：O(L)
    - 遞迴深度最多為單字長度 `L`；此寫法用原地標記，不需要額外 `visited` 集合。
- **其他思路**：
    - **`visited` 集合版 DFS**：不改原棋盤，而是用集合記錄目前路徑走過的座標，程式語意較直接，但額外空間較多。
- **解法比較**：
    - **原地標記**：優點是省空間，也很常見。缺點是要小心回溯時一定要把字元還原。
    - **`visited` 集合**：優點是比較安全，不會動到原資料。缺點是每一步都多了集合操作。
- **測試重點 (Testing)**：
    - **存在路徑**：題目標準案例應回傳 `True`。
    - **不存在路徑**：確認 DFS 能完整搜尋後回傳 `False`。
    - **不可重用同一格**：像 `word = "ABCB"` 應判定失敗。
    - **單格棋盤**：`board = [["A"]], word = "A"` 應回傳 `True`。

```python
def exist(board, word):
        if not board or not board[0]:
                return False

        rows, cols = len(board), len(board[0])

        def dfs(r, c, index):
                if index == len(word):
                        return True
                if r < 0 or c < 0 or r >= rows or c >= cols:
                        return False
                if board[r][c] != word[index]:
                        return False

                temp = board[r][c]
                board[r][c] = "#"

                found = (
                        dfs(r + 1, c, index + 1)
                        or dfs(r - 1, c, index + 1)
                        or dfs(r, c + 1, index + 1)
                        or dfs(r, c - 1, index + 1)
                )

                board[r][c] = temp
                return found

        for r in range(rows):
                for c in range(cols):
                        if dfs(r, c, 0):
                                return True

        return False
```

### 36. Valid Sudoku (Med.)

- **Problem (English)**:
    - Determine whether a `9 x 9` Sudoku board is valid.
    - Only the filled cells need to be validated according to Sudoku rules.
    - Each row, each column, and each `3 x 3` sub-box must not contain repeated digits from `1` to `9`.
- **題目（中文）**：
    - 判斷一個 `9 x 9` 的數獨盤面是否有效。
    - 只需要檢查目前已填入的格子是否符合數獨規則。
    - 每一列、每一欄，以及每個 `3 x 3` 宮格中，數字 `1` 到 `9` 都不能重複。

- **Examples**:
  - Example 1: `board =
[["5","3",".",".","7",".",".",".","."]
,["6",".",".","1","9","5",".",".","."]
,[".","9","8",".",".",".",".","6","."]
,["8",".",".",".","6",".",".",".","3"]
,["4",".",".","8",".","3",".",".","1"]
,["7",".",".",".","2",".",".",".","6"]
,[".","6",".",".",".",".","2","8","."]
,[".",".",".","4","1","9",".",".","5"]
,[".",".",".",".","8",".",".","7","9"]]`
    - Output: `true`
  - Example 2: `board =
[["8","3",".",".","7",".",".",".","."]
,["6",".",".","1","9","5",".",".","."]
,[".","9","8",".",".",".",".","6","."]
,["8",".",".",".","6",".",".",".","3"]
,["4",".",".","8",".","3",".",".","1"]
,["7",".",".",".","2",".",".",".","6"]
,[".","6",".",".",".",".","2","8","."]
,[".",".",".","4","1","9",".",".","5"]
,[".",".",".",".","8",".",".","7","9"]]`
    - Output: `false`
    - Explanation: Same as Example 1, except with the 5 in the top left corner being modified to 8. Since there are two 8's in the top left 3x3 sub-box, it is invalid.
- **Constraints**:
  - `board.length == 9`
  - `board[i].length == 9`
  - board[i][j] is a digit 1-9 or '.'.

- **套路**：集合檢查 row / col / box 是否重複
- **思路**：
    - 題目不是要你解 Sudoku，只要檢查目前盤面是否合法。
    - 掃描每個非 `.` 的格子時，同步檢查它所在的 row、col、box 是否已經出現過相同數字。
    - 九宮格索引可用 `(r // 3) * 3 + c // 3` 表示，這樣能平坦化成 0 到 8。
- **TC**：O(1)
    - 棋盤固定是 `9 x 9`，最多只掃描 81 個格子，因此可以視為常數時間。
- **SC**：O(1)
    - `rows`、`cols`、`boxes` 的大小也都被固定在 9 組，額外空間是常數級。
- **其他思路**：
    - **Bitmask**：用位元遮罩代替集合記錄數字是否出現過，效能更緊湊，但可讀性較差。
- **解法比較**：
    - **集合**：優點是最好讀、最好寫。缺點是常數因子略高。
    - **Bitmask**：優點是更省空間、操作快。缺點是位元細節若沒講清楚，反而容易失分。
- **測試重點 (Testing)**：
    - **row 衝突**：同一列出現重複數字，應回傳 `False`。
    - **col 衝突**：同一欄出現重複數字，應回傳 `False`。
    - **box 衝突**：同一個 `3 x 3` 九宮格出現重複數字，應回傳 `False`。
    - **合法未填滿盤面**：有很多 `.` 但目前仍合法，應回傳 `True`。

```python
def isValidSudoku(board):
        rows = [set() for _ in range(9)]
        cols = [set() for _ in range(9)]
        boxes = [set() for _ in range(9)]

        for r in range(9):
                for c in range(9):
                        value = board[r][c]
                        if value == ".":
                                continue

                        box = (r // 3) * 3 + c // 3
                        if value in rows[r] or value in cols[c] or value in boxes[box]:
                                return False

                        rows[r].add(value)
                        cols[c].add(value)
                        boxes[box].add(value)

        return True
```

### 37. Sudoku Solver (Hard)

- **Problem (English)**:
    - Write a program to solve a Sudoku puzzle by filling the empty cells.
    - A valid Sudoku solution must satisfy the standard rules for rows, columns, and `3 x 3` sub-boxes.
    - Empty cells are represented by `'.'`, and the input puzzle is guaranteed to have exactly one solution.
- **題目（中文）**：
    - 請撰寫程式填滿數獨盤面中的空格，解出完整的數獨。
    - 合法解必須符合標準數獨規則，也就是每列、每欄與每個 `3 x 3` 宮格都要包含 `1` 到 `9` 且不重複。
    - 空格以 `'.'` 表示，題目保證輸入盤面恰好只有一個解。

- **Examples**:
  - Example 1: `board = [["5","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]`
    - Output: `[["5","3","4","6","7","8","9","1","2"],["6","7","2","1","9","5","3","4","8"],["1","9","8","3","4","2","5","6","7"],["8","5","9","7","6","1","4","2","3"],["4","2","6","8","5","3","7","9","1"],["7","1","3","9","2","4","8","5","6"],["9","6","1","5","3","7","2","8","4"],["2","8","7","4","1","9","6","3","5"],["3","4","5","2","8","6","1","7","9"]]`
    - Explanation: The input board is shown above and the only valid solution is shown below:
- **Constraints**:
  - `board.length == 9`
  - `board[i].length == 9`
  - board[i][j] is a digit or '.'.
  - It is guaranteed that the input board has only one solution.

- **套路**：回溯填空格 + row / col / box 剪枝
- **思路**：
    - 先把目前盤面已有的數字分別記到 `rows`、`cols`、`boxes`，後面判斷合法性就不用每次重掃整列整欄。
    - 再把所有空格收集起來，逐格嘗試放入 `1` 到 `9`。
    - 某個值合法就先放下去遞迴；若後面卡住，撤銷這次填法並嘗試下一個數字。
- **TC**：O(9^E)
    - `E` 是空格數量，每個空格最壞可嘗試 9 個數字，因此上界是指數級。
- **SC**：O(E)
    - 主要來自遞迴深度；`rows`、`cols`、`boxes` 在固定 `9 x 9` 盤面下可視為常數空間。
- **其他思路**：
    - **MRV / 最少候選數優先**：每次先挑候選數最少的空格來填，可以大幅減少搜尋樹。
    - **Dancing Links**：把題目轉成 Exact Cover，效率非常強，但已超出一般面試手寫範圍。
- **解法比較**：
    - **標準回溯**：優點是最好解釋，也最容易手寫。缺點是對極難盤面可能慢。
    - **MRV / DLX**：優點是速度更好。缺點是實作成本高，面試中通常不是首選。
- **測試重點 (Testing)**：
    - **題目標準案例**：確認能填出唯一合法解。
    - **接近完成的盤面**：只剩少數空格，應很快找到答案。
    - **某格只有唯一候選數**：檢查剪枝與狀態維護是否正確。
    - **高難度盤面**：確認回溯撤銷時不會污染其他 row / col / box 狀態。

```python
def solveSudoku(board):
        rows = [set() for _ in range(9)]
        cols = [set() for _ in range(9)]
        boxes = [set() for _ in range(9)]
        empties = []

        for r in range(9):
                for c in range(9):
                        value = board[r][c]
                        if value == ".":
                                empties.append((r, c))
                                continue

                        box = (r // 3) * 3 + c // 3
                        rows[r].add(value)
                        cols[c].add(value)
                        boxes[box].add(value)

        def backtrack(index):
                if index == len(empties):
                        return True

                r, c = empties[index]
                box = (r // 3) * 3 + c // 3

                for value in "123456789":
                        if value in rows[r] or value in cols[c] or value in boxes[box]:
                                continue

                        board[r][c] = value
                        rows[r].add(value)
                        cols[c].add(value)
                        boxes[box].add(value)

                        if backtrack(index + 1):
                                return True

                        board[r][c] = "."
                        rows[r].remove(value)
                        cols[c].remove(value)
                        boxes[box].remove(value)

                return False

        backtrack(0)
```

### 51. N-Queens (Hard)

- **Problem (English)**:
    - Place `n` queens on an `n x n` chessboard so that no two queens attack each other.
    - Return all distinct solutions.
    - Each solution should be represented as a board of strings, where `'Q'` marks a queen and `'.'` marks an empty square.
    - You may return the answer in any order.
- **題目（中文）**：
    - 請在 `n x n` 的棋盤上放置 `n` 個皇后，使任兩個皇后都不會互相攻擊。
    - 請回傳所有不同的合法解。
    - 每組答案需用字串棋盤表示，其中 `'Q'` 代表皇后，`'.'` 代表空格。
    - 答案順序不限。

- **Examples**:
  - Example 1: `n = 4`
    - Output: `[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]`
    - Explanation: There exist two distinct solutions to the 4-queens puzzle as shown above
  - Example 2: `n = 1`
    - Output: `[["Q"]]`
- **Constraints**:
  - `1 <= n <= 9`

- **套路**：回溯 + 欄位 / 對角線集合剪枝
- **思路**：
    - 每一列只放一個皇后，所以遞迴層數直接對應列號 `row`。
    - 若某個 `col`、主對角線 `row - col`、副對角線 `row + col` 已被占用，就不能再放皇后。
    - 當成功放完 `n` 列時，把整個棋盤轉成字串陣列加入答案。
- **TC**：O(n!)
    - 每一列都在剩餘欄位中嘗試放皇后，剪枝後實際分支會少很多，但上界仍可視為階乘級。
- **SC**：O(n)
    - 遞迴深度、三個集合中同時保存的元素數量都與 `n` 同階，不計輸出答案本身。
- **其他思路**：
    - **Bitmask 回溯**：用位元記錄可用欄位與對角線，速度更快，常見於進階優化版本。
- **解法比較**：
    - **集合剪枝**：優點是語意清楚，最適合教學與面試。缺點是常數因子比 bitmask 大。
    - **Bitmask**：優點是效能好。缺點是位運算可讀性低，推導成本較高。
- **測試重點 (Testing)**：
    - **`n = 1`**：預期只有一組解 `[["Q"]]`。
    - **`n = 2` / `n = 3`**：都應回傳空陣列。
    - **`n = 4`**：應有 `2` 組解，是最常見驗證案例。
    - **較大 `n`**：例如 `n = 5`，確認回溯與剪枝邏輯穩定。

```python
def solveNQueens(n):
        result = []
        cols = set()
        diag1 = set()
        diag2 = set()
        board = [["."] * n for _ in range(n)]

        def backtrack(row):
                if row == n:
                        result.append(["".join(line) for line in board])
                        return

                for col in range(n):
                        if col in cols or (row - col) in diag1 or (row + col) in diag2:
                                continue

                        cols.add(col)
                        diag1.add(row - col)
                        diag2.add(row + col)
                        board[row][col] = "Q"

                        backtrack(row + 1)

                        board[row][col] = "."
                        cols.remove(col)
                        diag1.remove(row - col)
                        diag2.remove(row + col)

        backtrack(0)
        return result
```
