# 附錄：其他零散題目

## 題目目錄

- [13. Roman to Integer (Easy)](#13-roman-to-integer-easy)
- [14. Longest Common Prefix (Easy)](#14-longest-common-prefix-easy)
- [7. Reverse Integer (Med.)](#7-reverse-integer-med)
- [844. Backspace String Compare (Easy)](#844-backspace-string-compare-easy)
- [336. Palindrome Pairs (Hard)](#336-palindrome-pairs-hard)

---

### 13. Roman to Integer (Easy)

- **Problem (English)**:
        - Given a Roman numeral string, convert it to the corresponding integer.
        - Roman numerals follow the usual subtraction rule, such as `IV = 4` and `IX = 9`.
- **題目（中文）**：
        - 給定一個羅馬數字字串，請把它轉換成對應的整數。
        - 羅馬數字遵循一般前減規則，例如 `IV = 4`、`IX = 9`。

- **Examples**:
  - Example 1: `s = "III"`
    - Output: `3`
    - Explanation: III = 3.
  - Example 2: `s = "LVIII"`
    - Output: `58`
    - Explanation: L = 50, V= 5, III = 3.
  - Example 3: `s = "MCMXCIV"`
    - Output: `1994`
    - Explanation: M = 1000, CM = 900, XC = 90 and IV = 4.
- **Constraints**:
  - `1 <= s.length <= 15`
  - s contains only the characters ('I', 'V', 'X', 'L', 'C', 'D', 'M').
  - It is guaranteed that s is a valid roman numeral in the range [1, 3999].

- **套路**：查表 + 前減規則
- **思路**：
        - 從左到右掃描字串，平常直接把羅馬字元轉成數值累加。
        - 若當前字元值小於下一個字元值，代表它屬於前減表示法，例如 `IV` 中的 `I`，此時應改成扣掉。
        - 每個字元最多只看一次，因此能在線性時間完成。
- **TC**：O(n)
        - 字串中的每個字元只會被掃描一次，查表與比較都是 O(1)。
- **SC**：O(1)
        - 羅馬字元對應表大小固定，只使用常數額外空間。
- **其他思路**：
        - **從右往左掃描**：若目前值小於前一個已看過的值就做扣法，否則加法。TC: O(n), SC: O(1)。
        - **模式優先替換法**：先特判 `IV`、`IX` 這類雙字元組合，再處理單字元。可做但較繁瑣。
- **解法比較**：
        - **左到右比較下一位**：優點是直覺，最符合題意。缺點是需要小心最後一位邊界。
        - **右到左掃描**：優點是不需要看下一位。缺點是思維不如左到右自然。
- **測試重點 (Testing)**：
        - **純加法**：`"III"`，預期 `3`。
        - **單一前減規則**：`"IV"`，預期 `4`。
        - **多段混合**：`"MCMXCIV"`，預期 `1994`。
        - **最大常見字元組合**：確認查表與累加邏輯穩定。

```python
def romanToInt(s):
                values = {"I": 1, "V": 5, "X": 10, "L": 50, "C": 100, "D": 500, "M": 1000}
                total = 0
                for i in range(len(s)):
                                if i + 1 < len(s) and values[s[i]] < values[s[i + 1]]:
                                                total -= values[s[i]]
                                else:
                                                total += values[s[i]]
                return total
```

### 14. Longest Common Prefix (Easy)

- **Problem (English)**:
        - Given an array of strings, return the longest prefix shared by every string.
        - If no common prefix exists, return an empty string.
- **題目（中文）**：
        - 給定一個字串陣列，請回傳所有字串共同擁有的最長前綴。
        - 若不存在共同前綴，回傳空字串。

- **Examples**:
  - Example 1: `strs = ["flower","flow","flight"]`
    - Output: `"fl"`
  - Example 2: `strs = ["dog","racecar","car"]`
    - Output: `""`
    - Explanation: There is no common prefix among the input strings.
- **Constraints**:
  - `1 <= strs.length <= 200`
  - `0 <= strs[i].length <= 200`
  - strs[i] consists of only lowercase English letters if it is non-empty.

- **套路**：逐欄比較字元
- **思路**：
        - 以第一個字串作為基準，逐欄檢查其他字串在同一位置的字元是否一致。
        - 一旦某個字串長度不夠，或對應字元不同，就可立即停止。
        - 在停止位置之前的前綴，就是所有字串共同擁有的最長前綴。
- **TC**：O(n * m)
        - `n` 是字串數量，`m` 是最短字串長度；最壞情況下每一欄都要和所有字串比較。
- **SC**：O(1)
        - 只用索引與臨時變數，不需要額外容器。
- **其他思路**：
        - **排序後比首尾**：把字串排序後，只要比較字典序最小與最大的兩個字串。TC: O(n log n + m), SC: O(1) 或 O(log n)。
        - **分治法**：把字串陣列拆半，各自求最長前綴再合併。概念不錯，但對這題屬於過度設計。
- **解法比較**：
        - **逐欄比較**：優點是最好理解，也最容易手寫。缺點是在字串很多時，常數較大。
        - **排序法**：優點是寫法短。缺點是多了排序成本。
- **測試重點 (Testing)**：
        - **標準案例**：`["flower","flow","flight"]`，預期 `"fl"`。
        - **完全沒有共同前綴**：`["dog","racecar","car"]`，預期 `""`。
        - **只有一個字串**：應直接回傳自身。
        - **存在空字串**：結果必為空字串。

```python
def longestCommonPrefix(strs):
                if not strs:
                                return ""

                for i, char in enumerate(strs[0]):
                                for word in strs[1:]:
                                                if i >= len(word) or word[i] != char:
                                                                return strs[0][:i]

                return strs[0]
```

### 7. Reverse Integer (Med.)

- **Problem (English)**:
        - Given a signed 32-bit integer `x`, reverse its digits.
        - If the reversed value falls outside the signed 32-bit range, return `0`.
        - Assume you cannot use 64-bit integers.
- **題目（中文）**：
        - 給定一個 32 位有號整數 `x`，請將它的數字位數反轉。
        - 如果反轉後超出 32 位有號整數範圍，回傳 `0`。
        - 假設你不能使用 64 位整數。

- **Examples**:
  - Example 1: `x = 123`
    - Output: `321`
  - Example 2: `x = -123`
    - Output: `-321`
  - Example 3: `x = 120`
    - Output: `21`
- **Constraints**:
  - `-2^31 <= x <= 2^31 - 1`

- **套路**：數學逐位反轉
- **思路**：
        - 先分離正負號，接著不斷取出尾數 `x % 10` 加到新數字末端。
        - 每一輪將原數字整除 10，直到所有位數都被處理完。
        - 最後檢查是否超出 32 位有號整數範圍，若超界則回傳 0。
- **TC**：O(log n)
        - 數字有幾位就迭代幾次，因此和位數成正比。
- **SC**：O(1)
        - 僅使用固定數量變數保存結果與符號。
- **其他思路**：
        - **字串反轉**：先轉字串再反轉。實作短，但失去題目對數學操作與溢位處理的考點。
        - **邊做邊溢位判斷**：在每次乘 10 前就檢查是否將超界，比最後再判斷更嚴謹。
- **解法比較**：
        - **數學解**：優點是最貼近題目本質，也最能展示邊界掌握。缺點是需要小心負數與溢位。
        - **字串解**：優點是容易寫。缺點是面試價值較低。
- **測試重點 (Testing)**：
        - **正數**：`123`，預期 `321`。
        - **負數**：`-123`，預期 `-321`。
        - **尾數是 0**：`120`，預期 `21`。
        - **溢位**：`1534236469`，預期 `0`。
        - **輸入為 0**：應回傳 `0`。

```python
def reverse(x):
                sign = -1 if x < 0 else 1
                x = abs(x)
                result = 0

                while x:
                                result = result * 10 + x % 10
                                x //= 10

                result *= sign
                return result if -(2 ** 31) <= result <= 2 ** 31 - 1 else 0
```

### 844. Backspace String Compare (Easy)

- **Problem (English)**:
        - Given two strings `s` and `t` containing lowercase letters and `#`, compare them after applying all backspace operations.
        - A `#` removes the character immediately to its left if one exists.
- **題目（中文）**：
        - 給定兩個字串 `s` 與 `t`，其中包含小寫字母與 `#`。
        - 請在套用所有退格操作後，比較兩個字串是否相同。
        - `#` 會刪掉它左邊最近的一個字元（若存在）。

- **Examples**:
  - Example 1: `s = "ab#c", t = "ad#c"`
    - Output: `true`
    - Explanation: Both s and t become "ac".
  - Example 2: `s = "ab##", t = "c#d#"`
    - Output: `true`
    - Explanation: Both s and t become "".
  - Example 3: `s = "a#c", t = "b"`
    - Output: `false`
    - Explanation: s becomes "c" while t becomes "b".
- **Constraints**:
  - `1 <= s.length, t.length <= 200`
  - s and t only contain lowercase letters and '#' characters.

- **套路**：從右往左跳過被刪除字元
- **思路**：
        - 退格只會影響它左邊的字元，因此從尾端往前掃最自然。
        - 每次遇到 `#` 就累積一個 `skip`，之後遇到普通字元時先用它抵消刪除額度。
        - 兩個字串都各自找到下一個有效字元後再比較即可。
- **TC**：O(n + m)
        - 兩字串的每個字元最多只會被掃描一次。
- **SC**：O(1)
        - 只使用常數個指標與計數器，不需要額外 stack。
- **其他思路**：
        - **Stack 模擬**：把每個字串實際打字後剩下的內容算出來再比較。TC: O(n + m), SC: O(n + m)。
        - **直接重建字串**：本質與 stack 類似，但空間一樣較大。
- **解法比較**：
        - **反向雙指標**：優點是最省空間。缺點是指標邏輯稍微繞。
        - **Stack**：優點是最直觀。缺點是需要額外記憶體。
- **測試重點 (Testing)**：
        - **基本相等**：`s = "ab#c", t = "ad#c"`，預期 `True`。
        - **基本不相等**：`s = "a#c", t = "b"`，預期 `False`。
        - **連續多個退格**：確保 `skip` 累積正確。
        - **退格刪到空字串**：如 `"####"`。
        - **長度不同但最後結果相同**：驗證邊界判斷。

```python
def backspaceCompare(s, t):
                def next_valid_index(text, index):
                                skip = 0
                                while index >= 0:
                                                if text[index] == "#":
                                                                skip += 1
                                                elif skip:
                                                                skip -= 1
                                                else:
                                                                break
                                                index -= 1
                                return index

                i, j = len(s) - 1, len(t) - 1
                while i >= 0 or j >= 0:
                                i = next_valid_index(s, i)
                                j = next_valid_index(t, j)
                                if i >= 0 and j >= 0 and s[i] != t[j]:
                                                return False
                                if (i >= 0) != (j >= 0):
                                                return False
                                i -= 1
                                j -= 1
                return True
```

### 336. Palindrome Pairs (Hard)

- **Problem (English)**:
        - Given an array of unique strings, return all index pairs `[i, j]` such that `words[i] + words[j]` forms a palindrome.
- **題目（中文）**：
        - 給定一個由不重複字串組成的陣列，請回傳所有索引對 `[i, j]`，使得 `words[i] + words[j]` 形成回文。

- **Examples**:
  - Example 1: `words = ["abcd","dcba","lls","s","sssll"]`
    - Output: `[[0,1],[1,0],[3,2],[2,4]]`
    - Explanation: The palindromes are ["abcddcba","dcbaabcd","slls","llssssll"]
  - Example 2: `words = ["bat","tab","cat"]`
    - Output: `[[0,1],[1,0]]`
    - Explanation: The palindromes are ["battab","tabbat"]
  - Example 3: `words = ["a",""]`
    - Output: `[[0,1],[1,0]]`
    - Explanation: The palindromes are ["a","a"]
- **Constraints**:
  - `1 <= words.length <= 5000`
  - `0 <= words[i].length <= 300`
  - words[i] consists of lowercase English letters.

- **套路**：Hash Map + 拆分前後綴
- **思路**：
        - 建立 `word -> index` 對照表，讓我們能 O(1) 查找某段反轉字串是否存在。
        - 對每個字串枚舉所有切點，把字串拆成 `prefix` 與 `suffix`。
        - 若 `prefix` 本身是回文，則只要 `reverse(suffix)` 存在，就能接在前面形成回文；反之，若 `suffix` 是回文，則 `reverse(prefix)` 能接在後面。
- **TC**：O(n * k^2)
        - `n` 是單字數，`k` 是平均單字長度；每個字要枚舉 O(k) 個切點，每次又要做 O(k) 的回文判斷與字串處理。
- **SC**：O(n * k)
        - 主要來自字典保存所有單字，以及反轉與切片產生的輔助空間。
- **其他思路**：
        - **Trie 反向建字**：可把所有反轉字串放進 Trie，再配合回文前綴/後綴資訊搜尋，效率更進階但實作複雜。
        - **暴力兩兩拼接**：檢查每一對單字是否形成回文。TC: O(n^2 * k), SC: O(1) 或 O(k)。
- **解法比較**：
        - **Hash Map + 拆分**：優點是最常見、實作相對可控。缺點是切片與回文判斷常數不小。
        - **Trie**：優點是更進階，也較有設計感。缺點是面試時很容易寫錯。
        - **暴力法**：優點是容易想到。缺點是效率差，輸入大時不可行。
- **測試重點 (Testing)**：
        - **標準案例**：`["abcd","dcba","lls","s","sssll"]`。
        - **含空字串**：空字串可與任意回文字串配對。
        - **單字本身為回文**：檢查和空字串或其他補全配對情況。
        - **避免自己配自己**：同一 index 不能和自己形成答案。
        - **重複結構但不同 index**：確認索引而非內容才是最終輸出依據。

```python
def palindromePairs(words):
                word_to_index = {word: i for i, word in enumerate(words)}
                result = []

                def is_palindrome(text):
                                return text == text[::-1]

                for i, word in enumerate(words):
                                for cut in range(len(word) + 1):
                                                prefix = word[:cut]
                                                suffix = word[cut:]

                                                if is_palindrome(prefix):
                                                                candidate = suffix[::-1]
                                                                if candidate in word_to_index and word_to_index[candidate] != i:
                                                                                result.append([word_to_index[candidate], i])

                                                if suffix and is_palindrome(suffix):
                                                                candidate = prefix[::-1]
                                                                if candidate in word_to_index and word_to_index[candidate] != i:
                                                                                result.append([i, word_to_index[candidate]])

                return result
```
