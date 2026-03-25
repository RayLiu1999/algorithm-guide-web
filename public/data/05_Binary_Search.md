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

- **套路**：標準二分搜尋 (Standard Binary Search)
- **思路**：
  - 初始化 `left = 0`, `right = len(nums) - 1`。
  - **在 `while left <= right` 迴圈中：**
    1. **計算 `mid = left + (right - left) // 2`（防止溢位）。**
    2. 如果 `nums[mid] == target`，找到目標，返回 `mid`。
    3. 如果 `nums[mid] < target`，目標在右半部，`left = mid + 1`。
    4. 如果 `nums[mid] > target`，目標在左半部，`right = mid - 1`。
  - 如果迴圈結束仍未找到，返回 `-1`。
- **TC**：O(log n)
  - 每次迴圈將搜尋範圍減半，時間複雜度為對數級別。
- **SC**：O(1)
  - 只使用了有限的額外變數（`left`, `right`, `mid`），空間複雜度為常數。
- **其他思路**：
  - **遞迴 (Recursive)**：
    - 定義輔助函數 `search(left, right)`。
    - Base Case：如果 `left > right`，返回 `-1`。
    - 計算 `mid`，比較並遞迴調用左半部或右半部。
    - TC: O(log n), SC: O(log n)（遞迴堆疊空間）。
- **解法比較**：
  - **迭代**：
    - 優點：空間效率高 (O(1))，沒有遞迴深度限制，通常在面試中更受青睞。
    - 缺點：需要手動管理 `left` 和 `right` 指標，邊界條件稍顯繁瑣。
  - **遞迴**：
    - 優點：代碼結構清晰，符合函數式編程思想。
    - 缺點：空間複雜度較高 (O(log n))，當 n 非常大時可能導致堆疊溢位。
- **測試重點 (Testing)**：
  - **目標存在**：`nums = [-1, 0, 3, 5, 9, 12], target = 9`，預期輸出 `4`。
  - **目標不存在**：`nums = [-1, 0, 3, 5, 9, 12], target = 2`，預期輸出 `-1`。
  - **目標在左邊界**：`nums = [1, 2, 3, 4, 5], target = 1`，預期輸出 `0`。
  - **目標在右邊界**：`nums = [1, 2, 3, 4, 5], target = 5`，預期輸出 `4`。
  - **只有一個元素**：`nums = [5], target = 5`，預期輸出 `0`；`target = 3`，預期輸出 `-1`。
  - **空陣列**：`nums = [], target = 5`，預期輸出 `-1`。

```python
# 套路模板：標準二分搜尋
def binary_search(nums, target):
    left, right = 0, len(nums) - 1

    while left <= right:
        # 防止溢位：left + (right - left) // 2
        mid = left + (right - left) // 2

        if nums[mid] == target:
            return mid  # 找到目標
        elif nums[mid] < target:
            left = mid + 1  # 目標在右半部
        else:
            right = mid - 1  # 目標在左半部

    return -1  # 未找到目標
```

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
