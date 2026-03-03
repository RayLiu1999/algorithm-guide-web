# 八、Heap / Priority Queue（堆積）

## 題目目錄

- [973. K Closest Points to Origin (Med.)](#973-k-closest-points-to-origin-med)
- [215. Kth Largest Element in an Array (Med.)](#215-kth-largest-element-in-an-array-med)
- [692. Top K Frequent Words (Med.)](#692-top-k-frequent-words-med)
- [621. Task Scheduler (Med.)](#621-task-scheduler-med)
- [253. Meeting Rooms II (Med.)](#253-meeting-rooms-ii-med)
- [295. Find Median from Data Stream (Hard)](#295-find-median-from-data-stream-hard)
- [759. Employee Free Time (Hard)](#759-employee-free-time-hard)
- [362. Design Hit Counter (Med.)](#362-design-hit-counter-med)

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

---

### 215. Kth Largest Element in an Array (Med.)

---

### 692. Top K Frequent Words (Med.)

---

### 621. Task Scheduler (Med.)

---

### 253. Meeting Rooms II (Med.)

---

### 295. Find Median from Data Stream (Hard)

---

### 759. Employee Free Time (Hard)

---

### 362. Design Hit Counter (Med.)
