# 二、Two Pointers（雙指標）

## 通用套路

**對撞指標**：排序後的陣列，左右各一個指標向中間移動。常用於「找配對」或「面積最大化」。

**快慢指標**：一個走快一個走慢，用於「移除元素」、「找中點」、「判斷環」。

```python
# 套路模板：對撞指標
def two_pointer_pattern(nums, target):
    left, right = 0, len(nums) - 1
    while left < right:
        total = nums[left] + nums[right]
        if total == target:
            return [left, right]
        elif total < target:
            left += 1     # 太小，左指標右移
        else:
            right -= 1    # 太大，右指標左移
```

---

### 74. Valid Palindrome (Easy)

- **套路**：對撞指標
- **思路**：左右各一個指標，跳過非字母數字字元，比較兩端字元是否相同。
- **複雜度**：O(n) / O(1)

```python
def isPalindrome(s):
    left, right = 0, len(s) - 1
    while left < right:
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
        if s[left].lower() != s[right].lower():
            return False
        left += 1
        right -= 1
    return True
```

### 7. Container With Most Water (Med.)

- **套路**：對撞指標 + 貪心
- **思路**：左右指標計算面積，每次移動較矮的那一邊（因為移動較高的不可能讓面積變大）。
- **要點**：面積 = min(height[left], height[right]) × (right - left)
- **複雜度**：O(n) / O(1)

```python
def maxArea(height):
    left, right = 0, len(height) - 1
    max_water = 0
    while left < right:
        water = min(height[left], height[right]) * (right - left)
        max_water = max(max_water, water)
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    return max_water
```

### 11. 3Sum (Med.)

- **套路**：排序 + 固定一個 + 對撞指標
- **💡 白話文解說**：就像你要用兩塊木板裝水。水量取決於「較短的木板」和「木板間的寬度」。我們一開始把木板放最寬，接著每次都把「較短的那塊木板」往內移，看能不能幸運換到一塊長一點的木板來獲得更多水。
- **思路**：先排序。外層迴圈固定第一個數 nums[i]，內層用雙指標在 i+1~末尾找兩個數使三數之和為 0。
- **要點**：跳過重複的值避免重複答案。
- **複雜度**：O(n²) / O(1)

```python
def threeSum(nums):
    nums.sort()
    result = []
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i-1]:  # 跳過重複
            continue
        left, right = i + 1, len(nums) - 1
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            if total == 0:
                result.append([nums[i], nums[left], nums[right]])
                while left < right and nums[left] == nums[left+1]:
                    left += 1  # 跳過重複
                while left < right and nums[right] == nums[right-1]:
                    right -= 1
                left += 1
                right -= 1
            elif total < 0:
                left += 1
            else:
                right -= 1
    return result
```

### 14. 3Sum Closest (Med.)

- **套路**：排序 + 固定一個 + 對撞指標
- **思路**：與 3Sum 相同框架，但改為追蹤「與 target 差距最小」的和。
- **複雜度**：O(n²) / O(1)

```python
def threeSumClosest(nums, target):
    nums.sort()
    closest = float('inf')
    for i in range(len(nums) - 2):
        left, right = i + 1, len(nums) - 1
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            if abs(total - target) < abs(closest - target):
                closest = total
            if total < target:
                left += 1
            elif total > target:
                right -= 1
            else:
                return total  # 差距為 0，直接回傳
    return closest
```

### 31. Trapping Rain Water (Hard)

- **套路**：對撞指標 + 追蹤左右最高值
- **思路**：每個位置能接的雨水 = min(左邊最高, 右邊最高) - 自身高度。用雙指標從兩端往中間走，哪邊較矮就處理哪邊（因為另一邊保證更高）。
- **要點**：這題也能用 Stack 或 DP 解，但雙指標是 O(1) 空間最優解。
- **複雜度**：O(n) / O(1)

```python
def trap(height):
    left, right = 0, len(height) - 1
    left_max = right_max = 0
    water = 0
    while left < right:
        if height[left] < height[right]:
            left_max = max(left_max, height[left])
            water += left_max - height[left]
            left += 1
        else:
            right_max = max(right_max, height[right])
            water += right_max - height[right]
            right -= 1
    return water
```

### 134. Move Zeroes (Easy)

- **套路**：快慢指標（原地分區）
- **思路**：slow 指向下一個非零值該放的位置。fast 遍歷陣列，遇到非零就和 slow 交換，slow 前進。
- **複雜度**：O(n) / O(1)

```python
def moveZeroes(nums):
    slow = 0
    for fast in range(len(nums)):
        if nums[fast] != 0:
            nums[slow], nums[fast] = nums[fast], nums[slow]
            slow += 1
```

### 168. Squares of a Sorted Array (Easy)

- **套路**：對撞指標（從兩端取絕對值較大的）
- **思路**：已排序陣列平方後，最大值在兩端。從兩端開始比較絕對值，大的放到結果陣列尾部。
- **複雜度**：O(n) / O(n)

```python
def sortedSquares(nums):
    n = len(nums)
    result = [0] * n
    left, right = 0, n - 1
    for i in range(n - 1, -1, -1):
        if abs(nums[left]) > abs(nums[right]):
            result[i] = nums[left] ** 2
            left += 1
        else:
            result[i] = nums[right] ** 2
            right -= 1
    return result
```

### 3. Longest Palindromic Substring (Med.)

- **套路**：中心擴展法
- **💡 白話文解說**：想像你有一個極具伸縮性的框框。你把右邊界不斷往右拉，把新字元加進框內；一旦你發現框內出現重複字元了，就把左邊界往右縮，直到把那個重複的字元吐出去為止。過程中記錄這個框框最長有多大。
- **思路**：回文從中心向外擴展。遍歷每個位置作為中心（分奇數和偶數兩種），向兩邊擴展直到不匹配，記錄最長的。
- **複雜度**：O(n²) / O(1)

```python
def longestPalindrome(s):
    def expand(left, right):
        while left >= 0 and right < len(s) and s[left] == s[right]:
            left -= 1
            right += 1
        return s[left+1:right]

    result = ""
    for i in range(len(s)):
        odd = expand(i, i)       # 奇數長度，中心是 s[i]
        even = expand(i, i + 1)  # 偶數長度，中心是 s[i] 和 s[i+1]
        result = max(result, odd, even, key=len)
    return result
```

### 8. Palindrome Number (Easy)

- **套路**：反轉一半數字比較
- **💡 白話文解說**：這題就是考你怎麼把字串變成數字。重點是按部就班：先忽略前面的空白，再看正負號，然後把連續的數字轉出來，遇到不是數字的字元就停。最後記得檢查有沒有超過 32 位元整數的極限。
- **思路**：負數不是回文。把數字的後半段反轉，和前半段比較。當反轉的數 >= 原數時停止。
- **要點**：不轉字串，純數學操作。
- **複雜度**：O(log n) / O(1)

```python
def isPalindrome(x):
    if x < 0 or (x % 10 == 0 and x != 0):
        return False
    reversed_half = 0
    while x > reversed_half:
        reversed_half = reversed_half * 10 + x % 10
        x //= 10
    return x == reversed_half or x == reversed_half // 10
```

---
