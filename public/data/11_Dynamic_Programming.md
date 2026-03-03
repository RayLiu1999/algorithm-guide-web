# 十一、Dynamic Programming（動態規劃）

## 題目目錄

- [70. Climbing Stairs (Easy)](#70-climbing-stairs-easy)
- [198. House Robber (Med.)](#198-house-robber-med)
- [322. Coin Change (Med.)](#322-coin-change-med)
- [139. Word Break (Med.)](#139-word-break-med)
- [62. Unique Paths (Med.)](#62-unique-paths-med)
- [416. Partition Equal Subset Sum (Med.)](#416-partition-equal-subset-sum-med)
- [91. Decode Ways (Med.)](#91-decode-ways-med)
- [152. Maximum Product Subarray (Med.)](#152-maximum-product-subarray-med)
- [300. Longest Increasing Subsequence (Med.)](#300-longest-increasing-subsequence-med)
- [221. Maximal Square (Med.)](#221-maximal-square-med)
- [329. Longest Increasing Path in a Matrix (Hard)](#329-longest-increasing-path-in-a-matrix-hard)
- [377. Combination Sum IV (Med.)](#377-combination-sum-iv-med)
- [1235. Maximum Profit in Job Scheduling (Hard)](#1235-maximum-profit-in-job-scheduling-hard)
- [31. Next Permutation (Med.)](#31-next-permutation-med)
- [50. Pow(x, n) (Med.)](#50-powx-n-med)

## 通用套路

**核心**：把大問題拆成重疊子問題，存起子問題的答案避免重複計算。

**解題步驟**：

1. 定義 dp[i] 代表什麼
2. 找出狀態轉移方程
3. 確定 base case
4. 決定遍歷順序

```python
# 套路模板：一維 DP
def dp_pattern(n):
    dp = [0] * (n + 1)
    dp[0] = base_case
    for i in range(1, n + 1):
        dp[i] = transition(dp[i-1], dp[i-2], ...)
    return dp[n]
```

---

### 70. Climbing Stairs (Easy)

---

### 198. House Robber (Med.)

---

### 322. Coin Change (Med.)

---

### 139. Word Break (Med.)

---

### 62. Unique Paths (Med.)

---

### 416. Partition Equal Subset Sum (Med.)

---

### 91. Decode Ways (Med.)

---

### 152. Maximum Product Subarray (Med.)

---

### 300. Longest Increasing Subsequence (Med.)

---

### 221. Maximal Square (Med.)

---

### 329. Longest Increasing Path in a Matrix (Hard)

---

### 377. Combination Sum IV (Med.)

---

### 1235. Maximum Profit in Job Scheduling (Hard)

---

### 31. Next Permutation (Med.)

---

### 50. Pow(x, n) (Med.)
