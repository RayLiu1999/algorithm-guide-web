# 一、Array & Hashing（陣列與雜湊表）

## 題目目錄

- [1. Two Sum (Easy)](#1-two-sum-easy)
- [383. Ransom Note (Easy)](#383-ransom-note-easy)
- [409. Longest Palindrome (Easy)](#409-longest-palindrome-easy)
- [169. Majority Element (Easy)](#169-majority-element-easy)
- [217. Contains Duplicate (Easy)](#217-contains-duplicate-easy)
- [242. Valid Anagram (Easy)](#242-valid-anagram-easy)
- [121. Best Time to Buy and Sell Stock (Easy)](#121-best-time-to-buy-and-sell-stock-easy)
- [238. Product of Array Except Self (Med.)](#238-product-of-array-except-self-med)
- [49. Group Anagrams (Med.)](#49-group-anagrams-med)
- [53. Maximum Subarray (Med.)](#53-maximum-subarray-med)
- [525. Contiguous Array (Med.)](#525-contiguous-array-med)
- [560. Subarray Sum Equals K (Med.)](#560-subarray-sum-equals-k-med)
- [128. Longest Consecutive Sequence (Med.)](#128-longest-consecutive-sequence-med)
- [8. String to Integer - atoi (Med.)](#8-string-to-integer---atoi-med)
- [54. Spiral Matrix (Med.)](#54-spiral-matrix-med)
- [48. Rotate Image (Med.)](#48-rotate-image-med)
- [73. Set Matrix Zeroes (Med.)](#73-set-matrix-zeroes-med)
- [75. Sort Colors (Med.)](#75-sort-colors-med)
- [136. Single Number (Easy)](#136-single-number-easy)
- [179. Largest Number (Med.)](#179-largest-number-med)
- [189. Rotate Array (Med.)](#189-rotate-array-med)
- [41. First Missing Positive (Hard)](#41-first-missing-positive-hard)
- [271. Encode and Decode Strings (Med.)](#271-encode-and-decode-strings-med)
- [380. Insert Delete GetRandom O(1) (Med.)](#380-insert-delete-getrandom-o1-med)

## 通用套路

**Hash Map 反查法**：當題目要你「找到某個配對/目標」，用 Hash Map 把已經看過的值存起來，每次新元素進來就查表，達成 O(1) 查詢。

**Hash Set 去重法**：需要判斷是否存在重複、或快速判斷某元素是否出現過。

**計數法 (Counter)**：統計每個元素出現的次數，常用於 Anagram、Majority 類型題。

**前綴和 (Prefix Sum)**：需要快速計算子陣列的和時，先算出前綴和陣列，讓任意區間和變成 O(1)。

```python
# 套路模板：Hash Map 反查
def two_sum_pattern(nums, target):
    seen = {}  # 值 → 索引
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i

# 套路模板：前綴和 + Hash Map
def prefix_sum_pattern(nums, k):
    count = 0
    prefix = 0
    seen = {0: 1}  # 前綴和 → 出現次數
    for num in nums:
        prefix += num
        if prefix - k in seen:
            count += seen[prefix - k]
        seen[prefix] = seen.get(prefix, 0) + 1
    return count
```

---

### 1. Two Sum (Easy)

---

### 383. Ransom Note (Easy)

---

### 409. Longest Palindrome (Easy)

---

### 169. Majority Element (Easy)

---

### 217. Contains Duplicate (Easy)

---

### 242. Valid Anagram (Easy)

---

### 121. Best Time to Buy and Sell Stock (Easy)

---

### 238. Product of Array Except Self (Med.)

---

### 49. Group Anagrams (Med.)

---

### 53. Maximum Subarray (Med.)

---

### 525. Contiguous Array (Med.)

---

### 560. Subarray Sum Equals K (Med.)

---

### 128. Longest Consecutive Sequence (Med.)

---

### 8. String to Integer - atoi (Med.)

---

### 54. Spiral Matrix (Med.)

---

### 48. Rotate Image (Med.)

---

### 73. Set Matrix Zeroes (Med.)

---

### 75. Sort Colors (Med.)

---

### 136. Single Number (Easy)

---

### 179. Largest Number (Med.)

---

### 189. Rotate Array (Med.)

---

### 41. First Missing Positive (Hard)

---

### 271. Encode and Decode Strings (Med.)

---

### 380. Insert Delete GetRandom O(1) (Med.)
