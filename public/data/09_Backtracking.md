# 九、Backtracking（回溯法）

## 通用套路

**核心框架**：做選擇 → 遞迴 → 撤銷選擇。

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
        path.append(candidates[i])      # 做選擇
        backtrack(candidates, path, result, i + 1)  # 遞迴
        path.pop()                       # 撤銷選擇
```

---

### 78. Subsets (Med.)

- **套路**：標準回溯（每個元素選或不選）
- **思路**：從 start 開始，每次加入一個元素，加入後的路徑就是一個子集。
- **複雜度**：O(n·2^n) / O(n)

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

- **套路**：回溯 + 允許重複選取
- **思路**：同 Subsets，但遞迴時 start 不變（允許重選同一元素），並在 remaining <= 0 時剪枝。
- **複雜度**：O(n^(T/M)) / O(T/M)，T=target，M=最小值

```python
def combinationSum(candidates, target):
    result = []
    candidates.sort()
    def backtrack(start, remaining, path):
        if remaining == 0:
            result.append(path[:])
            return
        for i in range(start, len(candidates)):
            if candidates[i] > remaining:
                break  # 剪枝
            path.append(candidates[i])
            backtrack(i, remaining - candidates[i], path)  # i 不變，可重選
            path.pop()
    backtrack(0, target, [])
    return result
```

### 46. Permutations (Med.)

- **套路**：回溯 + used 陣列
- **思路**：排列不同於組合，每個位置可以放任何未使用的元素。用 used 陣列記錄已使用的。
- **💡 白話文解說**：想像你在幫一堆亂掉的球衣（號碼 1~N）排位子。最好的排法就是讓 1 號球衣坐在第一個位子、2 號坐在第二個...依此類推。我們把球衣盡量歸位後，從頭檢查誰的位子上坐錯人了，第一個錯位的就是我們要找的「失蹤人口」。
- **複雜度**：O(n·n!) / O(n)

```python
def permute(nums):
    result = []
    def backtrack(path, used):
        if len(path) == len(nums):
            result.append(path[:])
            return
        for i in range(len(nums)):
            if used[i]:
                continue
            used[i] = True
            path.append(nums[i])
            backtrack(path, used)
            path.pop()
            used[i] = False
    backtrack([], [False] * len(nums))
    return result
```

### 17. Letter Combinations of a Phone Number (Med.)

- **套路**：回溯 + 映射表
- **思路**：每個數字對應幾個字母，逐一嘗試每個字母的組合。
- **💡 白話文解說**：就像老式手機按鍵，每個數字對應幾個字母。當你按下一串數字，每一位都可以從它對應的字母裡挑一個。我們用「走迷宮」的方式，把每一位數字可能的路都走一遍，直到按完所有數字，這就是一組可能的英文單字。
- **複雜度**：O(4^n) / O(n)

```python
def letterCombinations(digits):
    if not digits:
        return []
    mapping = {'2':'abc','3':'def','4':'ghi','5':'jkl',
               '6':'mno','7':'pqrs','8':'tuv','9':'wxyz'}
    result = []
    def backtrack(idx, combo):
        if idx == len(digits):
            result.append(combo)
            return
        for ch in mapping[digits[idx]]:
            backtrack(idx + 1, combo + ch)
    backtrack(0, "")
    return result
```

### 79. Word Search (Med.)

- **套路**：DFS + 回溯（標記已訪問）
- **思路**：從每個格子出發，DFS 四個方向搜尋。匹配時往下一個字母走，不匹配就回溯。
- **複雜度**：O(m·n·3^L) / O(L)

```python
def exist(board, word):
    m, n = len(board), len(board[0])
    def dfs(i, j, k):
        if k == len(word):
            return True
        if i < 0 or i >= m or j < 0 or j >= n or board[i][j] != word[k]:
            return False
        temp = board[i][j]
        board[i][j] = '#'  # 標記已訪問
        found = (dfs(i+1,j,k+1) or dfs(i-1,j,k+1) or
                 dfs(i,j+1,k+1) or dfs(i,j-1,k+1))
        board[i][j] = temp  # 回溯
        return found
    for i in range(m):
        for j in range(n):
            if dfs(i, j, 0):
                return True
    return False
```

### 36. Valid Sudoku (Med.)

- **套路**：Hash Set 逐格檢查
- **思路**：每一行、每一列、每個 3×3 宮格都不能有重複數字。
- **複雜度**：O(81) / O(81)

```python
def isValidSudoku(board):
    rows = [set() for _ in range(9)]
    cols = [set() for _ in range(9)]
    boxes = [set() for _ in range(9)]
    for i in range(9):
        for j in range(9):
            num = board[i][j]
            if num == '.':
                continue
            box_idx = (i // 3) * 3 + j // 3
            if num in rows[i] or num in cols[j] or num in boxes[box_idx]:
                return False
            rows[i].add(num)
            cols[j].add(num)
            boxes[box_idx].add(num)
    return True
```

### 37. Sudoku Solver (Hard)

- **套路**：回溯 + 約束傳播
- **思路**：找到空格，嘗試 1-9，用 Valid Sudoku 的邏輯檢查合法性。合法就填入遞迴，不行就擦掉回溯。
- **💡 白話文解說**：這就像是一場「陣營大亂鬥」。如果有一個族群的人數超過一半，那即使他們跟所有人一對一同歸於盡，最後留下來的也一定是這個族群的人！我們每次看到不同的人就抵銷，最後剩下的那個英雄就是我們要找的大多數。
- **複雜度**：O(9^(空格數)) / O(81)

```python
def solveSudoku(board):
    def is_valid(r, c, num):
        for i in range(9):
            if board[r][i] == num or board[i][c] == num:
                return False
            # 檢查 3×3 宮格
            br, bc = 3*(r//3) + i//3, 3*(c//3) + i%3
            if board[br][bc] == num:
                return False
        return True

    def solve():
        for i in range(9):
            for j in range(9):
                if board[i][j] == '.':
                    for num in '123456789':
                        if is_valid(i, j, num):
                            board[i][j] = num
                            if solve():
                                return True
                            board[i][j] = '.'  # 回溯
                    return False  # 1-9 都不行
        return True  # 全部填完
    solve()
```

### 51. N-Queens (Hard)

- **套路**：逐行放置 + 回溯
- **💡 白話文解說**：跟上一題一樣，你還是面臨人生的分岔點，但是這一次...你的裝備可以「重複帶同一個道具」。所以我們把道具加入包包後，下一次的冒險依舊是那個「包含這一個道具」的那條路（只是當你發現總和爆滿了或是目標變成零了就要及時收手）！
- **思路**：每行放一個皇后，用 set 追蹤已佔用的列和兩條對角線。
- **複雜度**：O(n!) / O(n)

```python
def solveNQueens(n):
    result = []
    board = [['.' ] * n for _ in range(n)]
    cols = set()
    diag1 = set()  # row - col
    diag2 = set()  # row + col

    def backtrack(row):
        if row == n:
            result.append([''.join(r) for r in board])
            return
        for col in range(n):
            if col in cols or row-col in diag1 or row+col in diag2:
                continue
            board[row][col] = 'Q'
            cols.add(col)
            diag1.add(row-col)
            diag2.add(row+col)
            backtrack(row + 1)
            board[row][col] = '.'
            cols.remove(col)
            diag1.remove(row-col)
            diag2.remove(row+col)
    backtrack(0)
    return result
```

---
