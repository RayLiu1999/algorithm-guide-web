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
        dp[i] = transition(dp[i - 1], dp[i - 2], ...)
    return dp[n]
```

---

### 70. Climbing Stairs (Easy)

- **Problem (English)**: You are climbing a staircase with n steps. Each time you can climb 1 or 2 steps. In how many distinct ways can you climb to the top?
- **題目（中文）**：給定一個有 n 階的樓梯，每次可以爬 1 階或 2 階，求有多少種不同的方式可以爬到頂部。

- **Examples**:
  - Example 1: `n = 2`
    - Output: `2`
    - Explanation: There are two ways to climb to the top.
1. 1 step + 1 step
2. 2 steps
  - Example 2: `n = 3`
    - Output: `3`
    - Explanation: There are three ways to climb to the top.
1. 1 step + 1 step + 1 step
2. 1 step + 2 steps
3. 2 steps + 1 step
- **Constraints**:
  - `1 <= n <= 45`

- **套路**：一維 DP / Fibonacci
- **思路**：
  - 走到第 `i` 階的最後一步，只可能從第 `i - 1` 階跨 1 步上來，或從第 `i - 2` 階跨 2 步上來。
  - 因此方法數滿足 `dp[i] = dp[i - 1] + dp[i - 2]`；又因為轉移只依賴前兩項，所以可以用滾動變數代替整個陣列。
- **TC**：O(n)
  - 從第 3 階一路算到第 `n` 階，每一階只更新一次。
- **SC**：O(1)
  - 只需要兩個變數保存前兩個狀態。
- **其他思路**：
  - Top-down 記憶化遞迴：直接照遞迴式 `f(n) = f(n - 1) + f(n - 2)` 寫，再把算過的結果存起來。
- **解法比較**：
  - 滾動 DP：空間最省，寫法也最短。
  - 記憶化遞迴：更貼近原始遞迴定義，對剛學 DP 的人較直觀。
- **測試重點 (Testing)**：
  - `n = 1`、`n = 2`，確認 base case 正確。
  - `n = 3`、`n = 5` 這類可手算的小案例，確認轉移式。
  - 較大的 `n`，確認不會因多餘空間或遞迴深度出問題。

```python
def climbStairs(n):
    if n <= 2:
        return n

    first, second = 1, 2
    for _ in range(3, n + 1):
        first, second = second, first + second

    return second
```

### 198. House Robber (Med.)

- **Problem (English)**: You are a robber planning to rob houses along a street. You cannot rob two adjacent houses. Given an integer array where each element is the amount of money in each house, return the maximum amount of money you can rob without alerting the police.
- **題目（中文）**：給定一個陣列表示各房屋的金額，你不能搶相鄰的兩間房子，求能搶到的最大金額。

- **Examples**:
  - Example 1: `nums = [1,2,3,1]`
    - Output: `4`
    - Explanation: Rob house 1 (money = 1) and then rob house 3 (money = 3).
Total amount you can rob = 1 + 3 = 4.
  - Example 2: `nums = [2,7,9,3,1]`
    - Output: `12`
    - Explanation: Rob house 1 (money = 2), rob house 3 (money = 9) and rob house 5 (money = 1).
Total amount you can rob = 2 + 9 + 1 = 12.
- **Constraints**:
  - `1 <= nums.length <= 100`
  - `0 <= nums[i] <= 400`

- **套路**：線性 DP 的選或不選
- **思路**：
  - 到第 `i` 間房時，要嘛不搶它，答案沿用前一間的最佳值；要嘛搶它，答案就是前兩間最佳值加上當前金額。
  - 所以狀態轉移是 `max(dp[i - 1], dp[i - 2] + nums[i])`，而且只依賴前兩項，可以壓成兩個變數。
- **TC**：O(n)
  - 每間房子只會被掃過一次並更新一次最佳答案。
- **SC**：O(1)
  - 只保留前一間與前兩間的最佳收益。
- **其他思路**：
  - 記憶化遞迴：把每個位置開始能搶到的最大值存進 `memo`，用遞迴做選或不選。
- **解法比較**：
  - 滾動 DP：最省空間，也是這題最標準的寫法。
  - 記憶化遞迴：決策樹語意清楚，但有額外遞迴堆疊開銷。
- **測試重點 (Testing)**：
  - 空陣列、單一房子、兩間房子的邊界情況。
  - 典型案例 `[1, 2, 3, 1]`，確認會跳過相鄰房子。
  - 高低交錯如 `[2, 1, 1, 2]`，確認不會只看局部最大值。
  - 所有金額相同時，確認仍能選出正確的不相鄰組合。

```python
def rob(nums):
    prev2 = 0
    prev1 = 0

    for num in nums:
        prev2, prev1 = prev1, max(prev1, prev2 + num)

    return prev1
```

### 322. Coin Change (Med.)

- **Problem (English)**: You are given an array of coin denominations and an integer amount. You have an infinite number of each kind of coin. Return the fewest coins needed to make up that amount, or `-1` if it is impossible.
- **題目（中文）**：給定不同面額的硬幣與一個金額，且每種硬幣都可以無限使用。請回傳湊出該金額所需的最少硬幣數；若無法湊出則回傳 `-1`。

- **Examples**:
  - Example 1: `coins = [1,2,5], amount = 11`
    - Output: `3`
    - Explanation: 11 = 5 + 5 + 1
  - Example 2: `coins = [2], amount = 3`
    - Output: `-1`
  - Example 3: `coins = [1], amount = 0`
    - Output: `0`
- **Constraints**:
  - `1 <= coins.length <= 12`
  - `1 <= coins[i] <= 2^31 - 1`
  - `0 <= amount <= 10^4`

- **套路**：完全背包 (Unbounded Knapsack)
- **思路**：
  - 定義 `dp[value]` 為組成金額 `value` 所需的最少硬幣數，則對每個 `coin`，都可以從 `dp[value - coin]` 轉移過來。
  - 因為同一種硬幣可以無限使用，所以對每個金額都能反覆嘗試所有硬幣，取最小值即可；`dp[0] = 0` 是 base case。
- **TC**：O(amount * n)
  - `amount` 個金額狀態，每個狀態都要嘗試 `n` 種硬幣。
- **SC**：O(amount)
  - 只需要一個長度為 `amount + 1` 的 DP 陣列。
- **其他思路**：
  - Top-down 記憶化搜索：把『湊出剩餘金額 `remain` 的最少硬幣數』當成遞迴子問題，用 `memo` 避免重算。
- **解法比較**：
  - Bottom-up DP：沒有遞迴深度問題，狀態覆蓋完整而穩定。
  - 記憶化遞迴：思考上更像『試每種硬幣』，但要額外處理不可達狀態與堆疊深度。
- **測試重點 (Testing)**：
  - `coins = [1, 2, 5], amount = 11`，典型案例應輸出 `3`。
  - `coins = [2], amount = 3`，無法組成時應回傳 `-1`。
  - `amount = 0` 時，應回傳 `0`。
  - 只有單一硬幣、剛好整除與無法整除兩種情況都要測。
  - 硬幣面額全部大於 `amount` 時，不應誤判可行。

```python
def coinChange(coins, amount):
    dp = [amount + 1] * (amount + 1)
    dp[0] = 0

    for value in range(1, amount + 1):
        for coin in coins:
            if value >= coin:
                dp[value] = min(dp[value], dp[value - coin] + 1)

    return dp[amount] if dp[amount] <= amount else -1
```

### 139. Word Break (Med.)

- **Problem (English)**: Given a string and a dictionary of words, determine if the string can be segmented into words from the dictionary.
- **題目（中文）**：給定一個字串和一個單字字典，判斷字串是否能被字典中的單字完整分割。

- **Examples**:
  - Example 1: `s = "leetcode", wordDict = ["leet","code"]`
    - Output: `true`
    - Explanation: Return true because "leetcode" can be segmented as "leet code".
  - Example 2: `s = "applepenapple", wordDict = ["apple","pen"]`
    - Output: `true`
    - Explanation: Return true because "applepenapple" can be segmented as "apple pen apple".
Note that you are allowed to reuse a dictionary word.
  - Example 3: `s = "catsandog", wordDict = ["cats","dog","sand","and","cat"]`
    - Output: `false`
- **Constraints**:
  - `1 <= s.length <= 300`
  - `1 <= wordDict.length <= 1000`
  - `1 <= wordDict[i].length <= 20`
  - s and wordDict[i] consist of only lowercase English letters.
  - All the strings of wordDict are unique.

- **套路**：字串切分 DP
- **思路**：
  - `dp[i]` 表示前 `i` 個字元 `s[:i]` 是否能被字典完整切開；若存在某個切點 `j`，使得 `dp[j]` 為真且 `s[j:i]` 在字典中，則 `dp[i] = True`。
  - 這樣可以把原本指數級的切分樹壓成線性數量的 prefix 狀態，每個 prefix 只判斷一次。
- **TC**：O(n^2)
  - 對每個結尾位置 `i`，最壞情況下都要嘗試多個切分長度或切點。
- **SC**：O(n)
  - DP 陣列只需記錄每個 prefix 是否可切分。
- **其他思路**：
  - Trie + DFS：把字典建成 Trie，從字串每個起點往下比對可用單字，再搭配記憶化避免重複搜索。
- **解法比較**：
  - Bottom-up DP：狀態明確、最容易 debug。
  - Trie + DFS：字典很大且有大量共同前綴時，剪枝效果更好，但實作成本較高。
- **測試重點 (Testing)**：
  - `s = 'leetcode'` 配 `['leet', 'code']`，應回傳 `True`。
  - `s = 'applepenapple'`，確認可重複使用同一個單字。
  - `s = 'catsandog'` 這種只差一段無法匹配的案例，應回傳 `False`。
  - 有重疊單字如 `['cat', 'cats', 'and', 'sand', 'dog']`，確認不會錯過正確切法。

```python
def wordBreak(s, wordDict):
    words = set(wordDict)
    max_len = max((len(word) for word in wordDict), default=0)
    dp = [False] * (len(s) + 1)
    dp[0] = True

    for i in range(1, len(s) + 1):
        for length in range(1, min(max_len, i) + 1):
            if dp[i - length] and s[i - length:i] in words:
                dp[i] = True
                break

    return dp[-1]
```

### 62. Unique Paths (Med.)

- **Problem (English)**: A robot is located at the top-left corner of an m x n grid. It can only move right or down. How many unique paths are there to the bottom-right corner?
- **題目（中文）**：機器人位於 m x n 網格的左上角，只能向右或向下移動，求到達右下角有多少條不同的路徑。

- **Examples**:
  - Example 1: `m = 3, n = 7`
    - Output: `28`
  - Example 2: `m = 3, n = 2`
    - Output: `3`
    - Explanation: From the top-left corner, there are a total of 3 ways to reach the bottom-right corner:
1. Right -> Down -> Down
2. Down -> Down -> Right
3. Down -> Right -> Down
- **Constraints**:
  - `1 <= m, n <= 100`

- **套路**：網格 DP
- **思路**：
  - 走到某格的方法數，只會來自上方或左方，因為機器人只能向右或向下。
  - 第一列與第一行都只有一種走法，因此初始化成 `1`；接著逐格累加即可。
- **TC**：O(m * n)
  - 每個格子都要根據左方與上方更新一次。
- **SC**：O(n)
  - 用一列長度為 `n` 的滾動陣列，就能同時表示目前列與上一列資訊。
- **其他思路**：
  - 組合數：總共要走 `m - 1` 次下與 `n - 1` 次右，本質上是從 `m + n - 2` 步裡挑出哪幾步向下。
- **解法比較**：
  - DP：最容易延伸到障礙物、權重等變形題。
  - 組合數：數學上更精簡，空間更省，但不容易直接套到變形題。
- **測試重點 (Testing)**：
  - 單列或單行時，答案都應為 `1`。
  - 小型矩陣如 `3 x 7` 可手算驗證。
  - 正方形與長條形矩陣都要測，避免把 `m`、`n` 寫反。
  - 較大尺寸時，確認不會誤用遞迴導致超時。

```python
def uniquePaths(m, n):
    dp = [1] * n

    for _ in range(1, m):
        for col in range(1, n):
            dp[col] += dp[col - 1]

    return dp[-1]
```

### 416. Partition Equal Subset Sum (Med.)

- **Problem (English)**: Given an integer array, determine if it can be partitioned into two subsets with equal sum.
- **題目（中文）**：給定一個整數陣列，判斷是否能分割成兩個總和相等的子集。

- **Examples**:
  - Example 1: `nums = [1,5,11,5]`
    - Output: `true`
    - Explanation: The array can be partitioned as [1, 5, 5] and [11].
  - Example 2: `nums = [1,2,3,5]`
    - Output: `false`
    - Explanation: The array cannot be partitioned into equal sum subsets.
- **Constraints**:
  - `1 <= nums.length <= 200`
  - `1 <= nums[i] <= 100`

- **套路**：0/1 背包布林 DP
- **思路**：
  - 若總和是奇數，就不可能平分；否則問題變成：能不能從陣列中挑一些數字，湊出 `target = total // 2`。
  - `dp[value]` 表示是否能湊出 `value`，而且要倒序更新，避免同一個數字在同一輪被重複使用。
- **TC**：O(n * target)
  - 每個數字都要嘗試更新到 `target` 的可達性。
- **SC**：O(target)
  - 只需要一維布林陣列記錄可達和。
- **其他思路**：
  - Set-based DP：維護目前所有可達的 subset sum，每加入一個數字就擴張出新的和。
- **解法比較**：
  - 布林 DP：記憶體大小固定，行為更可預期。
  - Set DP：寫法簡潔，當可達和很稀疏時常常很快，但狀態數可能膨脹。
- **測試重點 (Testing)**：
  - 總和為奇數時，應立即回傳 `False`。
  - 可平分與不可平分案例都要測。
  - 含重複值時，確認每個元素最多使用一次。
  - 有單一超大值大於 `target` 時，確認不會誤判可行。

```python
def canPartition(nums):
    total = sum(nums)
    if total % 2 == 1:
        return False

    target = total // 2
    dp = [False] * (target + 1)
    dp[0] = True

    for num in nums:
        for value in range(target, num - 1, -1):
            dp[value] = dp[value] or dp[value - num]

    return dp[target]
```

### 91. Decode Ways (Med.)

- **Problem (English)**: A message containing only digits needs to be decoded. 1-26 map to 'A'-'Z'. Given an encoded message, return the total number of ways to decode it.
- **題目（中文）**：給定只含數字的編碼字串，其中 1-26 對應 'A'-'Z'，求所有可能的解碼方式總數。

- **Examples**:
- **Constraints**:
  - `1 <= s.length <= 100`
  - s contains only digits and may contain leading zero(s).

- **套路**：一維 DP 根據一碼與兩碼轉移
- **思路**：
  - 走到位置 `i` 時，若當前一碼不是 `0`，就可以把它單獨解碼，從前一格答案轉移過來；若前兩碼介於 `10` 到 `26`，也可視為一個字母，從前兩格轉移。
  - 每一步只依賴前兩個狀態，因此可以用兩個變數滾動維護，不必保留整個 DP 陣列。
- **TC**：O(n)
  - 每個字元只會被處理一次。
- **SC**：O(1)
  - 只需要保存前兩個位置的解碼方法數。
- **其他思路**：
  - 完整 DP 陣列或記憶化遞迴：都能做出相同轉移，只是狀態保存方式不同。
- **解法比較**：
  - 滾動 DP：空間最省，且足以表達這題所有依賴。
  - 完整 DP：索引更直觀，對 debug 邊界條件比較友善。
- **測試重點 (Testing)**：
  - `s = '12'`，同時有一碼與兩碼兩種解法。
  - `s = '06'` 這種前導零，應回傳 `0`。
  - 含 `0` 但仍合法的案例如 `'101'`、`'2101'`。
  - 長串重複數字如 `'111111'`，確認累加邏輯正確。

```python
def numDecodings(s):
    if not s or s[0] == '0':
        return 0

    prev2 = 1
    prev1 = 1

    for i in range(1, len(s)):
        current = 0

        if s[i] != '0':
            current += prev1

        if 10 <= int(s[i - 1:i + 1]) <= 26:
            current += prev2

        if current == 0:
            return 0

        prev2, prev1 = prev1, current

    return prev1
```

### 152. Maximum Product Subarray (Med.)

- **Problem (English)**: Given an integer array, find the contiguous subarray that has the largest product. Return the maximum product.
- **題目（中文）**：給定整數陣列，求連續子陣列的最大乘積。

- **Examples**:
  - Example 1: `nums = [2,3,-2,4]`
    - Output: `6`
    - Explanation: [2,3] has the largest product 6.
  - Example 2: `nums = [-2,0,-1]`
    - Output: `0`
    - Explanation: The result cannot be 2, because [-2,-1] is not a subarray.
- **Constraints**:
  - `1 <= nums.length <= 2 * 10^4`
  - `-10 <= nums[i] <= 10`
  - The product of any subarray of nums is guaranteed to fit in a 32-bit integer.

- **套路**：同時追蹤最大積與最小積
- **思路**：
  - 乘積問題和加總不同，因為負數會讓最大與最小角色互換；前一步的最小負積，乘上新的負數後可能突然變成最大正積。
  - 因此每一步都要同時更新『以當前位置結尾的最大積』與『最小積』，答案取全域最大值。
- **TC**：O(n)
  - 每個元素只會參與一次狀態更新。
- **SC**：O(1)
  - 只需常數個變數保存當前最大積、最小積與答案。
- **其他思路**：
  - Prefix/Suffix 掃描：從左到右、再從右到左各乘一次，遇到 `0` 就重置，利用兩次掃描捕捉負數翻轉情況。
- **解法比較**：
  - Max/Min DP：狀態語意最完整，也最容易說明為什麼負數要保留最小積。
  - Prefix/Suffix：程式較短，但對正確性的解釋通常不如 DP 直觀。
- **測試重點 (Testing)**：
  - 含 `0` 的案例，確認乘積會在 `0` 處重置。
  - 負數個數為奇數與偶數兩種情況。
  - 單一元素陣列與全負數陣列。
  - 最大乘積不在整段，而是在中間子陣列的情況。

```python
def maxProduct(nums):
    max_prod = nums[0]
    min_prod = nums[0]
    answer = nums[0]

    for num in nums[1:]:
        candidates = (num, max_prod * num, min_prod * num)
        max_prod = max(candidates)
        min_prod = min(candidates)
        answer = max(answer, max_prod)

    return answer
```

### 300. Longest Increasing Subsequence (Med.)

- **Problem (English)**: Given an integer array, find the length of the longest strictly increasing subsequence.
- **題目（中文）**：給定整數陣列，求最長遞增子序列的長度。

- **Examples**:
  - Example 1: `nums = [10,9,2,5,3,7,101,18]`
    - Output: `4`
    - Explanation: The longest increasing subsequence is [2,3,7,101], therefore the length is 4.
  - Example 2: `nums = [0,1,0,3,2,3]`
    - Output: `4`
  - Example 3: `nums = [7,7,7,7,7,7,7]`
    - Output: `1`
- **Constraints**:
  - `1 <= nums.length <= 2500`
  - `-10^4 <= nums[i] <= 10^4`

- **套路**：一維 DP
- **思路**：
  - `dp[i]` 表示以 `nums[i]` 結尾的最長遞增子序列長度；若 `nums[j] < nums[i]`，就能從 `dp[j]` 轉移成 `dp[j] + 1`。
  - 對每個 `i` 枚舉所有 `j < i`，取能接在它前面的最佳值，最後整體答案是所有 `dp[i]` 的最大值。
- **TC**：O(n^2)
  - 每個位置都要回頭檢查前面所有位置是否能接上。
- **SC**：O(n)
  - DP 陣列需存每個位置作為結尾時的最佳答案。
- **其他思路**：
  - Patience Sorting + Binary Search：維護每個長度遞增子序列的最小可能尾值，可把時間降到 O(n log n)。
- **解法比較**：
  - O(n^2) DP：狀態清楚、最容易從定義推出來。
  - O(n log n) 做法：效能更好，但 `tails` 陣列的語意較抽象，不一定適合第一次講解。
- **測試重點 (Testing)**：
  - 已遞增、完全遞減兩種極端情況。
  - 含重複值時，確認『嚴格遞增』不會把相等元素接在一起。
  - 混合升降序列，確認答案可能來自不連續位置。
  - 單一元素陣列，答案應為 `1`。

```python
def lengthOfLIS(nums):
    dp = [1] * len(nums)

    for i in range(len(nums)):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)

    return max(dp)
```

### 221. Maximal Square (Med.)

- **Problem (English)**: Given an m x n binary matrix, find the largest square containing only 1's. Return the area of the largest such square.
- **題目（中文）**：給定 m x n 的二進制矩陣，求最大只含 1 的正方形面積。

- **Examples**:
  - Example 1: `matrix = [["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]`
    - Output: `4`
  - Example 2: `matrix = [["0","1"],["1","0"]]`
    - Output: `1`
  - Example 3: `matrix = [["0"]]`
    - Output: `0`
- **Constraints**:
  - `m == matrix.length`
  - `n == matrix[i].length`
  - `1 <= m, n <= 300`
  - matrix[i][j] is '0' or '1'.

- **套路**：2D DP 看左、上、左上最小值
- **思路**：
  - 若 `matrix[r][c]` 是 `'1'`，則以它為右下角的最大正方形邊長，取決於左、上、左上三個方向能形成的最小邊長，再加 1。
  - 若該格是 `'0'`，那它不可能作為任何全 1 正方形的右下角，對應邊長就是 0。
- **TC**：O(m * n)
  - 每個格子都只需要依據三個鄰居做一次更新。
- **SC**：O(m * n)
  - 使用一張同尺寸級別的 DP 表記錄每格作為右下角的最大邊長。
- **其他思路**：
  - 1D 滾動 DP：用一列陣列加上一個 `prev_diag` 變數，將空間壓縮到 O(n)。
- **解法比較**：
  - 2D DP：最容易看懂三個方向的轉移關係。
  - 1D 壓縮：更省記憶體，但更新順序與 `prev_diag` 較容易寫錯。
- **測試重點 (Testing)**：
  - 全 `0`、全 `1` 的極端情況。
  - 最大正方形出現在中間而不是邊界。
  - 單行、單列矩陣。
  - 多個不同大小正方形並存時，確認能取到最大面積。

```python
def maximalSquare(matrix):
    rows, cols = len(matrix), len(matrix[0])
    dp = [[0] * (cols + 1) for _ in range(rows + 1)]
    best = 0

    for r in range(1, rows + 1):
        for c in range(1, cols + 1):
            if matrix[r - 1][c - 1] == '1':
                dp[r][c] = min(dp[r - 1][c], dp[r][c - 1], dp[r - 1][c - 1]) + 1
                best = max(best, dp[r][c])

    return best * best
```

### 329. Longest Increasing Path in a Matrix (Hard)

- **Problem (English)**: Given an m x n integer matrix, find the length of the longest path where values strictly increase. You can move up, down, left, or right.
- **題目（中文）**：給定 m x n 整數矩陣，求值嚴格遞增的最長路徑長度，可上下左右移動。

- **Examples**:
  - Example 1: `matrix = [[9,9,4],[6,6,8],[2,1,1]]`
    - Output: `4`
    - Explanation: The longest increasing path is [1, 2, 6, 9].
  - Example 2: `matrix = [[3,4,5],[3,2,6],[2,2,1]]`
    - Output: `4`
    - Explanation: The longest increasing path is [3, 4, 5, 6]. Moving diagonally is not allowed.
  - Example 3: `matrix = [[1]]`
    - Output: `1`
- **Constraints**:
  - `m == matrix.length`
  - `n == matrix[i].length`
  - `1 <= m, n <= 200`
  - `0 <= matrix[i][j] <= 2^31 - 1`

- **套路**：DFS + 記憶化
- **思路**：
  - 從每個格子出發，往四個方向中所有更大的鄰居延伸，最長遞增路徑長度就是 `1 + max(鄰居答案)`。
  - `memo[r][c]` 把『從這格出發的最佳答案』存起來後，同一格就不必重做 DFS，因此總複雜度會降到線性級別。
- **TC**：O(m * n)
  - 每個格子的 DFS 真正計算一次，且每次只檢查固定四個方向。
- **SC**：O(m * n)
  - `memo` 需要存整張網格的答案，遞迴堆疊最壞也可能到同級別。
- **其他思路**：
  - 拓樸層次 BFS：把矩陣看成 DAG，依遞增方向建邊，再用 outdegree 或 indegree 做分層拓樸排序。
- **解法比較**：
  - DFS + Memo：最貼合『從某格出發的最佳子問題』這個定義。
  - 拓樸 BFS：完全迭代、沒有遞迴，但前置建圖思維較重。
- **測試重點 (Testing)**：
  - 單一格子時，答案應為 `1`。
  - 大量相同值的平臺，確認不會把相等值當成遞增。
  - 嚴格遞增蛇形路徑，確認能延伸跨多步。
  - 多個局部高點並存時，確認會取全域最長路徑。

```python
def longestIncreasingPath(matrix):
    if not matrix or not matrix[0]:
        return 0

    rows, cols = len(matrix), len(matrix[0])
    memo = [[0] * cols for _ in range(rows)]

    def dfs(r, c):
        if memo[r][c] != 0:
            return memo[r][c]

        best = 1
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and matrix[nr][nc] > matrix[r][c]:
                best = max(best, 1 + dfs(nr, nc))

        memo[r][c] = best
        return best

    return max(dfs(r, c) for r in range(rows) for c in range(cols))
```

### 377. Combination Sum IV (Med.)

- **Problem (English)**: Given an integer array of distinct numbers, return the number of possible combinations that add up to the target. The order matters.
- **題目（中文）**：給定不同整數的陣列，求有多少種排列方式可以加總為目標值，順序不同視為不同排列。

- **Examples**:
  - Example 1: `nums = [1,2,3], target = 4`
    - Output: `7`
    - Explanation: The possible combination ways are:
(1, 1, 1, 1)
(1, 1, 2)
(1, 2, 1)
(1, 3)
(2, 1, 1)
(2, 2)
(3, 1)
Note that different sequences are counted as different combinations.
  - Example 2: `nums = [9], target = 3`
    - Output: `0`
- **Constraints**:
  - `1 <= nums.length <= 200`
  - `1 <= nums[i] <= 1000`
  - All the elements of nums are unique.
  - `1 <= target <= 1000`

- **套路**：順序敏感的完全背包 DP
- **思路**：
  - `dp[total]` 表示組成 `total` 的排列數；這題把不同順序視為不同答案，所以外層必須先枚舉目標和，再枚舉可放在最後一步的數字。
  - 對每個 `num`，只要 `total >= num`，就能把所有組成 `total - num` 的序列後面再接上 `num`。
- **TC**：O(target * n)
  - 從 `1` 到 `target` 每個和都要嘗試全部 `n` 個數字。
- **SC**：O(target)
  - 只需要一維 DP 陣列記錄每個總和的排列數。
- **其他思路**：
  - Top-down 記憶化：定義 `dfs(remain)` 為剩餘和為 `remain` 時的排列數，遞迴試每個數字。
- **解法比較**：
  - Bottom-up DP：狀態順序固定，不容易漏 base case。
  - 記憶化遞迴：更像在展開所有可能序列，但遞迴層數較深時需要注意堆疊。
- **測試重點 (Testing)**：
  - `target = 0` 時，答案應為 `1`，代表空序列。
  - 標準案例 `nums = [1, 2, 3], target = 4`，確認順序不同要分開計數。
  - 完全無解時，應回傳 `0`。
  - `nums` 中有較大數字時，確認不會越界或重複計數。

```python
def combinationSum4(nums, target):
    dp = [0] * (target + 1)
    dp[0] = 1

    for total in range(1, target + 1):
        for num in nums:
            if total >= num:
                dp[total] += dp[total - num]

    return dp[target]
```

### 1235. Maximum Profit in Job Scheduling (Hard)

- **Problem (English)**: You are given job schedules with start time, end time, and profit. Non-overlapping jobs can be scheduled. Return the maximum profit achievable.
- **題目（中文）**：給定多份工作的開始、結束時間與利潤，找不重疊工作組合的最大利潤。

- **Examples**:
  - Example 1: `startTime = [1,2,3,3], endTime = [3,4,5,6], profit = [50,10,40,70]`
    - Output: `120`
    - Explanation: The subset chosen is the first and fourth job.
Time range [1-3]+[3-6] , we get profit of 120 = 50 + 70.
  - Example 2: `startTime = [1,2,3,4,6], endTime = [3,5,10,6,9], profit = [20,20,100,70,60]`
    - Output: `150`
    - Explanation: The subset chosen is the first, fourth and fifth job.
Profit obtained 150 = 20 + 70 + 60.
  - Example 3: `startTime = [1,1,1], endTime = [2,3,4], profit = [5,6,4]`
    - Output: `6`
- **Constraints**:
  - `1 <= startTime.length == endTime.length == profit.length <= 5 * 10^4`
  - `1 <= startTime[i] < endTime[i] <= 10^9`
  - `1 <= profit[i] <= 10^4`

- **套路**：排序 + 二分找下一份可接工作 + DP
- **思路**：
  - 先依開始時間排序，讓每份工作都能透過二分搜尋，快速找到下一份『開始時間不早於當前結束時間』的工作。
  - `dp[i]` 表示從第 `i` 份工作開始能拿到的最大利潤，因此每個位置都只有兩個選擇：跳過當前工作，或接下它並接到下一份不衝突工作。
- **TC**：O(n log n)
  - 排序要 O(n log n)，之後每份工作做一次二分搜尋。
- **SC**：O(n)
  - 需要儲存排序後工作列表、開始時間陣列與 DP 陣列。
- **其他思路**：
  - Top-down 記憶化 + Binary Search：遞迴地做『接或不接』，並把每個索引的答案存起來。
- **解法比較**：
  - Bottom-up DP：沒有遞迴深度問題，狀態從後往前很清楚。
  - 記憶化遞迴：更接近決策樹思維，但要留意遞迴層數與 memo 初始化。
- **測試重點 (Testing)**：
  - 互斥工作與可串接工作混合，確認二分找到的下一份工作正確。
  - 多份工作起訖時間相同時，確認會選利潤較高組合。
  - 單一工作、全部互相重疊、全部可串接三種極端情況。
  - 一份高利潤長工作與多份低利潤短工作競爭時，確認能選到總利潤較大者。

```python
from bisect import bisect_left


def jobScheduling(startTime, endTime, profit):
    jobs = sorted(zip(startTime, endTime, profit))
    starts = [job[0] for job in jobs]
    dp = [0] * (len(jobs) + 1)

    for i in range(len(jobs) - 1, -1, -1):
        next_index = bisect_left(starts, jobs[i][1])
        dp[i] = max(dp[i + 1], jobs[i][2] + dp[next_index])

    return dp[0]
```

### 31. Next Permutation (Med.)

- **Problem (English)**:
  - Rearrange the numbers into the next lexicographically greater permutation.
  - If such an arrangement is not possible, rearrange them into the lowest possible order, that is, sorted in ascending order.
  - The replacement must be done in place and use only constant extra memory.
- **題目（中文）**：
  - 請將數列重新排列成下一個字典序更大的排列。
  - 如果不存在更大的排列，就改成最小可能順序，也就是遞增排序後的結果。
  - 這個修改必須原地完成，且只能使用常數額外空間。

- **Examples**:
  - Example 1: `nums = [1,2,3]`
    - Output: `[1,3,2]`
  - Example 2: `nums = [3,2,1]`
    - Output: `[1,2,3]`
  - Example 3: `nums = [1,1,5]`
    - Output: `[1,5,1]`
- **Constraints**:
  - `1 <= nums.length <= 100`
  - `0 <= nums[i] <= 100`

- **套路**：找下降點 + 交換 + 反轉尾段
- **思路**：
  - 從右往左找第一個滿足 `nums[i] < nums[i + 1]` 的位置，這是還能把排列變大的最右 pivot。
  - 再從右側找第一個比 `nums[i]` 大的數與它交換，最後把右半尾段反轉成最小升序，就能得到『剛好比原排列大一點』的下一個排列。
- **TC**：O(n)
  - 最多做兩次從右到左掃描，再反轉一次尾段。
- **SC**：O(1)
  - 全程原地交換，不需要額外陣列。
- **其他思路**：
  - 暴力法：生成所有排列後排序，再找下一個；理論上可行，但時間與空間都完全不可接受。
- **解法比較**：
  - 原地線性解法：是這題唯一實用且標準的做法。
  - 暴力法：只適合教學對照，不適合實際解題。
- **測試重點 (Testing)**：
  - 已經是最大排列時，應反轉成最小排列。
  - 含重複值時，確認交換對象與尾段反轉仍正確。
  - 只有一個元素或兩個元素的邊界情況。
  - pivot 出現在中間時，確認尾段會被重設為最小字典序。

```python
def nextPermutation(nums):
    i = len(nums) - 2
    while i >= 0 and nums[i] >= nums[i + 1]:
        i -= 1

    if i >= 0:
        j = len(nums) - 1
        while nums[j] <= nums[i]:
            j -= 1
        nums[i], nums[j] = nums[j], nums[i]

    left, right = i + 1, len(nums) - 1
    while left < right:
        nums[left], nums[right] = nums[right], nums[left]
        left += 1
        right -= 1
```

### 50. Pow(x, n) (Med.)

- **Problem (English)**: Compute x raised to the power n, where n can be positive, negative, or zero.
- **題目（中文）**：計算 x 的 n 次方，n 可以是正數、負數或零。

- **Examples**:
  - Example 1: `x = 2.00000, n = 10`
    - Output: `1024.00000`
  - Example 2: `x = 2.10000, n = 3`
    - Output: `9.26100`
  - Example 3: `x = 2.00000, n = -2`
    - Output: `0.25000`
    - Explanation: 2^-2 = 1/2^2 = 1/4 = 0.25
- **Constraints**:
  - `-100.0 < x < 100.0`
  - `-2^31 <= n <= 2^31-1`
  - n is an integer.
  - Either x is not zero or n > 0.
  - `-10^4 <= x^n <= 10^4`

- **套路**：快速冪 / 二分冪次
- **思路**：
  - 把指數 `n` 看成二進位展開：若當前最低位是 1，就把目前的底數乘進答案；每處理完一位，就把底數平方、指數除以 2。
  - 這樣每一步都把問題規模減半，所以比起乘 `n` 次的做法，時間會從線性降到對數級。
- **TC**：O(log n)
  - 每次迴圈都把指數除以 2，總步數與指數位數成正比。
- **SC**：O(1)
  - 只使用常數個變數保存目前底數、指數與答案。
- **其他思路**：
  - 遞迴快速冪：先算 `x^(n // 2)`，再依奇偶決定是否多乘一次 `x`。
- **解法比較**：
  - 迭代快速冪：沒有遞迴堆疊，對大指數更穩定。
  - 遞迴快速冪：更貼近數學遞迴定義，但需要額外函式呼叫開銷。
- **測試重點 (Testing)**：
  - `n = 0` 時，答案應為 `1`。
  - 負指數時，確認會回傳倒數。
  - 負底數搭配奇數與偶數指數，符號應不同。
  - 底數為 `0` 且指數為正整數時，答案應為 `0`。

```python
def myPow(x, n):
    power = abs(n)
    result = 1
    base = x

    while power > 0:
        if power % 2 == 1:
            result *= base
        base *= base
        power //= 2

    return result if n >= 0 else 1 / result
```
