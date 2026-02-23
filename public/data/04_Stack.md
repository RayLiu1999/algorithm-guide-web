# 四、Stack（堆疊）

## 通用套路

**括號配對法**：遇到開括號 Push，遇到閉括號 Pop 檢查是否匹配。

**單調棧 (Monotonic Stack)**：維護一個遞增或遞減的棧。用於「找每個元素左/右邊第一個比它大/小的」。

**運算式求值**：用棧模擬運算子的優先順序與結合方向。

```python
# 套路模板：單調棧（找右邊第一個比自己大的）
def monotonic_stack_pattern(nums):
    result = [-1] * len(nums)
    stack = []  # 存索引
    for i in range(len(nums)):
        while stack and nums[i] > nums[stack[-1]]:
            idx = stack.pop()
            result[idx] = nums[i]  # nums[i] 就是 idx 右邊第一個比它大的
        stack.append(i)
    return result
```

---

### 15. Valid Parentheses (Easy)

- **套路**：括號配對法
- **思路**：遇到開括號推入對應的閉括號。遇到閉括號時，棧頂必須是對應的閉括號。最後棧必須為空。
- **💡 白話文解說**：就像是在玩俄羅斯娃娃，或者配對襪子。當你看到一個右括號時，它「必須」跟離它最近且還沒被配對的左括號是一對的。我們用堆疊把左括號一個個存起來，遇到右括號就從最上面拿一個左括號出來檢查配不配得起來。
- **複雜度**：O(n) / O(n)

```python
def isValid(s):
    stack = []
    mapping = {'(': ')', '[': ']', '{': '}'}
    for ch in s:
        if ch in mapping:
            stack.append(mapping[ch])  # Push 期望的閉括號
        elif not stack or stack.pop() != ch:
            return False
    return not stack
```

### 22. Min Stack (Med.)

- **套路**：雙棧（主棧 + 最小值棧）
- **思路**：每次 Push 時，同步在 min_stack 記錄當前最小值。Pop 時兩邊同步 Pop。
- **💡 白話文解說**：這是一個能「過目不忘」的堆疊。普通堆疊只能存取最後進去的東西，但這個堆疊在每個東西進去時，都會順便在旁邊記小筆記：「到目前為止最小的是誰」。這樣就算你把最小的拿走了，也能馬上從下一格的小筆記知道新的最小值是誰。
- **複雜度**：所有操作 O(1)

```python
class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []  # 追蹤對應位置的最小值

    def push(self, val):
        self.stack.append(val)
        self.min_stack.append(min(val, self.min_stack[-1] if self.min_stack else val))

    def pop(self):
        self.stack.pop()
        self.min_stack.pop()

    def top(self):
        return self.stack[-1]

    def getMin(self):
        return self.min_stack[-1]
```

### 65. Implement Queue using Stacks (Easy)

- **套路**：雙棧模擬佇列
- **思路**：用兩個棧。Push 都放入 stack_in。Pop/Peek 時如果 stack_out 空了，就把 stack_in 全部倒過去。
- **要點**：攤銷 (Amortized) O(1)。
- **複雜度**：O(1) 攤銷

```python
class MyQueue:
    def __init__(self):
        self.stack_in = []
        self.stack_out = []

    def push(self, x):
        self.stack_in.append(x)

    def pop(self):
        self._move()
        return self.stack_out.pop()

    def peek(self):
        self._move()
        return self.stack_out[-1]

    def empty(self):
        return not self.stack_in and not self.stack_out

    def _move(self):
        if not self.stack_out:
            while self.stack_in:
                self.stack_out.append(self.stack_in.pop())
```

### 17. Evaluate Reverse Polish Notation (Med.)

- **套路**：棧模擬運算
- **思路**：遇到數字推入棧，遇到運算子彈出兩個數字計算後推回結果。
- **💡 白話文解說**：你要刪除倒數第 N 個人。你可以派兩個探子，讓第一個探子先往前走 N 步。接著兩個探子一起以同樣的速度往下走。當第一個探子抵達終點時，第二個探子剛好就會停在「要被刪除的那個人」的前面一格！
- **要點**：Python 除法要注意負數截斷方向，用 `int(a/b)` 而非 `a//b`。
- **複雜度**：O(n) / O(n)

```python
def evalRPN(tokens):
    stack = []
    for t in tokens:
        if t in '+-*/':
            b, a = stack.pop(), stack.pop()
            if t == '+': stack.append(a + b)
            elif t == '-': stack.append(a - b)
            elif t == '*': stack.append(a * b)
            else: stack.append(int(a / b))  # 向零截斷
        else:
            stack.append(int(t))
    return stack[0]
```

### 116. Daily Temperatures (Med.)

- **套路**：單調遞減棧
- **思路**：棧維護「還沒找到更暖天氣的日子」的索引。新的一天如果比棧頂溫度高，棧頂那天的答案就是兩天的距離差。
- **複雜度**：O(n) / O(n)

```python
def dailyTemperatures(temperatures):
    n = len(temperatures)
    result = [0] * n
    stack = []  # 存索引，溫度遞減
    for i in range(n):
        while stack and temperatures[i] > temperatures[stack[-1]]:
            prev = stack.pop()
            result[prev] = i - prev
        stack.append(i)
    return result
```

### 55. Largest Rectangle in Histogram (Hard)

- **套路**：單調遞增棧
- **思路**：棧維護遞增的高度索引。當新柱子比棧頂矮時，棧頂的柱子可以確定右邊界，pop 後新的棧頂就是左邊界。
- **要點**：遍歷結束後，把棧內剩餘的逐一算完（右邊界=陣列末尾）。
- **複雜度**：O(n) / O(n)

```python
def largestRectangleArea(heights):
    stack = []  # 存索引，高度遞增
    max_area = 0
    heights.append(0)  # 哨兵，確保最後棧被清空
    for i in range(len(heights)):
        while stack and heights[i] < heights[stack[-1]]:
            h = heights[stack.pop()]
            w = i if not stack else i - stack[-1] - 1
            max_area = max(max_area, h * w)
        stack.append(i)
    return max_area
```

### 58. Basic Calculator (Hard)

- **套路**：棧保存外層狀態
- **思路**：遇到 `(` 時把當前結果和符號推入棧保存，遇到 `)` 時彈出恢復。
- **複雜度**：O(n) / O(n)

```python
def calculate(s):
    stack = []
    result = 0
    num = 0
    sign = 1
    for ch in s:
        if ch.isdigit():
            num = num * 10 + int(ch)
        elif ch in '+-':
            result += sign * num
            num = 0
            sign = 1 if ch == '+' else -1
        elif ch == '(':
            stack.append(result)
            stack.append(sign)
            result = 0
            sign = 1
        elif ch == ')':
            result += sign * num
            num = 0
            result *= stack.pop()   # 括號前的符號
            result += stack.pop()   # 括號前的累積結果
    return result + sign * num
```

### 115. Basic Calculator II (Med.)

- **套路**：棧 + 延遲計算
- **思路**：遇到 +/- 時把數字推入棧，遇到 \*/÷ 時立即和棧頂計算。最後棧內所有元素求和。
- **複雜度**：O(n) / O(n)

```python
def calculate(s):
    stack = []
    num = 0
    op = '+'  # 上一個運算子
    for i, ch in enumerate(s):
        if ch.isdigit():
            num = num * 10 + int(ch)
        if ch in '+-*/' or i == len(s) - 1:
            if op == '+': stack.append(num)
            elif op == '-': stack.append(-num)
            elif op == '*': stack.append(stack.pop() * num)
            elif op == '/': stack.append(int(stack.pop() / num))
            op = ch
            num = 0
    return sum(stack)
```

### 112. Asteroid Collision (Med.)

- **套路**：棧模擬碰撞
- **思路**：正值向右、負值向左。只有棧頂為正且新小行星為負時才會碰撞。碰撞時比較絕對值：大的存活、相等同歸於盡、小的被摧毀。
- **複雜度**：O(n) / O(n)

```python
def asteroidCollision(asteroids):
    stack = []
    for ast in asteroids:
        alive = True
        while alive and stack and ast < 0 < stack[-1]:
            if stack[-1] < -ast:
                stack.pop()       # 棧頂較小，被摧毀
            elif stack[-1] == -ast:
                stack.pop()       # 同歸於盡
                alive = False
            else:
                alive = False     # 新小行星較小，被摧毀
        if alive:
            stack.append(ast)
    return stack
```

### 156. Decode String (Med.)

- **套路**：棧保存外層上下文
- **思路**：遇到 `[` 把當前字串和數字推入棧，遇到 `]` 彈出後拼接，重複 k 次。
- **複雜度**：O(n) / O(n)

```python
def decodeString(s):
    stack = []
    current = ""
    num = 0
    for ch in s:
        if ch.isdigit():
            num = num * 10 + int(ch)
        elif ch == '[':
            stack.append((current, num))
            current = ""
            num = 0
        elif ch == ']':
            prev_str, repeat = stack.pop()
            current = prev_str + current * repeat
        else:
            current += ch
    return current
```

### 20. Generate Parentheses (Med.)

- **套路**：回溯法 (但概念上是 Stack 的合法序列生成)
- **思路**：追蹤左括號和右括號的剩餘數量。左括號可用就加左括號；右括號可用且數量 > 左括號剩餘數量時才加右括號。
- **💡 白話文解說**：你要寫出所有合法的括號組合。重點是：你隨時可以加左括號（只要沒超過配額），但「只有在目前剩下的左括號比右括號少時」（代表前面有落單的左括號），你才可以加右括號！
- **複雜度**：O(4^n / √n) / O(n)

```python
def generateParenthesis(n):
    result = []
    def backtrack(combo, open_count, close_count):
        if len(combo) == 2 * n:
            result.append(combo)
            return
        if open_count < n:
            backtrack(combo + '(', open_count + 1, close_count)
        if close_count < open_count:
            backtrack(combo + ')', open_count, close_count + 1)
    backtrack("", 0, 0)
    return result
```

### 26. Longest Valid Parentheses (Hard)

- **套路**：棧存索引
- **思路**：棧底放一個「上一個無法匹配的位置」作為基準。遇到 `(` 推入索引，遇到 `)` 彈出後計算長度。
- **複雜度**：O(n) / O(n)

```python
def longestValidParentheses(s):
    stack = [-1]  # 基準索引
    max_len = 0
    for i, ch in enumerate(s):
        if ch == '(':
            stack.append(i)
        else:
            stack.pop()
            if not stack:
                stack.append(i)  # 新的基準
            else:
                max_len = max(max_len, i - stack[-1])
    return max_len
```

### 162. Maximum Frequency Stack (Hard)

- **套路**：頻率分組棧
- **思路**：用 Hash Map 記錄每個值的頻率，用另一個 Hash Map（頻率 → 棧）按頻率分組。Push 時頻率+1，加到對應棧。Pop 時從最高頻率棧 Pop。
- **複雜度**：O(1) 每次操作

```python
from collections import defaultdict

class FreqStack:
    def __init__(self):
        self.freq = {}                    # 值 → 頻率
        self.group = defaultdict(list)    # 頻率 → 該頻率的值棧
        self.max_freq = 0

    def push(self, val):
        f = self.freq.get(val, 0) + 1
        self.freq[val] = f
        self.max_freq = max(self.max_freq, f)
        self.group[f].append(val)

    def pop(self):
        val = self.group[self.max_freq].pop()
        self.freq[val] -= 1
        if not self.group[self.max_freq]:
            self.max_freq -= 1
        return val
```

---
