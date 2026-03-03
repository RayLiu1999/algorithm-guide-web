# 五、Binary Search（二分搜尋）

## 題目目錄

- [704. Binary Search (Easy)](#704-binary-search-easy)
- [278. First Bad Version (Easy)](#278-first-bad-version-easy)
- [33. Search in Rotated Sorted Array (Med.)](#33-search-in-rotated-sorted-array-med)
- [153. Find Minimum in Rotated Sorted Array (Med.)](#153-find-minimum-in-rotated-sorted-array-med)
- [981. Time Based Key-Value Store (Med.)](#981-time-based-key-value-store-med)
- [74. Search a 2D Matrix (Med.)](#74-search-a-2d-matrix-med)
- [658. Find K Closest Elements (Med.)](#658-find-k-closest-elements-med)
- [528. Random Pick with Weight (Med.)](#528-random-pick-with-weight-med)
- [4. Median of Two Sorted Arrays (Hard)](#4-median-of-two-sorted-arrays-hard)

## 通用套路

**核心**：在已排序的搜尋空間中，每次砍掉一半，O(log n) 找到目標。

**三種變形**：

1. 精確查找：找到 target 回傳
2. 左邊界：找第一個 >= target 的位置
3. 右邊界：找最後一個 <= target 的位置

```python
# 套路模板：標準二分搜尋
def binary_search(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

# 套路模板：找左邊界（第一個 >= target）
def lower_bound(nums, target):
    left, right = 0, len(nums)
    while left < right:
        mid = (left + right) // 2
        if nums[mid] < target:
            left = mid + 1
        else:
            right = mid
    return left
```

---

### 704. Binary Search (Easy)

---

### 278. First Bad Version (Easy)

---

### 33. Search in Rotated Sorted Array (Med.)

---

### 153. Find Minimum in Rotated Sorted Array (Med.)

---

### 981. Time Based Key-Value Store (Med.)

---

### 74. Search a 2D Matrix (Med.)

---

### 658. Find K Closest Elements (Med.)

---

### 528. Random Pick with Weight (Med.)

---

### 4. Median of Two Sorted Arrays (Hard)
