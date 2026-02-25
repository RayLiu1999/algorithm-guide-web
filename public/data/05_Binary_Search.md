# 五、Binary Search（二分搜尋）

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

- **套路**：標準二分
- **💡 白話文解說**：就像你要在一本按字母順序排列的電話簿查一個名字。你不需要從第一頁翻到最後，而是直接翻到中間，看看要找的名字在前半還是後半，然後繼續對半切，直到找到為止。每次為搜尋範圍縮小一半，這就是 O(log n) 的精髓。
- **複雜度**：O(log n) / O(1)

```python
def search(nums, target):
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
```

### 278. First Bad Version (Easy)

- **套路**：左邊界二分
- **💡 白話文解說**：想像生產線上的產品從某一個開始就都是壞的。比起從第一個逐一檢查，你可以直接從中間開始驗：如果中間是好的，第一個壞品一定在後半；如果中間已經壞了，第一個壞品可能就是它或在前半。每次縮小一半範圍，很快就能鎖定第一個壞品的位置。
- **思路**：找第一個 `isBadVersion(mid) == True` 的位置。
- **複雜度**：O(log n) / O(1)

```python
def firstBadVersion(n):
    left, right = 1, n
    while left < right:
        mid = (left + right) // 2
        if isBadVersion(mid):
            right = mid       # 答案在左半邊（含 mid）
        else:
            left = mid + 1    # 答案在右半邊
    return left
```

### 33. Search in Rotated Sorted Array (Med.)

- **套路**：二分 + 判斷哪半邊有序
- **思路**：旋轉後的陣列一定有一半是有序的。先判斷 mid 在哪半邊，再決定搜尋方向。
- **要點**：用 `nums[left] <= nums[mid]` 判斷左半邊是否有序。
- **複雜度**：O(log n) / O(1)

```python
def search(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        if nums[left] <= nums[mid]:  # 左半邊有序
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:  # 右半邊有序
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    return -1
```

### 153. Find Minimum in Rotated Sorted Array (Med.)

- **套路**：二分找旋轉點
- **思路**：最小值在「無序的那一半」。如果 nums[mid] > nums[right]，最小值在右半邊；否則在左半邊。
- **複雜度**：O(log n) / O(1)

```python
def findMin(nums):
    left, right = 0, len(nums) - 1
    while left < right:
        mid = (left + right) // 2
        if nums[mid] > nums[right]:
            left = mid + 1    # 最小值在右半邊
        else:
            right = mid       # 最小值在左半邊（含 mid）
    return nums[left]
```

### 981. Time Based Key-Value Store (Med.)

- **套路**：Hash Map + 二分搜尋
- **💡 白話文解說**：這就像一份時光機日記。你用「keyword + 時間戳」查詢某個鍵在某個時刻的字元；因為同一個 key 的時間戳是按順序新增的，我們可以用二分搜尋，快速找到「小於等於查詢時間戳」的最近一筆記錄。
- **思路**：每個 key 對應一個有序的 (timestamp, value) 列表。get 時用二分找 <= timestamp 的最大值。
- **複雜度**：set O(1) / get O(log n)

```python
from collections import defaultdict
import bisect

class TimeMap:
    def __init__(self):
        self.store = defaultdict(list)  # key → [(timestamp, value)]

    def set(self, key, value, timestamp):
        self.store[key].append((timestamp, value))

    def get(self, key, timestamp):
        if key not in self.store:
            return ""
        pairs = self.store[key]
        # 找最大的 t <= timestamp
        idx = bisect.bisect_right(pairs, (timestamp, chr(127))) - 1
        return pairs[idx][1] if idx >= 0 else ""
```

### 74. Search a 2D Matrix (Med.)

- **套路**：把二維視為一維做二分
- **思路**：m×n 矩陣視為長度 m\*n 的排序陣列。index 轉換：row = mid // n, col = mid % n。
- **複雜度**：O(log(m·n)) / O(1)

```python
def searchMatrix(matrix, target):
    m, n = len(matrix), len(matrix[0])
    left, right = 0, m * n - 1
    while left <= right:
        mid = (left + right) // 2
        val = matrix[mid // n][mid % n]
        if val == target:
            return True
        elif val < target:
            left = mid + 1
        else:
            right = mid - 1
    return False
```

### 658. Find K Closest Elements (Med.)

- **套路**：二分找左邊界 + 滑動窗口
- **思路**：找一個長度為 k 的窗口 [left, left+k-1]，使得 `x - arr[left]` 和 `arr[left+k] - x` 的比較來決定窗口該左還是右移。
- **複雜度**：O(log(n-k) + k) / O(1)

```python
def findClosestElements(arr, k, x):
    left, right = 0, len(arr) - k
    while left < right:
        mid = (left + right) // 2
        if x - arr[mid] > arr[mid + k] - x:
            left = mid + 1
        else:
            right = mid
    return arr[left:left + k]
```

### 528. Random Pick with Weight (Med.)

- **套路**：前綴和 + 二分
- **思路**：權重轉前綴和。隨機產生 [1, total] 的數字，用二分找它落在哪個前綴和區間。
- **複雜度**：初始化 O(n) / pickIndex O(log n)

```python
import random
import bisect

class Solution:
    def __init__(self, w):
        self.prefix = []
        total = 0
        for weight in w:
            total += weight
            self.prefix.append(total)
        self.total = total

    def pickIndex(self):
        target = random.randint(1, self.total)
        return bisect.bisect_left(self.prefix, target)
```

### 4. Median of Two Sorted Arrays (Hard)

- **套路**：二分搜尋分割點
- **思路**：在較短的陣列上做二分，找到一個分割點使得左半邊最大值 <= 右半邊最小值。
- **💡 白話文解說**：這是二分搜尋最抽象的一題。你要找兩群人排隊的「中位數」，其實就是要在這兩條隊伍中各畫一條線，使得「左半邊的總人數 = 右半邊的總人數」，而且「左半邊所有人都比右半邊小」。只要我們對較短的那條隊伍做二分搜尋來決定畫線位置就可以了。
- **要點**：這是 Binary Search 最難的題之一。核心是理解分割的對稱性。
- **複雜度**：O(log(min(m,n))) / O(1)

```python
def findMedianSortedArrays(nums1, nums2):
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1  # 確保在較短的上面搜尋
    m, n = len(nums1), len(nums2)
    left, right = 0, m
    while left <= right:
        i = (left + right) // 2         # nums1 的分割點
        j = (m + n + 1) // 2 - i        # nums2 的分割點
        left1 = nums1[i-1] if i > 0 else float('-inf')
        right1 = nums1[i] if i < m else float('inf')
        left2 = nums2[j-1] if j > 0 else float('-inf')
        right2 = nums2[j] if j < n else float('inf')
        if left1 <= right2 and left2 <= right1:
            if (m + n) % 2 == 0:
                return (max(left1, left2) + min(right1, right2)) / 2
            else:
                return max(left1, left2)
        elif left1 > right2:
            right = i - 1
        else:
            left = i + 1
```

---
