# 十四、Bit Manipulation（位元運算）

## 通用套路

**XOR 特性**：a^a=0, a^0=a。用於找唯一元素。

**n & (n-1)**：消除最低位的 1。用於計算 1 的個數。

**右移逐位處理**：`n >>= 1` 每次處理最低位。

---

### 42. Add Binary (Easy)

- **套路**：逐位加法 + 進位
- **💡 白話文解說**：就像直式加法，你就是從最後面看兩個數。每次相加就只有那三個結果，滿 2 你就「進位給下一輪」，餘下留在陣列裡，只要最後全部吐回來排好字元即可。
- **複雜度**：O(max(m,n)) / O(1)

```python
def addBinary(a, b):
    result = []
    carry = 0
    i, j = len(a)-1, len(b)-1
    while i >= 0 or j >= 0 or carry:
        total = carry
        if i >= 0: total += int(a[i]); i -= 1
        if j >= 0: total += int(b[j]); j -= 1
        result.append(str(total % 2))
        carry = total // 2
    return ''.join(reversed(result))
```

### 129. Missing Number (Easy)

- **套路**：XOR 或 數學公式
- **💡 白話文解說**：這就像「找出班上哪裡少一個人」，最快的算法是：我們其實本來就知道 0 到 n 全加起來總共該是多少對吧？我們只要把現有名單上所有數字偷加起來，然後拿總和一減，少掉的體重就是那個翹課逃漏的人！
- **思路**：0~n 的 XOR 和和陣列的 XOR 互相抵消，剩下的就是缺失的。
- **複雜度**：O(n) / O(1)

```python
def missingNumber(nums):
    n = len(nums)
    return n * (n + 1) // 2 - sum(nums)
```

### 97. Number of 1 Bits (Easy)

- **套路**：n & (n-1) 消除最低位的 1
- **💡 白話文解說**：這是一招極度聰明的把戲。你知道把一個數字減一後再自己跟自己「AND 運算」，最右邊的 1 就會被神奇的吃掉變成 0！你反覆吃幾次這個數字才會歸零，就代表它身上背了幾個 1 啦。
- **複雜度**：O(k) / O(1)，k = 1 的個數

```python
def hammingWeight(n):
    count = 0
    while n:
        n &= n - 1
        count += 1
    return count
```

### 96. Reverse Bits (Easy)

- **套路**：逐位翻轉
- **💡 白話文解說**：反轉二進位就是把前面位元推出去，最後面收進來。每次我們把「原來數字」最右邊那一位扒下來保留，然後直接塞進「全新結果數字」的屁股面，反覆扒皮 32 次把肉移過去，就顛倒完成了。
- **複雜度**：O(32) / O(1)

```python
def reverseBits(n):
    result = 0
    for _ in range(32):
        result = (result << 1) | (n & 1)
        n >>= 1
    return result
```

### 149. Counting Bits (Easy)

- **套路**：DP + 位元技巧
- **💡 白話文解說**：你有沒有發覺，偶數的身上有多少個 1 這件事，其實跟它除以二的數（砍掉末位）長得一模一樣！奇數也很單純，它也只不過是除了 2 之後加上被砍掉的那最後的一個 1 而已，用 DP 超級快就能填出來所有的表格。
- **思路**：dp[i] = dp[i >> 1] + (i & 1)。右移一位代表去掉最低位，再加上最低位本身。
- **複雜度**：O(n) / O(n)

```python
def countBits(n):
    dp = [0] * (n + 1)
    for i in range(1, n + 1):
        dp[i] = dp[i >> 1] + (i & 1)
    return dp
```

---
