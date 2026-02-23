# 十一、Dynamic Programming（動態規劃）

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

### 43. Climbing Stairs (Easy)

- **套路**：基礎 DP（費波那契變形）
- **💡 白話文解說**：你可以把爬樓梯想像成分裂細胞。因為你每次只能踩 1 或 2 階，所以「走到第 N 階的方法數」就是「走到 N-1 階」和「走到 N-2 階」的方法數全部加總。
- **思路**：到第 n 階的方法 = 到第 n-1 階 + 到第 n-2 階（因為可以走 1 或 2 步）。
- **複雜度**：O(n) / O(1)

```python
def climbStairs(n):
    a, b = 1, 1
    for _ in range(n - 1):
        a, b = b, a + b
    return b
```

### 98. House Robber (Med.)

- **套路**：DP（取或不取）
- **💡 白話文解說**：這是一個專業小偷的掙扎。你現在走到第 i 間房子前面，如果你搶了，你就不能搶前一家（第 i-1），只能拿「前前家的收穫 + 這家」。如果你不搶，那就拿「前一家的收穫」。永遠選那個數字大的決定！
- **思路**：dp[i] = max(dp[i-1], dp[i-2] + nums[i])。要嘛不搶這家（保留前一家的最大值），要嘛搶這家（加上前前家的最大值）。
- **複雜度**：O(n) / O(1)

```python
def rob(nums):
    prev2, prev1 = 0, 0
    for num in nums:
        prev2, prev1 = prev1, max(prev1, prev2 + num)
    return prev1
```

### 41. Coin Change (Med.)

- **套路**：完全背包
- **💡 白話文解說**：這是超級換零錢法。我們知道 0 元需要 0 個硬幣。要換 11 元，你可以看看如果「換 11-5 元（也就是 6 元）」要最少幾個硬幣，如果能換出來（加上這一個 5 元），那就找到一個候選。就這樣一路從小數字推到目標，誰最少就選誰。
- **思路**：dp[i] = 用最少硬幣湊到金額 i。對每個金額嘗試每種硬幣。
- **複雜度**：O(amount × coins) / O(amount)

```python
def coinChange(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i:
                dp[i] = min(dp[i], dp[i - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1
```

### 8. Word Break (Med.)

- **套路**：DP + Hash Set
- **💡 白話文解說**：想知道一長串字能不能被字典的單字拼出來？我們就從左邊一個字母一個字母長。如果長到了某個位置發現「前面可以拼」且「剩下這段新加的也在字典裡」，那就代表目前這個位置也能被拼成合法的句子了！
- **思路**：dp[i] = s[0:i] 能否被拆成字典裡的單字。往前檢查每個可能的切割點 j：dp[j] 為 True 且 s[j:i] 在字典中。
- **複雜度**：O(n²·m) / O(n)

```python
def wordBreak(s, wordDict):
    word_set = set(wordDict)
    dp = [False] * (len(s) + 1)
    dp[0] = True
    for i in range(1, len(s) + 1):
        for j in range(i):
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break
    return dp[len(s)]
```

### 40. Unique Paths (Med.)

- **套路**：二維 DP
- **💡 白話文解說**：你是一個只能向右或向下的機器人。你要走到每一格的方法數，永遠都只會等於「從它左邊一格走過來的方法數」加上「從它上面一格走下來的方法數」。把這些可能一路疊加到右下角。
- **思路**：dp[i][j] = 到達 (i,j) 的路徑數 = dp[i-1][j] + dp[i][j-1]。
- **複雜度**：O(m·n) / O(n)

```python
def uniquePaths(m, n):
    dp = [1] * n
    for _ in range(1, m):
        for j in range(1, n):
            dp[j] += dp[j-1]
    return dp[-1]
```

### 26. Partition Equal Subset Sum (Med.)

- **套路**：0-1 背包
- **💡 白話文解說**：要平分寶物，就是看看能不能挑出剛好「總和一半」的裝備。如果有個背包大小剛好是總和的一半，我們就開始考慮每個裝備要不要放進去（0-1 背包問題）。只要能剛好塞滿，剩下的裝備自動另一半！
- **思路**：能否從陣列中選出一些數使其和 = 總和的一半。dp[j] = 是否能湊出和為 j。
- **複雜度**：O(n·sum) / O(sum)

```python
def canPartition(nums):
    total = sum(nums)
    if total % 2:
        return False
    target = total // 2
    dp = [False] * (target + 1)
    dp[0] = True
    for num in nums:
        for j in range(target, num - 1, -1):  # 反向遍歷（0-1 背包）
            dp[j] = dp[j] or dp[j - num]
    return dp[target]
```

### 59. Decode Ways (Med.)

- **套路**：DP（類似爬樓梯）
- **💡 白話文解說**：跟爬樓梯幾乎一模一樣的密碼解讀！每個數字你可以選「只當它 1 個字元解讀」，或是「和前一個數字湊在一起變成 10~26 的兩位數解讀」。把這些走法累積起來就是解碼的方式總數。只要遇到零就是陷阱，要小心處理。
- **思路**：每次可以取 1 位或 2 位解碼。dp[i] = 前 i 個字元的解碼方式數。
- **要點**：'0' 不能單獨解碼，需注意前導零。
- **複雜度**：O(n) / O(1)

```python
def numDecodings(s):
    if s[0] == '0':
        return 0
    prev2, prev1 = 1, 1
    for i in range(1, len(s)):
        curr = 0
        if s[i] != '0':
            curr += prev1
        if 10 <= int(s[i-1:i+1]) <= 26:
            curr += prev2
        prev2, prev1 = prev1, curr
    return prev1
```

### 89. Maximum Product Subarray (Med.)

- **套路**：追蹤最大值和最小值
- **💡 白話文解說**：負數乘負數會大翻身變成超大正數！所以我們不能只關注過去的「最大值」，還要關注過去的「最小值（可能是很深的負數）」。這樣一來當我們乘下一個負數時，曾經最小的最不起眼的人就會直接翻盤成為今天的超級大老。
- **思路**：負數會讓最大變最小、最小變最大。所以同時追蹤 max 和 min。
- **複雜度**：O(n) / O(1)

```python
def maxProduct(nums):
    result = max(nums)
    cur_max = cur_min = 1
    for num in nums:
        vals = (num, num * cur_max, num * cur_min)
        cur_max, cur_min = max(vals), min(vals)
        result = max(result, cur_max)
    return result
```

### 140. Longest Increasing Subsequence (Med.)

- **套路**：DP 或 二分搜尋優化
- **💡 白話文解說**：要找最長的一連串遞增數字，我們可以用一個神奇的「排隊法」。我們準備一個單調陣列來記錄每個長度的「最小墊底數字」。每次來一個新數字，如果它筆最後一個大就直接加進去；如果比較小，就把它換掉陣列裡第一個大於它的數字，幫未來創造更多機會。
- **思路**：維護一個 tails 陣列，tails[i] = 長度為 i+1 的遞增子序列的最小尾部。用二分搜尋找插入位置。
- **複雜度**：O(n·log n) / O(n)

```python
import bisect

def lengthOfLIS(nums):
    tails = []
    for num in nums:
        pos = bisect.bisect_left(tails, num)
        if pos == len(tails):
            tails.append(num)
        else:
            tails[pos] = num
    return len(tails)
```

### 110. Maximal Square (Med.)

- **套路**：二維 DP
- **💡 白話文解說**：想像你在鋪磁磚地板。一格磁磚能長出多大一塊正方形，完全取決於它的「左邊」、「上面」、「左上方」這三個鄰居能鋪出多大的正方形！只要大家都是完美的地板（不缺角），這塊能貢獻的正方形邊長就是大家最小加上自己。
- **思路**：dp[i][j] = 以 (i,j) 為右下角的最大正方形邊長 = min(上, 左, 左上) + 1。
- **複雜度**：O(m·n) / O(n)

```python
def maximalSquare(matrix):
    m, n = len(matrix), len(matrix[0])
    dp = [0] * (n + 1)
    max_side = 0
    for i in range(m):
        new_dp = [0] * (n + 1)
        for j in range(n):
            if matrix[i][j] == '1':
                new_dp[j+1] = min(dp[j], dp[j+1], new_dp[j]) + 1
                max_side = max(max_side, new_dp[j+1])
        dp = new_dp
    return max_side * max_side
```

### 146. Longest Increasing Path in a Matrix (Hard)

- **套路**：DFS + Memoization
- **💡 白話文解說**：如果我們在每一塊梯田都去算它能滑「多長的滑水道」，那會有太多重複動作！我們不如把每一格曾經算出來的最長坡度紀錄在一本大筆記上。下一次滑過這格時，直接打開筆記本偷抄答案，這就是記憶化搜尋 DFS。
- **思路**：對每個格子做 DFS，只往嚴格更大的相鄰格走。用 memo 記錄每格的最長路徑。
- **複雜度**：O(m·n) / O(m·n)

```python
def longestIncreasingPath(matrix):
    m, n = len(matrix), len(matrix[0])
    memo = {}
    def dfs(i, j):
        if (i, j) in memo:
            return memo[(i, j)]
        best = 1
        for di, dj in [(1,0),(-1,0),(0,1),(0,-1)]:
            ni, nj = i+di, j+dj
            if 0 <= ni < m and 0 <= nj < n and matrix[ni][nj] > matrix[i][j]:
                best = max(best, 1 + dfs(ni, nj))
        memo[(i, j)] = best
        return best
    return max(dfs(i, j) for i in range(m) for j in range(n))
```

### 152. Combination Sum IV (Med.)

- **套路**：完全背包（計數版）
- **💡 白話文解說**：跟湊零錢很像，但這次是「排列組合有順序之分」。湊出 4 的方法可以建立在「已經湊出 1，加上一個 3」，也可以是「湊出 3，加上 1」，這些方法數只要一路從小數字往上疊加，你就能看到最後有多少組合。
- **思路**：dp[i] = 湊到目標 i 的組合數。和 Coin Change 類似但求方案數。
- **複雜度**：O(target × n) / O(target)

```python
def combinationSum4(nums, target):
    dp = [0] * (target + 1)
    dp[0] = 1
    for i in range(1, target + 1):
        for num in nums:
            if num <= i:
                dp[i] += dp[i - num]
    return dp[target]
```

### 46. Maximum Profit in Job Scheduling (Hard)

- **套路**：DP + 二分搜尋
- **💡 白話文解說**：這是排行程表的至高挑戰。當你考慮這個工作該不該賺時，如果你接了，你就要把視線退回到「它開始之前，你做完的那個最無衝突的工作」那邊繼承它最好的利潤；如果不接，就沿用上一個歷史的最佳獲利。
- **思路**：按結束時間排序。dp[i] = 考慮前 i 個工作的最大利潤。每個工作選或不選：不選就繼承前一個，選就找最晚不衝突的工作 + 它的利潤。
- **複雜度**：O(n·log n) / O(n)

```python
import bisect

def jobScheduling(startTime, endTime, profit):
    jobs = sorted(zip(endTime, startTime, profit))
    ends = [j[0] for j in jobs]
    n = len(jobs)
    dp = [0] * (n + 1)
    for i in range(1, n + 1):
        end, start, p = jobs[i-1]
        j = bisect.bisect_right(ends, start, 0, i)  # 最晚不衝突
        dp[i] = max(dp[i-1], dp[j] + p)
    return dp[n]
```

### 25. Next Permutation (Med.)

- **套路**：數學觀察
- **💡 白話文解說**：要找下一個比較大的數字排列，就像你想要在現有數字基礎上稍微「進位」。我們從數字最右邊看，找到第一個「沒有按照大排到小的那個人（下降點）」，把它稍微換成右邊比它大一點點的替死鬼，然後把右邊那些排得老高的數字完全反轉成最小狀態，這就是你要的最輕微進位了！
- **思路**：從右找第一個下降點 i，在 i 右邊找剛好大於 nums[i] 的最小值交換，然後反轉 i 之後的部分。
- **複雜度**：O(n) / O(1)

```python
def nextPermutation(nums):
    n = len(nums)
    i = n - 2
    while i >= 0 and nums[i] >= nums[i+1]:
        i -= 1
    if i >= 0:
        j = n - 1
        while nums[j] <= nums[i]:
            j -= 1
        nums[i], nums[j] = nums[j], nums[i]
    nums[i+1:] = reversed(nums[i+1:])
```

### 38. Pow(x, n) (Med.)

- **套路**：快速冪（分治）
- **💡 白話文解說**：如果硬乘，要算兩的五十次方你得乘 50 次。那如果我們把 n 切一半呢？（2 的 25次方）算出來平方就是 50 次方啦！只要指數偶數我們就直接基底互質，這就是超神的快速平方降維法。
- **思路**：x^n = (x^(n/2))^2。偶數次方平方，奇數次方多乘一次。
- **複雜度**：O(log n) / O(log n)

```python
def myPow(x, n):
    if n < 0:
        x, n = 1/x, -n
    result = 1
    while n:
        if n % 2:
            result *= x
        x *= x
        n //= 2
    return result
```

---
