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

---

### 39. Combination Sum (Med.)

---

### 46. Permutations (Med.)

---

### 17. Letter Combinations of a Phone Number (Med.)

---

### 79. Word Search (Med.)

---

### 36. Valid Sudoku (Med.)

---

### 37. Sudoku Solver (Hard)

---

### 51. N-Queens (Hard)
