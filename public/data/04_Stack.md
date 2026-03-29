# 四、Stack（堆疊）

## 題目目錄

- [20. Valid Parentheses (Easy)](#20-valid-parentheses-easy)
- [155. Min Stack (Med.)](#155-min-stack-med)
- [232. Implement Queue using Stacks (Easy)](#232-implement-queue-using-stacks-easy)
- [150. Evaluate Reverse Polish Notation (Med.)](#150-evaluate-reverse-polish-notation-med)
- [739. Daily Temperatures (Med.)](#739-daily-temperatures-med)
- [84. Largest Rectangle in Histogram (Hard)](#84-largest-rectangle-in-histogram-hard)
- [224. Basic Calculator (Hard)](#224-basic-calculator-hard)
- [227. Basic Calculator II (Med.)](#227-basic-calculator-ii-med)
- [735. Asteroid Collision (Med.)](#735-asteroid-collision-med)
- [394. Decode String (Med.)](#394-decode-string-med)
- [22. Generate Parentheses (Med.)](#22-generate-parentheses-med)
- [32. Longest Valid Parentheses (Hard)](#32-longest-valid-parentheses-hard)
- [895. Maximum Frequency Stack (Hard)](#895-maximum-frequency-stack-hard)

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

### 20. Valid Parentheses (Easy)

- **套路**：括號配對棧
- **思路**：
  - 開括號進棧，閉括號出棧檢查是否匹配。
  - 只要中途配對失敗或最後棧不為空，就不是合法括號字串。
- **TC**：O(n)
- **SC**：O(n)
- **其他思路**：
    - **反覆消去成對括號**：持續把字串中的 `()`、`[]`、`{}` 替換成空字串，直到不能再消。TC: O(n^2), SC: O(n)。
- **解法比較**：
    - **棧**：優點是線性時間，能直接處理巢狀與交錯括號。缺點是需要 O(n) 額外空間。
    - **反覆替換**：優點是觀念直觀。缺點是會重複掃描字串，效率差很多。
- **測試重點 (Testing)**：
  - `"()[]{}"`。
  - `"(]"`。
  - 空字串。

```python
def isValid(s):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for char in s:
        if char in pairs.values():
            stack.append(char)
        elif not stack or stack.pop() != pairs[char]:
            return False
    return not stack
```

### 155. Min Stack (Med.)

- **套路**：主棧 + 最小值棧
- **思路**：
  - 主棧照常存值，最小值棧同步記錄目前最小值。
  - `push` 時把 `min(val, min_stack[-1])` 推入最小值棧。
  - `pop` 時兩個棧一起彈出。
- **TC**：每個操作 O(1)
- **SC**：O(n)
- **其他思路**：
    - **單棧存 `(value, current_min)` tuple**：每個節點同時保存當下最小值。TC: 每個操作 O(1), SC: O(n)。
- **解法比較**：
    - **雙棧**：優點是職責清楚，主棧與最小值棧語意分離。缺點是會多維護一條平行棧。
    - **單棧 tuple**：優點是結構集中。缺點是每個元素都要存一份最小值資訊。
- **測試重點 (Testing)**：
  - 連續插入遞減值。
  - 彈出最小值後 `getMin` 是否正確回復。

```python
class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []

    def push(self, val):
        self.stack.append(val)
        if not self.min_stack:
            self.min_stack.append(val)
        else:
            self.min_stack.append(min(val, self.min_stack[-1]))

    def pop(self):
        self.stack.pop()
        self.min_stack.pop()

    def top(self):
        return self.stack[-1]

    def getMin(self):
        return self.min_stack[-1]
```

### 232. Implement Queue using Stacks (Easy)

- **套路**：兩個棧模擬 FIFO
- **思路**：
  - `in_stack` 專門負責 push，`out_stack` 專門負責 pop/peek。
  - 當 `out_stack` 為空時，把 `in_stack` 全部倒過去，順序就會反轉成佇列先進先出。
- **TC**：均攤 O(1)
- **SC**：O(n)
- **其他思路**：
    - **每次 `pop/peek` 都把 `in_stack` 全部倒去另一邊**：邏輯相同但不做 lazy transfer。單次最壞 O(n)，整體均攤仍較差。
- **解法比較**：
    - **Lazy 兩棧**：優點是只有在 `out_stack` 空時才搬運，均攤成本最低。缺點是需要理解 amortized analysis。
    - **每次都搬運**：優點是思路直接。缺點是常數與最壞時間都更差。
- **測試重點 (Testing)**：
  - 多次 `push` 後連續 `pop`。
  - `peek` 不能真的移除元素。

```python
class MyQueue:
    def __init__(self):
        self.in_stack = []
        self.out_stack = []

    def push(self, x):
        self.in_stack.append(x)

    def _move(self):
        if not self.out_stack:
            while self.in_stack:
                self.out_stack.append(self.in_stack.pop())

    def pop(self):
        self._move()
        return self.out_stack.pop()

    def peek(self):
        self._move()
        return self.out_stack[-1]

    def empty(self):
        return not self.in_stack and not self.out_stack
```

### 150. Evaluate Reverse Polish Notation (Med.)

- **套路**：運算元進棧，運算子立即結算
- **思路**：
  - 遇到數字就進棧。
  - 遇到運算子時，先彈出右操作數再彈出左操作數，計算後把結果壓回棧。
- **TC**：O(n)
- **SC**：O(n)
- **其他思路**：
    - **從尾端做遞迴解析**：把 token 視為後序表達式，遇到運算子時遞迴計算右子樹與左子樹。TC: O(n), SC: O(n)。
- **解法比較**：
    - **棧**：優點是最符合 RPN 定義，也最容易控制除法順序。缺點是要注意左右操作數彈出順序。
    - **遞迴解析**：優點是和 expression tree 對應自然。缺點是對大型輸入有遞迴堆疊成本。
- **測試重點 (Testing)**：
  - 包含負數與除法向零截斷的案例。

```python
def evalRPN(tokens):
    stack = []
    for token in tokens:
        if token in "+-*/":
            right = stack.pop()
            left = stack.pop()
            if token == "+":
                stack.append(left + right)
            elif token == "-":
                stack.append(left - right)
            elif token == "*":
                stack.append(left * right)
            else:
                stack.append(int(left / right))
        else:
            stack.append(int(token))
    return stack[-1]
```

### 739. Daily Temperatures (Med.)

- **套路**：單調遞減棧
- **思路**：
  - 棧內存還沒找到更高溫度的索引，且對應溫度保持遞減。
  - 新溫度更高時，就能替棧頂索引找到答案。
- **TC**：O(n)
- **SC**：O(n)
- **其他思路**：
    - **反向掃描 + 跳答案**：從右往左掃，若右邊溫度不夠高就利用已算出的等待天數往後跳。TC: 平均 O(n), SC: O(n)。
- **解法比較**：
    - **單調棧**：優點是模板經典，容易延伸到 next greater 類題目。缺點是要先建立索引棧觀念。
    - **反向跳躍**：優點是不用顯式棧。缺點是推理與除錯都不如單調棧直接。
- **測試重點 (Testing)**：
  - 題目範例與全遞減溫度。

```python
def dailyTemperatures(temperatures):
    result = [0] * len(temperatures)
    stack = []

    for i, temp in enumerate(temperatures):
        while stack and temp > temperatures[stack[-1]]:
            prev = stack.pop()
            result[prev] = i - prev
        stack.append(i)

    return result
```

### 84. Largest Rectangle in Histogram (Hard)

- **套路**：單調遞增棧找左右邊界
- **思路**：
  - 當前高度比棧頂低時，表示棧頂柱子的右邊界確定了，可以結算面積。
  - 被彈出的柱子高度固定，寬度由「當前索引」與「新的棧頂」決定。
- **TC**：O(n)
- **SC**：O(n)
- **其他思路**：
    - **預先求每根柱子左右第一個更矮的位置**：分別算 left smaller 與 right smaller，再一次性結算面積。TC: O(n), SC: O(n)。
    - **Divide and Conquer**：以最矮柱子切分左右區間遞迴求解。平均可行，但最壞會退化到 O(n^2)。
- **解法比較**：
    - **單趟單調棧**：優點是時間最穩、模板最常用。缺點是面積寬度公式一開始不直觀。
    - **左右邊界預處理**：優點是狀態拆得清楚。缺點是需要兩份額外陣列。
    - **分治**：優點是概念漂亮。缺點是最壞效能不佳。
- **測試重點 (Testing)**：
  - `[2,1,5,6,2,3]`，預期 `10`。
  - 全遞增高度。

```python
def largestRectangleArea(heights):
    stack = []
    best = 0

    for i, height in enumerate(heights + [0]):
        while stack and heights[stack[-1]] > height:
            h = heights[stack.pop()]
            left = stack[-1] if stack else -1
            best = max(best, h * (i - left - 1))
        stack.append(i)

    return best
```

### 224. Basic Calculator (Hard)

- **套路**：棧保存括號前狀態
- **思路**：
  - 逐字掃描，累積當前數字與符號。
  - 遇到 `(` 時，把目前 `result` 與 `sign` 推入棧，重新開始算括號內表達式。
  - 遇到 `)` 時，把括號內結果乘上之前的 `sign` 再加回外層 `result`。
- **TC**：O(n)
- **SC**：O(n)
- **其他思路**：
    - **遞迴下降 parser**：每遇到 `(` 就遞迴處理子表達式，返回括號內結果。TC: O(n), SC: O(n)。
- **解法比較**：
    - **棧保存外層狀態**：優點是實作相對直接，也不需要真正建 AST。缺點是要小心括號進出時的 `result` 與 `sign`。
    - **遞迴 parser**：優點是語法結構更清楚。缺點是遞迴深度與函式控制更複雜。
- **測試重點 (Testing)**：
  - 含巢狀括號與空白字元。

```python
def calculate(s):
    stack = []
    result = 0
    number = 0
    sign = 1

    for char in s:
        if char.isdigit():
            number = number * 10 + int(char)
        elif char in "+-":
            result += sign * number
            number = 0
            sign = 1 if char == "+" else -1
        elif char == "(":
            stack.append(result)
            stack.append(sign)
            result = 0
            sign = 1
        elif char == ")":
            result += sign * number
            number = 0
            result *= stack.pop()
            result += stack.pop()

    return result + sign * number
```

### 227. Basic Calculator II (Med.)

- **套路**：棧處理乘除、加減延後
- **思路**：
  - `+` 與 `-` 直接把數字正負號後壓棧。
  - `*`、`/` 需要立刻和棧頂結算，因為優先級較高。
  - 最後把棧中結果總和即可。
- **TC**：O(n)
- **SC**：O(n)
- **其他思路**：
    - **O(1) 額外空間累積法**：維護 `result` 與 `last_term`，把乘除立即合併到 `last_term`，加減時再把前一段併入答案。TC: O(n), SC: O(1)。
- **解法比較**：
    - **棧**：優點是最好理解，乘除優先級自然透過即時結算處理。缺點是多用一個棧。
    - **常數空間累積法**：優點是更省空間。缺點是狀態意義較抽象，容易把 `result` 與 `last_term` 搞混。
- **測試重點 (Testing)**：
  - `"3+2*2"`。
  - `" 3/2 "` 向零截斷。

```python
def calculate(s):
    stack = []
    number = 0
    operator = "+"

    for i, char in enumerate(s + "+"):
        if char.isdigit():
            number = number * 10 + int(char)
        elif char in "+-*/":
            if operator == "+":
                stack.append(number)
            elif operator == "-":
                stack.append(-number)
            elif operator == "*":
                stack.append(stack.pop() * number)
            else:
                stack.append(int(stack.pop() / number))
            number = 0
            operator = char

    return sum(stack)
```

### 735. Asteroid Collision (Med.)

- **套路**：棧模擬碰撞
- **思路**：
  - 只有「棧頂往右、當前小行星往左」時才可能碰撞。
  - 比較絕對值，小的爆掉；一樣大就一起消失。
- **TC**：O(n)
- **SC**：O(n)
- **其他思路**：
    - **反覆模擬整列碰撞直到穩定**：每輪掃描把會爆掉的小行星刪掉，再重跑一遍。最壞 TC: O(n^2), SC: O(n)。
- **解法比較**：
    - **棧模擬**：優點是每顆小行星最多進出棧一次，效率最佳。缺點是 while 迴圈中的三種分支要想清楚。
    - **反覆重掃**：優點是容易想到。缺點是會做大量重複模擬。
- **測試重點 (Testing)**：
  - `[5,10,-5]`。
  - `[8,-8]`。
  - 連續多次碰撞。

```python
def asteroidCollision(asteroids):
    stack = []
    for asteroid in asteroids:
        alive = True
        while alive and asteroid < 0 and stack and stack[-1] > 0:
            if stack[-1] < -asteroid:
                stack.pop()
            elif stack[-1] == -asteroid:
                stack.pop()
                alive = False
            else:
                alive = False
        if alive:
            stack.append(asteroid)
    return stack
```

### 394. Decode String (Med.)

- **套路**：棧保存重複次數與前綴字串
- **思路**：
  - 掃描時累積數字與目前字串。
  - 遇到 `[` 就把目前倍數與字串壓棧；遇到 `]` 就彈出並做 `prev + repeat * current`。
- **TC**：O(n)
- **SC**：O(n)
- **其他思路**：
    - **遞迴解析括號結構**：遇到 `[` 後遞迴解出子字串，回傳到對應的 `]` 為止。TC: O(n), SC: O(n)。
- **解法比較**：
    - **棧**：優點是對巢狀結構非常穩定，也方便處理多位數倍數。缺點是需要維護 `current` 與 `number` 兩種狀態。
    - **遞迴**：優點是和語法結構貼合。缺點是需要額外處理返回位置。
- **測試重點 (Testing)**：
  - `"3[a2[c]]"`。
  - 多位數重複次數如 `"10[a]"`。

```python
def decodeString(s):
    stack = []
    current = ""
    number = 0

    for char in s:
        if char.isdigit():
            number = number * 10 + int(char)
        elif char == "[":
            stack.append((current, number))
            current = ""
            number = 0
        elif char == "]":
            prev, repeat = stack.pop()
            current = prev + current * repeat
        else:
            current += char

    return current
```

### 22. Generate Parentheses (Med.)

- **套路**：遞迴生成 + 隱性棧平衡
- **思路**：
  - 左括號只要還沒用完就能放。
  - 右括號只有在 `close < open` 時才能放，確保前綴永遠合法。
- **TC**：O(Cn)
  - `Cn` 為第 n 個 Catalan Number。
- **SC**：O(n)
- **其他思路**：
    - **BFS 逐層生成**：從空字串開始，每次往下一層加入 `(` 或 `)`，只保留前綴合法狀態。TC: O(Cn), SC: O(Cn)。
    - **暴力生成全部 `2^(2n)` 字串再驗證**：可做但效率極差。
- **解法比較**：
    - **回溯**：優點是最自然，也最容易加剪枝。缺點是需要理解 `close < open` 為何代表前綴合法。
    - **BFS**：優點是狀態層次清楚。缺點是中間狀態數量通常更多。
    - **暴力法**：優點是最直覺。缺點是完全不實用。
- **測試重點 (Testing)**：
  - `n = 1`。
  - `n = 3` 應有 5 組結果。

```python
def generateParenthesis(n):
    result = []

    def backtrack(path, open_count, close_count):
        if len(path) == 2 * n:
            result.append("".join(path))
            return
        if open_count < n:
            path.append("(")
            backtrack(path, open_count + 1, close_count)
            path.pop()
        if close_count < open_count:
            path.append(")")
            backtrack(path, open_count, close_count + 1)
            path.pop()

    backtrack([], 0, 0)
    return result
```

### 32. Longest Valid Parentheses (Hard)

- **套路**：索引棧 + 最後失敗位置哨兵
- **思路**：
  - 棧先放 `-1` 當作基底，代表最近一個不合法位置。
  - 遇到 `(` 就推索引；遇到 `)` 就彈出。
  - 若彈完為空，表示新的不合法邊界出現，推入當前索引；否則可用 `i - stack[-1]` 更新長度。
- **TC**：O(n)
- **SC**：O(n)
- **其他思路**：
    - **DP**：令 `dp[i]` 表示以 `i` 結尾的最長合法括號長度，依前一段結果回推。TC: O(n), SC: O(n)。
    - **左右兩趟計數**：分別從左到右與右到左統計左右括號數量相等的最大長度。TC: O(n), SC: O(1)。
- **解法比較**：
    - **索引棧**：優點是邊界與區間長度都很好計。缺點是需要理解哨兵 `-1` 的作用。
    - **DP**：優點是狀態定義完整。缺點是轉移式較不好推。
    - **雙向計數**：優點是空間最省。缺點是只能求長度，直觀性不如棧法。
- **測試重點 (Testing)**：
  - `")()())"`，預期 `4`。
  - 全為左括號或全為右括號。

```python
def longestValidParentheses(s):
    stack = [-1]
    best = 0

    for i, char in enumerate(s):
        if char == "(":
            stack.append(i)
        else:
            stack.pop()
            if not stack:
                stack.append(i)
            else:
                best = max(best, i - stack[-1])

    return best
```

### 895. Maximum Frequency Stack (Hard)

- **套路**：頻率表 + 頻率對應的棧
- **思路**：
  - `freq[val]` 記錄每個值目前出現次數。
  - `group[f]` 存所有頻率為 `f` 的值，且用棧維持最近加入順序。
  - `pop` 時直接從 `max_freq` 對應的棧彈出。
- **TC**：每個操作 O(1)
- **SC**：O(n)
- **其他思路**：
    - **Max-Heap + 時間戳**：heap 內放 `(freq, timestamp, val)`，每次取最高頻且最近的元素。`push/pop` 都是 O(log n)。
- **解法比較**：
    - **頻率表 + group stack**：優點是 `push/pop` 都能做到 O(1)，是最適合這題的設計。缺點是需要同時維護兩張映射與 `max_freq`。
    - **Max-Heap**：優點是思路統一，和優先佇列設計題相近。缺點是時間複雜度較差。
- **測試重點 (Testing)**：
  - 相同頻率時要彈最近插入者。
  - 多次 `pop` 後 `max_freq` 是否正確下降。

```python
from collections import defaultdict


class FreqStack:
    def __init__(self):
        self.freq = defaultdict(int)
        self.group = defaultdict(list)
        self.max_freq = 0

    def push(self, val):
        self.freq[val] += 1
        freq = self.freq[val]
        self.max_freq = max(self.max_freq, freq)
        self.group[freq].append(val)

    def pop(self):
        val = self.group[self.max_freq].pop()
        self.freq[val] -= 1
        if not self.group[self.max_freq]:
            self.max_freq -= 1
        return val
```
