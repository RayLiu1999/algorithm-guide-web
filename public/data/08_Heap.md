# 八、Heap / Priority Queue（堆積）

## 通用套路

**Top K 問題**：用 Min-Heap 維護 K 個最大元素，或 Max-Heap 維護 K 個最小元素。

**合併 K 個有序序列**：用 Min-Heap 每次取最小的，推入下一個。

**雙堆**：用一個 Max-Heap + 一個 Min-Heap 維護中位數。

```python
import heapq

# Python heapq 只有 Min-Heap
# Max-Heap 技巧：存 -val

# 套路模板：Top K 最大
def top_k_largest(nums, k):
    return heapq.nlargest(k, nums)
    # 或手動維護 min-heap of size k
```

---

### 973. K Closest Points to Origin (Med.)

- **套路**：Max-Heap 維護 K 個最近
- **思路**：用 Max-Heap（存負距離）維護 K 個最近的點。
- **複雜度**：O(n·log k) / O(k)

```python
import heapq

def kClosest(points, k):
    heap = []
    for x, y in points:
        dist = -(x*x + y*y)  # 負值 → Max-Heap
        if len(heap) < k:
            heapq.heappush(heap, (dist, x, y))
        elif dist > heap[0][0]:
            heapq.heapreplace(heap, (dist, x, y))
    return [[x, y] for _, x, y in heap]
```

### 215. Kth Largest Element in an Array (Med.)

- **套路**：Min-Heap 維護 K 個最大
- **💡 白話文解說**：給一個有小到大順序的陣列，想把它變成一棵平衡的搜尋樹（左邊小於中間、右邊大於中間）。我們只要總是把陣列「正中央的那個數字」拿來當樹頭，左半邊做成左樹、右半邊做成右樹，就能建起一棵最穩的樹了。
- **思路**：維護大小為 K 的 Min-Heap，遍歷完後堆頂就是第 K 大。
- **複雜度**：O(n·log k) / O(k)

```python
import heapq

def findKthLargest(nums, k):
    return heapq.nlargest(k, nums)[-1]
    # 或用 quickselect 做到 O(n) 平均
```

### 692. Top K Frequent Words (Med.)

- **套路**：Counter + Heap
- **思路**：統計頻率後用 Heap 取 Top K。
- **複雜度**：O(n + k·log n) / O(n)

```python
from collections import Counter
import heapq

def topKFrequent(words, k):
    counts = Counter(words)
    # (-freq, word) 讓頻率高的排前面，同頻率字典序小的排前面
    return heapq.nsmallest(k, counts.keys(), key=lambda w: (-counts[w], w))
```

### 621. Task Scheduler (Med.)

- **套路**：貪心 + Max-Heap（或公式法）
- **思路**：最高頻任務決定最少所需時間。公式：(max_freq - 1) \* (n + 1) + count_of_max_freq_tasks。
- **複雜度**：O(n) / O(1)

```python
from collections import Counter

def leastInterval(tasks, n):
    counts = Counter(tasks)
    max_freq = max(counts.values())
    max_count = sum(1 for v in counts.values() if v == max_freq)
    # 公式法
    result = (max_freq - 1) * (n + 1) + max_count
    return max(result, len(tasks))  # 至少要排完所有任務
```

### 253. Meeting Rooms II (Med.)

- **套路**：排序 + Min-Heap 追蹤最早結束
- **思路**：按開始時間排序。用 Min-Heap 維護每個會議室的結束時間。新會議來時，如果最早結束的會議室已結束（end <= start），就重用。
- **複雜度**：O(n·log n) / O(n)

```python
import heapq

def minMeetingRooms(intervals):
    intervals.sort(key=lambda x: x[0])
    heap = []  # 追蹤每間會議室的結束時間
    for start, end in intervals:
        if heap and heap[0] <= start:
            heapq.heapreplace(heap, end)  # 重用
        else:
            heapq.heappush(heap, end)     # 開新房間
    return len(heap)
```

### 295. Find Median from Data Stream (Hard)

- **套路**：雙堆 (Max-Heap + Min-Heap)
- **思路**：用 Max-Heap 存較小的那一半，Min-Heap 存較大的那一半。中位數就是堆頂。
- **要點**：保持兩堆大小差 ≤ 1。
- **複雜度**：addNum O(log n) / findMedian O(1)

```python
import heapq

class MedianFinder:
    def __init__(self):
        self.small = []  # Max-Heap（存負值）
        self.large = []  # Min-Heap

    def addNum(self, num):
        heapq.heappush(self.small, -num)
        # 確保 small 的最大值 <= large 的最小值
        heapq.heappush(self.large, -heapq.heappop(self.small))
        # 平衡大小
        if len(self.large) > len(self.small):
            heapq.heappush(self.small, -heapq.heappop(self.large))

    def findMedian(self):
        if len(self.small) > len(self.large):
            return -self.small[0]
        return (-self.small[0] + self.large[0]) / 2
```

### 759. Employee Free Time (Hard)

- **套路**：合併區間 + 排序
- **思路**：把所有員工的排班攤平排序，找相鄰已排班區間之間的空隙。
- **複雜度**：O(n·log n) / O(n)

```python
def employeeFreeTime(schedule):
    intervals = sorted([iv for emp in schedule for iv in emp], key=lambda x: x.start)
    result = []
    prev_end = intervals[0].end
    for iv in intervals[1:]:
        if iv.start > prev_end:
            result.append(Interval(prev_end, iv.start))
        prev_end = max(prev_end, iv.end)
    return result
```

### 362. Design Hit Counter (Med.)

- **套路**：Queue（時間窗口內的事件）
- **思路**：用 Queue 存每次 hit 的時間戳。getHits 時清除超過 300 秒的舊紀錄。
- **複雜度**：hit O(1) / getHits O(n)

```python
from collections import deque

class HitCounter:
    def __init__(self):
        self.hits = deque()

    def hit(self, timestamp):
        self.hits.append(timestamp)

    def getHits(self, timestamp):
        while self.hits and self.hits[0] <= timestamp - 300:
            self.hits.popleft()
        return len(self.hits)
```

---
