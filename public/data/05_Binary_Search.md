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

- **套路**：找左邊界的二分搜尋
- **思路**：
  - `isBadVersion(mid)` 為真時，答案可能在 `mid` 或更左邊，所以收縮右邊界。
  - 為假時表示第一個壞版本一定在右半邊。
  - 最後停下來的位置就是第一個壞版本。
- **TC**：O(log n)
- **SC**：O(1)
- **其他思路**：
  - **線性掃描**：從版本 1 一路測到 `n`，第一個壞版就是答案。TC: O(n), SC: O(1)。
- **解法比較**：
  - **左邊界二分**：優點是 API 呼叫次數最少，完全符合題目本質。缺點是要先認出它其實是找第一個 `True` 的邊界問題。
  - **線性掃描**：優點是最直觀。缺點是版本數一大就完全不實用。
- **測試重點 (Testing)**：
  - 第一版就是壞版。
  - 最後一版才是壞版。

```python
def firstBadVersion(n):
    left, right = 1, n
    while left < right:
        mid = (left + right) // 2
        if isBadVersion(mid):
            right = mid
        else:
            left = mid + 1
    return left
```

### 33. Search in Rotated Sorted Array (Med.)

- **套路**：旋轉陣列二分搜尋
- **思路**：
  - 每次先判斷哪一半是有序的。
  - 如果左半邊有序，就檢查 `target` 是否落在 `nums[left]` 到 `nums[mid]` 之間；否則搜尋右半邊。
  - 右半邊有序時同理處理。
- **TC**：O(log n)
- **SC**：O(1)
- **其他思路**：
  - **先找旋轉點，再做普通二分**：先找到最小值位置，把陣列切成兩段有序區間，再決定去哪一段做標準二分。TC: O(log n), SC: O(1)。
- **解法比較**：
  - **一次二分直接判斷哪半有序**：優點是單趟完成，面試中最常見。缺點是條件分支較多。
  - **兩段式做法**：優點是概念拆得更清楚。缺點是程式比較長，要先多做一次找 pivot。
- **測試重點 (Testing)**：
  - `nums = [4,5,6,7,0,1,2], target = 0`。
  - 未旋轉與找不到目標的情況。

```python
def search(nums, target):
  left, right = 0, len(nums) - 1
  while left <= right:
    mid = (left + right) // 2
    if nums[mid] == target:
      return mid
    if nums[left] <= nums[mid]:
      if nums[left] <= target < nums[mid]:
        right = mid - 1
      else:
        left = mid + 1
    else:
      if nums[mid] < target <= nums[right]:
        left = mid + 1
      else:
        right = mid - 1
  return -1
```

### 153. Find Minimum in Rotated Sorted Array (Med.)

- **套路**：用右邊界判斷最小值所在半邊
- **思路**：
  - 若 `nums[mid] > nums[right]`，代表最小值在右半邊。
  - 否則最小值在 `mid` 或左半邊。
  - 收斂後 `left` 就是最小值位置。
- **TC**：O(log n)
- **SC**：O(1)
- **其他思路**：
  - **線性掃描找下降點**：第一個 `nums[i] < nums[i - 1]` 的位置就是最小值。TC: O(n), SC: O(1)。
- **解法比較**：
  - **二分判右邊界**：優點是對數時間，也是這題標準解。缺點是要理解為什麼 `nums[mid]` 與 `nums[right]` 的比較能決定答案區間。
  - **線性掃描**：優點是非常直觀。缺點是浪費了陣列幾乎有序的結構。
- **測試重點 (Testing)**：
  - 已排序未旋轉的情況。
  - 旋轉點在中間與靠尾端。

```python
def findMin(nums):
    left, right = 0, len(nums) - 1
    while left < right:
        mid = (left + right) // 2
        if nums[mid] > nums[right]:
            left = mid + 1
        else:
            right = mid
    return nums[left]
```

### 981. Time Based Key-Value Store (Med.)

- **套路**：Hash Map + 對時間戳做二分搜尋
- **思路**：
  - 每個 key 對應一個按時間遞增的列表 `[(timestamp, value)]`。
  - `set` 直接 append；`get` 時在列表中找最後一個 `timestamp <= target` 的元素。
- **TC**：`set` O(1)，`get` O(log n)
- **SC**：O(n)
- **其他思路**：
  - **有序映射 / TreeMap**：若語言內建有序 map，可對每個 key 用平衡樹找 `floor(timestamp)`。`set/get` 都是 O(log n)。
- **解法比較**：
  - **Hash Map + append + 二分**：優點是利用題目時間戳遞增條件，`set` 可以做到 O(1)。缺點是依賴輸入保證遞增。
  - **TreeMap**：優點是不依賴 append 順序。缺點是 `set` 也會退化成 O(log n)。
- **測試重點 (Testing)**：
  - 查詢剛好存在時間戳。
  - 查詢介於兩個時間戳之間。
  - 查詢早於第一筆資料。

```python
from bisect import bisect_right


class TimeMap:
    def __init__(self):
        self.store = {}

    def set(self, key, value, timestamp):
        self.store.setdefault(key, []).append((timestamp, value))

    def get(self, key, timestamp):
        items = self.store.get(key, [])
        index = bisect_right(items, (timestamp, chr(127))) - 1
        return items[index][1] if index >= 0 else ""
```

### 74. Search a 2D Matrix (Med.)

- **套路**：把矩陣視為一維有序陣列
- **思路**：
  - 因為每列遞增且每列首元素大於前一列末元素，所以整體可視為排序陣列。
  - 二分時用 `mid // cols` 與 `mid % cols` 轉回 row、col。
- **TC**：O(log(m * n))
- **SC**：O(1)
- **其他思路**：
  - **先二分找列，再二分找欄**：先根據每列首尾值決定目標可能在哪一列，再對該列做普通二分。TC: O(log m + log n), SC: O(1)。
- **解法比較**：
  - **矩陣攤平成一維**：優點是程式最整潔，只寫一次二分。缺點是要熟悉 `mid // cols` 與 `mid % cols` 的映射。
  - **兩段式二分**：優點是更貼近人類對矩陣的直覺。缺點是會多一層流程判斷。
- **測試重點 (Testing)**：
  - 目標存在於首列、尾列。
  - 目標不存在。

```python
def searchMatrix(matrix, target):
    rows, cols = len(matrix), len(matrix[0])
    left, right = 0, rows * cols - 1

    while left <= right:
        mid = (left + right) // 2
        value = matrix[mid // cols][mid % cols]
        if value == target:
            return True
        if value < target:
            left = mid + 1
        else:
            right = mid - 1

    return False
```

### 658. Find K Closest Elements (Med.)

- **套路**：二分搜尋長度為 k 的最佳窗口起點
- **思路**：
  - 答案一定是原陣列中的連續長度 `k` 窗口。
  - 比較 `x - arr[mid]` 與 `arr[mid + k] - x`，判斷窗口應往左還是往右移。
- **TC**：O(log(n - k) + k)
- **SC**：O(k)
- **其他思路**：
  - **先用二分找到最接近 `x` 的位置，再用雙指標往兩側擴張 k 次**。TC: O(log n + k), SC: O(k)。
- **解法比較**：
  - **二分窗口起點**：優點是直接瞄準答案型態「長度 k 的連續窗口」，寫法簡潔。缺點是條件 `x - arr[mid] > arr[mid + k] - x` 一開始不直觀。
  - **中心擴張**：優點是思路自然。缺點是需要額外處理左右邊界與平手規則。
- **測試重點 (Testing)**：
  - `x` 在陣列範圍外。
  - `x` 恰好在中間且左右距離相同。

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

- **套路**：前綴和 + 隨機數二分定位
- **思路**：
  - 建立權重前綴和，總和代表整個抽樣空間。
  - 每次隨機取 `1..total` 之間一個整數，再用二分找第一個前綴和 `>= target` 的位置。
- **TC**：初始化 O(n)，`pickIndex` O(log n)
- **SC**：O(n)
- **其他思路**：
  - **線性掃描權重區間**：每次隨機後從頭累加直到覆蓋 target。初始化 O(n)，`pickIndex` O(n)。
  - **Alias Method**：可把抽樣降到 O(1)，但前處理較複雜。
- **解法比較**：
  - **前綴和 + 二分**：優點是實作簡潔，已足夠通過大多數面試與題目要求。缺點是每次抽樣仍需 O(log n)。
  - **線性掃描**：優點是最好懂。缺點是每次抽樣太慢。
  - **Alias Method**：優點是查詢最快。缺點是建表複雜，面試中通常過度設計。
- **測試重點 (Testing)**：
  - 單一元素。
  - 權重差距很大時抽樣分布是否合理。

```python
import bisect
import random


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

- **套路**：在較短陣列上二分切分點
- **思路**：
  - 找一個切分，使左半邊總數量等於右半邊，且 `left_max <= right_min`。
  - 若 `nums1_left > nums2_right`，切分太右，要往左移；反之往右移。
  - 合法切分後依總長度奇偶取 median。
- **TC**：O(log(min(m, n)))
- **SC**：O(1)
- **其他思路**：
  - **部分合併到中位數位置**：像 merge sorted arrays 一樣，只合併到第 `(m + n) // 2` 個元素就停。TC: O(m + n), SC: O(1) 或 O(m + n) 視實作。
  - **找第 k 小數的遞迴淘汰法**：每次丟掉兩陣列前半的一部分。TC: O(log(m + n)), SC: O(log(m + n))。
- **解法比較**：
  - **切分點二分**：優點是時間最佳，也是這題代表性技巧。缺點是推導與邊界都較難。
  - **部分合併**：優點是最容易想到，也好驗證。缺點是不符合題目要求的對數時間。
  - **kth 遞迴淘汰**：優點是概念統一，可延伸到一般第 k 小。缺點是實作仍比部分合併難。
- **測試重點 (Testing)**：
  - 兩陣列長度差異大。
  - 一個陣列為空。
  - 總長度奇數與偶數。

```python
def findMedianSortedArrays(nums1, nums2):
  if len(nums1) > len(nums2):
    nums1, nums2 = nums2, nums1

  total = len(nums1) + len(nums2)
  half = total // 2
  left, right = 0, len(nums1)

  while True:
    i = (left + right) // 2
    j = half - i

    nums1_left = nums1[i - 1] if i > 0 else float("-inf")
    nums1_right = nums1[i] if i < len(nums1) else float("inf")
    nums2_left = nums2[j - 1] if j > 0 else float("-inf")
    nums2_right = nums2[j] if j < len(nums2) else float("inf")

    if nums1_left <= nums2_right and nums2_left <= nums1_right:
      if total % 2:
        return min(nums1_right, nums2_right)
      return (max(nums1_left, nums2_left) + min(nums1_right, nums2_right)) / 2
    if nums1_left > nums2_right:
      right = i - 1
    else:
      left = i + 1
```
