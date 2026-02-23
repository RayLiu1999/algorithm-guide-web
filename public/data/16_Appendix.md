# 附錄：其他零散題目

### 11. Roman to Integer (Easy)

- **套路**：查表 + 判斷前減規則
- **💡 白話文解說**：羅馬數字超級笨，如果右邊的數字比左邊還大，這代表前面那個東西是「負的」！所以你只要從左到右一個個算，看它比後面還小的話就直接把它從總分裡面扣掉（像是 IV, I扣掉變 -1, V是 5, 總和 4）。
- **複雜度**：O(n) / O(1)

```python
def romanToInt(s):
    values = {'I':1,'V':5,'X':10,'L':50,'C':100,'D':500,'M':1000}
    result = 0
    for i in range(len(s)):
        if i + 1 < len(s) and values[s[i]] < values[s[i+1]]:
            result -= values[s[i]]  # 前減規則
        else:
            result += values[s[i]]
    return result
```

### 12. Longest Common Prefix (Easy)

- **套路**：逐字元比較
- **💡 白話文解說**：一群單字一起拿來找相同的字首，不如我們直接拿第一個字當白老鼠！讓其他單字每個人來跟老鼠的一塊一塊肉比較，如果你這小塊肉不一樣的話，那你們就別吵了，你們的最長字首就只到你斷掉的那邊。
- **複雜度**：O(n·m) / O(1)

```python
def longestCommonPrefix(strs):
    if not strs:
        return ""
    for i in range(len(strs[0])):
        for s in strs[1:]:
            if i >= len(s) or s[i] != strs[0][i]:
                return strs[0][:i]
    return strs[0]
```

### 6. Reverse Integer (Med.)

- **套路**：數學逐位翻轉
- **💡 白話文解說**：要想辦法顛倒順序？這就是一直把個位數算出來，一邊拿出來湊成新數字（新版 = 新版*10 + 扒下的數字），要注意如果它最後大過極限就歸零放棄。
- **複雜度**：O(log n) / O(1)

```python
def reverse(x):
    sign = -1 if x < 0 else 1
    x = abs(x)
    result = 0
    while x:
        result = result * 10 + x % 10
        x //= 10
    result *= sign
    return result if -2**31 <= result <= 2**31 - 1 else 0
```

### 151. Backspace String Compare (Easy)

- **套路**：從後往前比較 + 計數跳過
- **💡 白話文解說**：這不是往前走，而是往後退的文字遊戲！從後往前讀，每看到一個 # 按鍵，你就先記錄「我欠一個刪除」。等你要讀字母的時候有欠債就先把字母殺掉抵銷，還能安全印出來的就是真實留下來的字母了。
- **複雜度**：O(n+m) / O(1)

```python
def backspaceCompare(s, t):
    def next_valid(s, i):
        skip = 0
        while i >= 0:
            if s[i] == '#':
                skip += 1
            elif skip > 0:
                skip -= 1
            else:
                break
            i -= 1
        return i
    i, j = len(s)-1, len(t)-1
    while i >= 0 or j >= 0:
        i, j = next_valid(s, i), next_valid(t, j)
        if i >= 0 and j >= 0 and s[i] != t[j]:
            return False
        if (i >= 0) != (j >= 0):
            return False
        i -= 1
        j -= 1
    return True
```

### 148. Palindrome Pairs (Hard)

- **套路**：Hash Map + 分割檢查
- **💡 白話文解說**：迴文的終極秘密！我們如果把它這單字顛倒過來看是不是出現在 Hash裡，那他們互補。但如果是字串的「這半邊本身就是個迴文了」，那只要它的「另一半顛倒」出現在字典裡，接在前面就是完美對稱了！
- **思路**：如果 word[i] 的反轉存在於字典中，拼接後可能是回文。另外檢查 word 的前綴/後綴本身是回文的情況。
- **複雜度**：O(n·k²) / O(n·k)

```python
def palindromePairs(words):
    word_map = {w: i for i, w in enumerate(words)}
    result = []
    for i, word in enumerate(words):
        for j in range(len(word) + 1):
            prefix, suffix = word[:j], word[j:]
            # 如果 prefix 是回文，反轉的 suffix 可以接在前面
            if prefix == prefix[::-1]:
                rev_suffix = suffix[::-1]
                if rev_suffix in word_map and word_map[rev_suffix] != i:
                    result.append([word_map[rev_suffix], i])
            # 如果 suffix 是回文，反轉的 prefix 可以接在後面
            if suffix and suffix == suffix[::-1]:
                rev_prefix = prefix[::-1]
                if rev_prefix in word_map and word_map[rev_prefix] != i:
                    result.append([i, word_map[rev_prefix]])
    return result
```
