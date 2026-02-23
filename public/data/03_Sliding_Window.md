# 三、Sliding Window（滑動窗口）

## 通用套路

**用途**：在「連續子陣列/子字串」中找符合條件的最長或最短區間。

**核心邏輯**：維護一個窗口 [left, right]，right 不斷右移擴大窗口，當窗口不滿足條件時 left 右移縮小窗口。

```python
# 套路模板：最長子串/子陣列
def sliding_window_longest(s):
    left = 0
    window = {}  # 窗口內的狀態
    result = 0
    for right in range(len(s)):
        # 擴大窗口：加入 s[right]
        window[s[right]] = window.get(s[right], 0) + 1
        # 當窗口不滿足條件時，縮小窗口
        while not valid(window):
            window[s[left]] -= 1
            left += 1
        # 更新答案
        result = max(result, right - left + 1)
    return result
```

---

### 2. Longest Substring Without Repeating Characters (Med.)

- **套路**：滑動窗口 + Hash Set
- **思路**：窗口內不能有重複字元。右邊新字元若已在窗口中，左邊就持續縮小直到把重複的移除。
- **複雜度**：O(n) / O(min(n, 字元集大小))

```python
def lengthOfLongestSubstring(s):
    seen = set()
    left = 0
    result = 0
    for right in range(len(s)):
        while s[right] in seen:
            seen.remove(s[left])
            left += 1
        seen.add(s[right])
        result = max(result, right - left + 1)
    return result
```

### 39. Find All Anagrams in a String (Med.)

- **套路**：固定大小的滑動窗口 + Counter 比對
- **思路**：窗口大小固定為 p 的長度。滑動窗口每次右移一步，比較窗口內字母頻率是否等於 p 的頻率。
- **複雜度**：O(n) / O(1)

```python
from collections import Counter

def findAnagrams(s, p):
    if len(s) < len(p):
        return []
    p_count = Counter(p)
    window = Counter(s[:len(p)])
    result = []
    if window == p_count:
        result.append(0)
    for i in range(len(p), len(s)):
        window[s[i]] += 1                 # 右邊加入
        window[s[i - len(p)]] -= 1        # 左邊移除
        if window[s[i - len(p)]] == 0:
            del window[s[i - len(p)]]
        if window == p_count:
            result.append(i - len(p) + 1)
    return result
```

### 48. Minimum Window Substring (Hard)

- **套路**：滑動窗口（尋找最短）
- **💡 白話文解說**：要把圖片順時針旋轉 90 度，其實有一個數學小魔術：先把它「上下翻轉」（或者沿著對角線翻轉），然後再把每一行「左右翻轉」，結果就會剛好是旋轉 90 度的樣子！這樣就不用去算複雜的座標變換了。
- **思路**：右邊擴展直到窗口包含 t 的所有字元，然後左邊收縮找最小窗口。用兩個 Counter 比對 + `formed` 計數追蹤滿足條件的字元數量。
- **複雜度**：O(n+m) / O(n+m)

```python
from collections import Counter

def minWindow(s, t):
    if not t:
        return ""
    t_count = Counter(t)
    window = {}
    have, need = 0, len(t_count)  # need = 需要滿足的不同字元數
    result = ""
    min_len = float('inf')
    left = 0
    for right in range(len(s)):
        ch = s[right]
        window[ch] = window.get(ch, 0) + 1
        if ch in t_count and window[ch] == t_count[ch]:
            have += 1
        while have == need:  # 窗口已包含所有目標字元，嘗試收縮
            if right - left + 1 < min_len:
                min_len = right - left + 1
                result = s[left:right+1]
            window[s[left]] -= 1
            if s[left] in t_count and window[s[left]] < t_count[s[left]]:
                have -= 1
            left += 1
    return result
```

### 163. Longest Repeating Character Replacement (Med.)

- **套路**：滑動窗口 + 追蹤最高頻字元
- **思路**：窗口大小 - 最高頻字元數量 = 需要替換的字元數。如果需替換數 > k，就縮小窗口。
- **要點**：`max_freq` 不需要嚴格遞減（只會影響窗口不縮小，但不影響正確性）。
- **複雜度**：O(n) / O(1)

```python
def characterReplacement(s, k):
    count = {}
    left = 0
    max_freq = 0
    result = 0
    for right in range(len(s)):
        count[s[right]] = count.get(s[right], 0) + 1
        max_freq = max(max_freq, count[s[right]])
        # 窗口大小 - 最高頻 > k：需要替換的太多了
        if (right - left + 1) - max_freq > k:
            count[s[left]] -= 1
            left += 1
        result = max(result, right - left + 1)
    return result
```

### 123. Sliding Window Maximum (Hard)

- **套路**：單調遞減佇列 (Monotonic Deque)
- **思路**：維護一個遞減的 deque。新元素來時，把 deque 尾部所有比它小的都移除（它們不可能再成為最大值）。deque 頭部就是窗口最大值。窗口滑動時，超出範圍的頭部元素移除。
- **複雜度**：O(n) / O(k)

```python
from collections import deque

def maxSlidingWindow(nums, k):
    dq = deque()  # 存索引，對應的值保持遞減
    result = []
    for i in range(len(nums)):
        # 移除超出窗口的頭部
        while dq and dq[0] < i - k + 1:
            dq.popleft()
        # 移除尾部所有比當前值小的
        while dq and nums[dq[-1]] < nums[i]:
            dq.pop()
        dq.append(i)
        if i >= k - 1:
            result.append(nums[dq[0]])
    return result
```

### 72. Smallest Range Covering Elements from K Lists (Hard)

- **套路**：滑動窗口 + 排序
- **思路**：把所有元素帶上「來自哪個 list」的標記，全部排序。滑動窗口找包含所有 K 個 list 的最短範圍。
- **複雜度**：O(n·log n) / O(n)

```python
def smallestRange(nums):
    tagged = []
    for i, lst in enumerate(nums):
        for val in lst:
            tagged.append((val, i))
    tagged.sort()

    k = len(nums)
    count = {}         # list_id → 在窗口中的出現次數
    have = 0           # 覆蓋了幾個 list
    left = 0
    best = [-10**5, 10**5]

    for right in range(len(tagged)):
        val, group = tagged[right]
        count[group] = count.get(group, 0) + 1
        if count[group] == 1:
            have += 1
        while have == k:
            l_val, l_group = tagged[left]
            if tagged[right][0] - l_val < best[1] - best[0]:
                best = [l_val, tagged[right][0]]
            count[l_group] -= 1
            if count[l_group] == 0:
                have -= 1
            left += 1
    return best
```

---
