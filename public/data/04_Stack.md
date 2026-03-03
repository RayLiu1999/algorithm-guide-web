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

---

### 155. Min Stack (Med.)

---

### 232. Implement Queue using Stacks (Easy)

---

### 150. Evaluate Reverse Polish Notation (Med.)

---

### 739. Daily Temperatures (Med.)

---

### 84. Largest Rectangle in Histogram (Hard)

---

### 224. Basic Calculator (Hard)

---

### 227. Basic Calculator II (Med.)

---

### 735. Asteroid Collision (Med.)

---

### 394. Decode String (Med.)

---

### 22. Generate Parentheses (Med.)

---

### 32. Longest Valid Parentheses (Hard)

---

### 895. Maximum Frequency Stack (Hard)
