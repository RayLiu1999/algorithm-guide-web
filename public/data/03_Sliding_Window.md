# 三、Sliding Window（滑動窗口）

## 題目目錄

- [3. Longest Substring Without Repeating Characters (Med.)](#3-longest-substring-without-repeating-characters-med)
- [438. Find All Anagrams in a String (Med.)](#438-find-all-anagrams-in-a-string-med)
- [76. Minimum Window Substring (Hard)](#76-minimum-window-substring-hard)
- [424. Longest Repeating Character Replacement (Med.)](#424-longest-repeating-character-replacement-med)
- [239. Sliding Window Maximum (Hard)](#239-sliding-window-maximum-hard)
- [632. Smallest Range Covering Elements from K Lists (Hard)](#632-smallest-range-covering-elements-from-k-lists-hard)

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

### 3. Longest Substring Without Repeating Characters (Med.)

- **套路**：滑動窗口 + 字典記錄索引 (跳躍式)
- **思路**：當遇到重複字符時，left 指標直接跳躍到重複字符的下一個位置。
  - 注意：之所以要 max() 取 left，是因為例如 "abba"，當 right 指向最後一個 'a' 時，char_index_map['a'] 是 0。但此時 left 已經因為中間的 'bb' 移動到了 2。如果直接取 0 + 1，left 會往回跳到 1，導致窗口錯誤。使用 max(left, index + 1) 確保 left 具備單調遞增性。
- **TC**：O(n)
  - n 表示字串的長度，right 指標遍歷一次字串，每個字元僅被訪問與處理一次。
- **SC**：O(min(n, m))
  - n (長度限制)：Map 大小不可能超過字串總字數。
  - m (種類過濾)：Map 的 Key 具備唯一性，數量受限於「字元集大小」（如 小寫英文字母有 26 個，ASCII 的 128 種）。
  - 總結：之所以不是 O(n) 而是 O(min(n, m))，是因為就算 n 長度超長，但是 map 一樣是紀錄不重複內容，不會超過 m，因此取 min(n, m)。
- **其他思路**：
  - 普通滑動窗口（毛毛蟲式）：使用 set 記錄窗口內的字元，當遇到重複字元時，left 指標逐個右移縮小窗口，直到重複字元被移出。TC: O(n) (每個字元進出窗口各一次，總計 2n), SC: O(min(n, m))。
- **解法比較**：
  - 跳躍式滑動窗口：
    - 優點：常數時間更優，left 是一步到位而非逐格移動。
    - 缺點：邏輯較抽象，需處理 left 往回跳的邊界陷阱。
  - 普通滑動窗口：
    - 優點：代碼邏輯最通用（Caterpillar Template），易於擴展到其他滑動窗口題目。
    - 缺點：在極端情況下（如字串完全重複），left 需頻繁執行 remove 操作。
- **測試重點 (Testing)**：
  - **空字串**：傳入 `""` 應回傳 `0`。
  - **全重複字串**：傳入 `"aaaaa"` 應回傳 `1`。
  - **無重複字串**：傳入 `"abcdefg"` 應回傳 `7`。
  - **包含重複的字串**：傳入 `"abcabcbb"` 應回傳 `3`。
  - **包含重複且會導致 left 回跳的字串**：傳入 `"abba"` 應回傳 `2`。

```python
# 跳躍式滑動窗口
def lengthOfLongestSubstring(s: str) -> int:
    # 記錄字符最後出現的位置
    char_index_map = {}
    left = 0
    max_length = 0
    for right in range(len(s)):
        current_char = s[right]
        # 如果當前字符已經在窗口中出現過
        if current_char in char_index_map:
            # 移動 left 指標到重複字符的下一個位置
            # max() 確保 left 不會往回移動（處理 "abba" 這種情況）
            left = max(left, char_index_map[current_char] + 1)
        # 更新當前字符的位置
        char_index_map[current_char] = right
        # 更新最大長度
        max_length = max(max_length, right - left + 1)
    return max_length

# 普通滑動窗口
def lengthOfLongestSubstring(s: str) -> int:
    # 記錄窗口內的字符
    window = set()
    left = 0
    max_length = 0
    for right in range(len(s)):
        current_char = s[right]
        # 如果當前字符已經在窗口中出現過
        while current_char in window:
            # 移除左邊的字符
            window.remove(s[left])
            # 移動 left 指標
            left += 1
        # 將當前字符加入窗口
        window.add(current_char)
        # 更新最大長度
        max_length = max(max_length, right - left + 1)
    return max_length
```

---

### 438. Find All Anagrams in a String (Med.)

---

### 76. Minimum Window Substring (Hard)

---

### 424. Longest Repeating Character Replacement (Med.)

---

### 239. Sliding Window Maximum (Hard)

---

### 632. Smallest Range Covering Elements from K Lists (Hard)
