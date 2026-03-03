# 二、Two Pointers（雙指標）

## 題目目錄

- [125. Valid Palindrome (Easy)](#125-valid-palindrome-easy)
- [11. Container With Most Water (Med.)](#11-container-with-most-water-med)
- [15. 3Sum (Med.)](#15-3sum-med)
- [16. 3Sum Closest (Med.)](#16-3sum-closest-med)
- [42. Trapping Rain Water (Hard)](#42-trapping-rain-water-hard)
- [283. Move Zeroes (Easy)](#283-move-zeroes-easy)
- [977. Squares of a Sorted Array (Easy)](#977-squares-of-a-sorted-array-easy)
- [5. Longest Palindromic Substring (Med.)](#5-longest-palindromic-substring-med)
- [9. Palindrome Number (Easy)](#9-palindrome-number-easy)

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

### 125. Valid Palindrome (Easy)

---

### 11. Container With Most Water (Med.)

---

### 15. 3Sum (Med.)

---

### 16. 3Sum Closest (Med.)

---

### 42. Trapping Rain Water (Hard)

---

### 283. Move Zeroes (Easy)

---

### 977. Squares of a Sorted Array (Easy)

---

### 5. Longest Palindromic Substring (Med.)

---

### 9. Palindrome Number (Easy)
