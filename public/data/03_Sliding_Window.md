# 三、Sliding Window（滑動窗口）

## 題目目錄

- [3. Longest Substring Without Repeating Characters (Med.)](#3-longest-substring-without-repeating-characters-med)
- [438. Find All Anagrams in a String (Med.)](#438-find-all-anagrams-in-a-string-med)
- [76. Minimum Window Substring (Hard)](#76-minimum-window-substring-hard)
- [424. Longest Repeating Character Replacement (Med.)](#424-longest-repeating-character-replacement-med)
- [239. Sliding Window Maximum (Hard)](#239-sliding-window-maximum-hard)
- [632. Smallest Range Covering Elements from K Lists (Hard)](#632-smallest-range-covering-elements-from-k-lists-hard)

## 通用套路

**用途**：在連續子陣列或子字串中維護一段區間，邊擴張邊修正條件，常用來找最長合法區間、最短覆蓋區間、固定長度視窗統計。

**核心邏輯**：右指標負責擴大視窗，左指標負責在條件失效時縮小視窗；若題目是固定長度窗口，左指標則隨右指標同步往前。

```python
# 套路模板：可變長滑動窗口
def sliding_window_longest(s):
    left = 0
    window = {}
    best = 0

    for right, char in enumerate(s):
        window[char] = window.get(char, 0) + 1

        while not valid(window):
            left_char = s[left]
            window[left_char] -= 1
            if window[left_char] == 0:
                del window[left_char]
            left += 1

        best = max(best, right - left + 1)

    return best
```

---

### 3. Longest Substring Without Repeating Characters (Med.)

- **Problem (English)**:
  - Given a string, find the maximum length of a contiguous substring that contains no repeated characters.
- **題目（中文）**：
  - 給定一個字串，找出其中最長的連續子字串，使得子字串內每個字元都不重複。

- **Examples**:
  - Example 1: `s = "abcabcbb"`
    - Output: `3`
    - Explanation: The answer is "abc", with the length of 3. Note that "bca" and "cab" are also correct answers.
  - Example 2: `s = "bbbbb"`
    - Output: `1`
    - Explanation: The answer is "b", with the length of 1.
  - Example 3: `s = "pwwkew"`
    - Output: `3`
    - Explanation: The answer is "wke", with the length of 3.
Notice that the answer must be a substring, "pwke" is a subsequence and not a substring.
- **Constraints**:
  - `0 <= s.length <= 5 * 10^4`
  - s consists of English letters, digits, symbols and spaces.

- **套路**：滑動窗口 + 字典記錄最後出現索引
- **思路**：
  - 視窗維持「所有字元都不重複」，右指標每次把新字元納入窗口。
  - 若當前字元曾在窗口內出現過，`left` 不必一格一格移動，可以直接跳到該重複字元上次出現位置的下一格。
  - `left = max(left, last_index + 1)` 的關鍵在於避免 `left` 倒退，像 `"abba"` 這種案例若少了 `max` 就會出錯。
- **TC**：O(n)
  - 右指標線性掃過一次字串，左指標也只會單調右移，因此每個字元最多被處理常數次。
- **SC**：O(min(n, m))
  - 雜湊表只記錄可能出現在窗口中的不同字元數量，最多不超過字串長度 `n` 與字元集大小 `m` 的較小者。
- **其他思路**：
  - **普通滑動窗口（Set 版）**：當遇到重複字元時，左指標逐步移動並把字元移出集合，直到窗口重新合法。TC: O(n), SC: O(min(n, m))。
- **解法比較**：
  - **跳躍式窗口**：優點是常數因子通常更小，`left` 能一步到位。缺點是要理解 `max(left, ...)` 的邊界。
  - **Set 版窗口**：優點是模板更通用，容易延伸到其他窗口題。缺點是碰到重複時可能要多做數次刪除。
- **測試重點 (Testing)**：
  - **空字串**：`""`，應回傳 `0`。
  - **全重複**：`"aaaaa"`，應回傳 `1`。
  - **完全不重複**：`"abcdefg"`，應回傳 `7`。
  - **一般案例**：`"abcabcbb"`，應回傳 `3`。
  - **`left` 可能回跳的陷阱**：`"abba"`，應回傳 `2`。

```python
def lengthOfLongestSubstring(s):
    last_seen = {}
    left = 0
    best = 0

    for right, char in enumerate(s):
        if char in last_seen:
            left = max(left, last_seen[char] + 1)

        last_seen[char] = right
        best = max(best, right - left + 1)

    return best
```

### 438. Find All Anagrams in a String (Med.)

- **Problem (English)**:
  - You are given two strings `s` and `p`. Return all starting indices in `s` where the substring of length `len(p)` is an anagram of `p`.
  - You may return the answer in any order.
- **題目（中文）**：
  - 給定兩個字串 `s` 和 `p`，請找出 `s` 中所有起始位置，使得從該位置開始、長度為 `len(p)` 的子字串是 `p` 的異位字。
  - 答案順序不限。

- **Examples**:
  - Example 1: `s = "cbaebabacd", p = "abc"`
    - Output: `[0,6]`
    - Explanation: The substring with start index = 0 is "cba", which is an anagram of "abc".
The substring with start index = 6 is "bac", which is an anagram of "abc".
  - Example 2: `s = "abab", p = "ab"`
    - Output: `[0,1,2]`
    - Explanation: The substring with start index = 0 is "ab", which is an anagram of "ab".
The substring with start index = 1 is "ba", which is an anagram of "ab".
The substring with start index = 2 is "ab", which is an anagram of "ab".
- **Constraints**:
  - `1 <= s.length, p.length <= 3 * 10^4`
  - s and p consist of lowercase English letters.

- **套路**：固定長度滑動窗口 + 計數表
- **思路**：
  - 因為 anagram 的長度固定等於 `len(p)`，所以窗口大小也固定，不需要像最短覆蓋子串那樣反覆伸縮。
  - 先記錄 `p` 的需求次數，窗口右移時加入新字元；若窗口超過長度，就把左端字元移出。
  - 當窗口計數剛好與 `p` 的需求相同時，代表當前左端就是一個合法起點。
- **TC**：O(n)
  - 右指標掃過 `s` 一次，左指標也只會同步前進；若字元集固定，Counter 比較可視為常數成本。
- **SC**：O(1)
  - 若題目限定英文字母，計數表大小只與字元集有關，屬於常數空間。
- **其他思路**：
  - **26 長度陣列 + mismatch 計數**：用長度 26 的陣列記錄差異，並維護有幾個位置不相等。TC: O(n), SC: O(1)。
- **解法比較**：
  - **Counter 視窗**：優點是可讀性高，適合快速寫對。缺點是一般化到大字元集時常數較大。
  - **固定陣列**：優點是效能更穩定。缺點是只適合已知且小的字元集。
- **測試重點 (Testing)**：
  - **題目範例**：`s = "cbaebabacd", p = "abc"`，預期 `[0, 6]`。
  - **`p` 長於 `s`**：應回傳空陣列。
  - **重複字元需求**：`s = "baa", p = "aa"`，預期 `[1]`。
  - **全部都匹配**：`s = "abab", p = "ab"`，預期 `[0, 1, 2]`。

```python
from collections import Counter


def findAnagrams(s, p):
    need = Counter(p)
    window = Counter()
    result = []
    left = 0

    for right, char in enumerate(s):
        window[char] += 1

        if right - left + 1 > len(p):
            left_char = s[left]
            window[left_char] -= 1
            if window[left_char] == 0:
                del window[left_char]
            left += 1

        if window == need:
            result.append(left)

    return result
```

### 76. Minimum Window Substring (Hard)

- **Problem (English)**:
  - Given strings `s` and `t`, return the shortest contiguous substring of `s` that contains every character in `t`, including repeated occurrences.
  - If no such substring exists, return an empty string.
- **題目（中文）**：
  - 給定字串 `s` 和 `t`，找出 `s` 中最短的連續子字串，使其包含 `t` 中所有字元，而且重複字元次數也必須滿足。
  - 若不存在這樣的子字串，回傳空字串。

- **Examples**:
  - Example 1: `s = "ADOBECODEBANC", t = "ABC"`
    - Output: `"BANC"`
    - Explanation: The minimum window substring "BANC" includes 'A', 'B', and 'C' from string t.
  - Example 2: `s = "a", t = "a"`
    - Output: `"a"`
    - Explanation: The entire string s is the minimum window.
  - Example 3: `s = "a", t = "aa"`
    - Output: `""`
    - Explanation: Both 'a's from t must be included in the window.
Since the largest window of s only has one 'a', return empty string.
- **Constraints**:
  - `m == s.length`
  - `n == t.length`
  - `1 <= m, n <= 10^5`
  - s and t consist of uppercase and lowercase English letters.

- **套路**：可變長滑動窗口
- **思路**：
  - 先用 `need` 記錄 `t` 每個字元需要多少次，右指標負責擴張窗口，直到窗口已涵蓋所有需求。
  - 一旦 `formed == required`，表示窗口合法，此時就盡量縮左邊界，看看能不能保住合法性的前提下把答案變短。
  - 整題的核心是「擴張用來滿足條件，收縮用來最佳化答案」。
- **TC**：O(m + n)
  - `m = len(s)`、`n = len(t)`；左右指標都只會單調移動，因此整體最多各掃過一次。
- **SC**：O(m + n)
  - 需要 `need` 與 `window` 兩張表；若字元集不受限，最壞可與 `s`、`t` 中不同字元數相關。
- **其他思路**：
  - **暴力枚舉起點再往右擴**：對每個起點嘗試找到第一個合法視窗，取最短者。TC: O(m^2), SC: O(n)。
- **解法比較**：
  - **滑動窗口**：優點是線性時間，這題標準解。缺點是 `formed / required` 的維護需要小心。
  - **暴力法**：優點是好理解。缺點是字串稍長就會超時。
- **測試重點 (Testing)**：
  - **題目範例**：`s = "ADOBECODEBANC", t = "ABC"`，預期 `"BANC"`。
  - **`t` 不存在於 `s`**：應回傳空字串。
  - **`t` 有重複字元**：例如 `s = "AAABBC", t = "AABC"`，確認需求次數正確處理。
  - **最短答案就是整串**：例如 `s = "a", t = "a"`。

```python
from collections import Counter


def minWindow(s, t):
    need = Counter(t)
    window = {}
    required = len(need)
    formed = 0
    left = 0
    best = (float("inf"), 0, 0)

    for right, char in enumerate(s):
        window[char] = window.get(char, 0) + 1
        if char in need and window[char] == need[char]:
            formed += 1

        while formed == required:
            if right - left + 1 < best[0]:
                best = (right - left + 1, left, right)

            left_char = s[left]
            window[left_char] -= 1
            if left_char in need and window[left_char] < need[left_char]:
                formed -= 1
            left += 1

    if best[0] == float("inf"):
        return ""
    return s[best[1]:best[2] + 1]
```

### 424. Longest Repeating Character Replacement (Med.)

- **Problem (English)**:
  - You are given an uppercase string `s` and an integer `k`.
  - In one operation, you may change any character into another uppercase English letter.
  - Return the maximum length of a substring that can be turned into all the same letter using at most `k` changes.
- **題目（中文）**：
  - 給定一個只含大寫英文字母的字串 `s` 與整數 `k`。
  - 每次操作可以把任一字元改成另一個大寫字母。
  - 請回傳最多經過 `k` 次修改後，可以變成「全部都是同一字元」的最長連續子字串長度。

- **Examples**:
  - Example 1: `s = "ABAB", k = 2`
    - Output: `4`
    - Explanation: Replace the two 'A's with two 'B's or vice versa.
  - Example 2: `s = "AABABBA", k = 1`
    - Output: `4`
    - Explanation: Replace the one 'A' in the middle with 'B' and form "AABBBBA".
The substring "BBBB" has the longest repeating letters, which is 4.
There may exists other ways to achieve this answer too.
- **Constraints**:
  - `1 <= s.length <= 10^5`
  - s consists of only uppercase English letters.
  - `0 <= k <= s.length`

- **套路**：滑動窗口 + 視窗內最大頻率字元
- **思路**：
  - 如果窗口內最常出現的字元次數是 `max_freq`，那麼把整個窗口變成同一字元所需替換次數就是 `window_size - max_freq`。
  - 只要這個值不超過 `k`，窗口就合法；超過時就移動左指標縮小窗口。
  - `max_freq` 可以保留歷史最大值，不需要在縮窗時回頭重算，因為它只會讓窗口暫時看起來更寬鬆，但不會影響最終最大合法答案。
- **TC**：O(n)
  - 左右指標都只單調前進一次，每個字元進出窗口各至多一次。
- **SC**：O(1)
  - 若字元集固定為大寫英文字母，計數表大小是常數。
- **其他思路**：
  - **Binary Search 答案長度 + 檢查是否存在合法窗口**：對答案長度做二分，判斷是否有某個窗口需要替換不超過 `k` 次。TC: O(n log n), SC: O(1)。
- **解法比較**：
  - **滑動窗口**：優點是線性時間且是主流解。缺點是 `max_freq` 為何可以不回退要理解清楚。
  - **Binary Search**：優點是思路模組化。缺點是實作更長，效率也較差。
- **測試重點 (Testing)**：
  - **題目範例**：`s = "ABAB", k = 2`，預期 `4`。
  - **一般案例**：`s = "AABABBA", k = 1`，預期 `4`。
  - **`k = 0`**：等同找最長連續相同字元。
  - **`k` 很大**：若 `k >= len(s)`，答案應為整串長度。

```python
def characterReplacement(s, k):
    count = {}
    left = 0
    max_freq = 0
    best = 0

    for right, char in enumerate(s):
        count[char] = count.get(char, 0) + 1
        max_freq = max(max_freq, count[char])

        while right - left + 1 - max_freq > k:
            count[s[left]] -= 1
            left += 1

        best = max(best, right - left + 1)

    return best
```

### 239. Sliding Window Maximum (Hard)

- **Problem (English)**:
  - You are given an integer array `nums` and a window size `k`.
  - A window of length `k` slides from left to right by one position each time.
  - Return the maximum value inside the window at every position.
- **題目（中文）**：
  - 給定整數陣列 `nums` 與窗口大小 `k`。
  - 一個長度為 `k` 的滑動窗口會從左到右，每次往右移動一格。
  - 請回傳每個窗口位置中的最大值。

- **Examples**:
  - Example 1: `nums = [1,3,-1,-3,5,3,6,7], k = 3`
    - Output: `[3,3,5,5,6,7]`
    - Explanation: Window position                Max
---------------               -----
[1  3  -1] -3  5  3  6  7       3
1 [3  -1  -3] 5  3  6  7       3
1  3 [-1  -3  5] 3  6  7       5
1  3  -1 [-3  5  3] 6  7       5
1  3  -1  -3 [5  3  6] 7       6
1  3  -1  -3  5 [3  6  7]      7
  - Example 2: `nums = [1], k = 1`
    - Output: `[1]`
- **Constraints**:
  - `1 <= nums.length <= 10^5`
  - `-10^4 <= nums[i] <= 10^4`
  - `1 <= k <= nums.length`

- **套路**：單調遞減 deque
- **思路**：
  - deque 裡存的是索引，而且對應值保持遞減，這樣隊首永遠是目前窗口最大值的位置。
  - 新元素進來前，先把尾端所有比它小的索引移掉，因為那些元素之後不可能再成為最大值。
  - 同時還要把已經滑出窗口左邊界的索引從隊首移除。
- **TC**：O(n)
  - 每個索引最多進 deque 一次、出 deque 一次，因此總操作數為線性。
- **SC**：O(k)
  - deque 內最多只會保留當前窗口的索引數量。
- **其他思路**：
  - **Max Heap + Lazy Deletion**：用 heap 存 `(-value, index)`，隊首若過期就彈出。TC: O(n log k), SC: O(k)。
- **解法比較**：
  - **單調 deque**：優點是時間最佳。缺點是要熟悉單調結構的維護。
  - **Max Heap**：優點是和優先佇列題型一致。缺點是效率較慢，且要額外處理過期元素。
- **測試重點 (Testing)**：
  - **題目範例**：`nums = [1,3,-1,-3,5,3,6,7], k = 3`。
  - **`k = 1`**：答案應等於原陣列。
  - **`k = len(nums)`**：答案只有一個最大值。
  - **重複最大值與負數**：確認 deque 不會錯誤移除相等值。

```python
from collections import deque


def maxSlidingWindow(nums, k):
    queue = deque()
    result = []

    for index, num in enumerate(nums):
        while queue and queue[0] <= index - k:
            queue.popleft()

        while queue and nums[queue[-1]] <= num:
            queue.pop()

        queue.append(index)

        if index >= k - 1:
            result.append(nums[queue[0]])

    return result
```

### 632. Smallest Range Covering Elements from K Lists (Hard)

- **Problem (English)**:
  - You are given `k` sorted integer lists.
  - Find the smallest interval `[a, b]` such that at least one number from every list lies inside this interval.
  - A range is considered better if it is shorter, or if lengths tie, if its left endpoint is smaller.
- **題目（中文）**：
  - 給定 `k` 個已排序的整數列表。
  - 請找出最小區間 `[a, b]`，使得每個列表中至少有一個數字落在這個區間內。
  - 若兩個區間長度相同，則左端點較小者視為較佳答案。

- **Examples**:
  - Example 1: `nums = [[4,10,15,24,26],[0,9,12,20],[5,18,22,30]]`
    - Output: `[20,24]`
    - Explanation: List 1: [4, 10, 15, 24,26], 24 is in range [20,24].
List 2: [0, 9, 12, 20], 20 is in range [20,24].
List 3: [5, 18, 22, 30], 22 is in range [20,24].
  - Example 2: `nums = [[1,2,3],[1,2,3],[1,2,3]]`
    - Output: `[1,1]`
- **Constraints**:
  - `nums.length == k`
  - `1 <= k <= 3500`
  - `1 <= nums[i].length <= 50`
  - `-10^5 <= nums[i][j] <= 10^5`
  - nums[i] is sorted in non-decreasing order.

- **套路**：展平排序後做滑動窗口
- **思路**：
  - 先把所有數字展平成 `(value, list_id)`，並依照 `value` 排序。
  - 接著在這條排序後的序列上做滑動窗口，窗口的合法條件是至少包含每個 `list_id` 一次。
  - 一旦窗口已覆蓋所有列表，就試著收縮左邊界，更新更短的區間。
- **TC**：O(N log N)
  - `N` 是所有數字總數；主要成本來自展平後排序，滑動窗口本身是 O(N)。
- **SC**：O(N)
  - 展平後的陣列本身就需要 O(N) 空間，另外還有計數表。
- **其他思路**：
  - **K-way Merge + Min Heap**：每次從最小值所在列表推進下一個元素，同時維護當前最大值。TC: O(N log k), SC: O(k)。
- **解法比較**：
  - **展平排序 + 窗口**：優點是結構統一，容易和一般 sliding window 題目連結。缺點是要額外存整個展平陣列。
  - **Min Heap**：優點是在 `k` 遠小於 `N` 時通常更有效率。缺點是實作更偏向 merge / heap 類技巧。
- **測試重點 (Testing)**：
  - **題目範例**：確認標準答案區間正確。
  - **某列表只有一個元素**：該元素必然要被包含在答案中。
  - **不同列表含相同值**：例如多個列表都含 `5`，答案可能長度為 `0`。
  - **含負數範圍**：確認排序與更新區間不受正負影響。

```python
from collections import defaultdict


def smallestRange(nums):
    merged = []
    for group, row in enumerate(nums):
        for value in row:
            merged.append((value, group))
    merged.sort()

    count = defaultdict(int)
    covered = 0
    left = 0
    best = [-10**9, 10**9]

    for right, (value, group) in enumerate(merged):
        if count[group] == 0:
            covered += 1
        count[group] += 1

        while covered == len(nums):
            start = merged[left][0]
            if value - start < best[1] - best[0]:
                best = [start, value]

            left_group = merged[left][1]
            count[left_group] -= 1
            if count[left_group] == 0:
                covered -= 1
            left += 1

    return best
```