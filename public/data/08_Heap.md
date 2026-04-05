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

- **Problem (English)**:
        - Given an array of 2D points and an integer `k`, return the `k` points closest to the origin `(0, 0)`.
        - The output order does not matter.
- **題目（中文）**：
        - 給定一個二維點陣列與整數 `k`，請回傳距離原點 `(0, 0)` 最近的 `k` 個點。
        - 回傳順序不限。

- **Examples**:
  - Example 1: `points = [[1,3],[-2,2]], k = 1`
    - Output: `[[-2,2]]`
    - Explanation: The distance between (1, 3) and the origin is sqrt(10).
The distance between (-2, 2) and the origin is sqrt(8).
Since sqrt(8) < sqrt(10), (-2, 2) is closer to the origin.
We only want the closest k = 1 points from the origin, so the answer is just [[-2,2]].
  - Example 2: `points = [[3,3],[5,-1],[-2,4]], k = 2`
    - Output: `[[3,3],[-2,4]]`
    - Explanation: The answer [[-2,4],[3,3]] would also be accepted.
- **Constraints**:
  - `1 <= k <= points.length <= 10^4`
  - `-10^4 <= xi, yi <= 10^4`

- **套路**：大小為 `k` 的 max-heap
- **思路**：
        - 距離只用來比較大小，所以直接算 `x^2 + y^2` 即可，不需要真的開根號。
        - 用負距離模擬 max-heap，heap 中只保留目前最近的 `k` 個點。
        - 一旦 heap 超過 `k`，就把最遠的點彈掉，最後留下的就是答案。
- **TC**：O(n log k)
        - 每個點最多做一次 push 與一次 pop，而 heap 大小始終不超過 `k`。
- **SC**：O(k)
        - heap 裡最多同時保存 `k` 個點。
- **其他思路**：
        - **Quickselect**：把距離當 key 做選擇演算法，平均可在 O(n) 找到前 `k` 小，再切出答案。
- **解法比較**：
        - **heap**：優點是寫法穩定、容易處理串流輸入。缺點是理論上比平均 O(n) 的 Quickselect 慢。
        - **Quickselect**：優點是平均時間更好。缺點是實作細節較多，最壞情況也可能退化。
- **測試重點 (Testing)**：
        - **`k = 1`**：只取最近的一個點。
        - **`k = len(points)`**：應回傳全部點。
        - **距離相同**：多個點平方距離相同時，任意順序通常都可接受。
        - **含負座標**：例如 `[-2, 4]`，確認距離計算不受正負影響。

```python
import heapq


def kClosest(points, k):
                heap = []

                for x, y in points:
                                dist = x * x + y * y
                                heapq.heappush(heap, (-dist, [x, y]))
                                if len(heap) > k:
                                                heapq.heappop(heap)

                return [point for _, point in heap]
```

### 215. Kth Largest Element in an Array (Med.)

- **Problem (English)**:
        - Given an integer array `nums` and an integer `k`, return the `k`th largest element in the array.
        - This refers to the element's position in sorted order, not the `k`th distinct value.
- **題目（中文）**：
        - 給定整數陣列 `nums` 與整數 `k`，請回傳陣列中的第 `k` 大元素。
        - 這裡的第 `k` 大是排序後的位置，不是第 `k` 個不同的值。

- **Examples**:
  - Example 1: `nums = [3,2,1,5,6,4], k = 2`
    - Output: `5`
  - Example 2: `nums = [3,2,3,1,2,4,5,5,6], k = 4`
    - Output: `4`
- **Constraints**:
  - `1 <= k <= nums.length <= 10^5`
  - `-10^4 <= nums[i] <= 10^4`

- **套路**：min-heap 維持 `k` 個最大值
- **思路**：
        - 依序掃過所有數字，把它們放進 min-heap。
        - 若 heap 大小超過 `k`，就彈出最小值，等於把「不可能是第 `k` 大」的元素淘汰掉。
        - 掃完後 heap 中剛好保留最大的 `k` 個數，heap 頂端就是第 `k` 大。
- **TC**：O(n log k)
        - 每個元素都會進 heap 一次，而 heap 大小最多為 `k`。
- **SC**：O(k)
        - 只需要保存目前最大的 `k` 個元素。
- **其他思路**：
        - **Quickselect**：像快排分區那樣把第 `k` 大定位到正確位置，平均 O(n)。
- **解法比較**：
        - **heap**：優點是穩定、適合資料流。缺點是理論上比 Quickselect 慢。
        - **Quickselect**：優點是平均時間漂亮。缺點是實作與邊界較容易出錯。
- **測試重點 (Testing)**：
        - **`k = 1`**：答案應是最大值。
        - **`k = len(nums)`**：答案應是最小值。
        - **重複值**：例如 `[3,2,3,1,2,4,5,5,6]`。
        - **含負數**：確認比較邏輯不依賴正整數。

```python
import heapq


def findKthLargest(nums, k):
                heap = []

                for num in nums:
                                heapq.heappush(heap, num)
                                if len(heap) > k:
                                                heapq.heappop(heap)

                return heap[0]
```

### 692. Top K Frequent Words (Med.)

- **Problem (English)**:
        - Given an array of words and an integer `k`, return the `k` most frequent words.
        - If multiple words have the same frequency, the lexicographically smaller word comes first.
- **題目（中文）**：
        - 給定一個單字陣列與整數 `k`，請回傳出現頻率最高的 `k` 個單字。
        - 若頻率相同，字典序較小的單字要排在前面。

- **Examples**:
  - Example 1: `words = ["i","love","leetcode","i","love","coding"], k = 2`
    - Output: `["i","love"]`
    - Explanation: "i" and "love" are the two most frequent words.
Note that "i" comes before "love" due to a lower alphabetical order.
  - Example 2: `words = ["the","day","is","sunny","the","the","the","sunny","is","is"], k = 4`
    - Output: `["the","is","sunny","day"]`
    - Explanation: "the", "is", "sunny" and "day" are the four most frequent words, with the number of occurrence being 4, 3, 2 and 1 respectively.
- **Constraints**:
  - `1 <= words.length <= 500`
  - `1 <= words[i].length <= 10`
  - words[i] consists of lowercase English letters.
  - k is in the range [1, The number of unique words[i]]

- **套路**：計數 + heap 排序規則
- **思路**：
        - 先用 `Counter` 算出每個單字的頻率。
        - 接著把 `(-freq, word)` 放進 min-heap；因為 tuple 會先比第一欄，所以頻率高者會先出來。
        - 當頻率相同時，tuple 會繼續比 `word`，自然滿足字典序較小者優先。
- **TC**：O(n + m + k log m)
        - `n` 是總單字數、`m` 是相異單字數；計數 O(n)、heapify O(m)、彈出 `k` 次各 O(log m)。
- **SC**：O(m)
        - Counter 與 heap 都最多保存 `m` 個相異單字。
- **其他思路**：
        - **排序所有單字**：直接把相異單字依 `(-freq, word)` 排序後取前 `k` 個，邏輯很直白。
- **解法比較**：
        - **heap**：優點是當 `k` 遠小於 `m` 時概念上更貼近 Top K。缺點是 Python 這題仍常要先建完整 heap。
        - **排序**：優點是最容易讀。缺點是一定要做完整排序，成本較固定。
- **測試重點 (Testing)**：
        - **頻率不同**：高頻單字必須先出現。
        - **頻率相同**：字典序較小的單字要排前面。
        - **`k` 等於相異單字數**：應回傳所有單字。
        - **只有單一單字重複**：例如 `['a','a','a']`。

```python
import heapq
from collections import Counter


def topKFrequent(words, k):
                counter = Counter(words)
                heap = [(-freq, word) for word, freq in counter.items()]
                heapq.heapify(heap)

                result = []
                for _ in range(k):
                                result.append(heapq.heappop(heap)[1])
                return result
```

### 621. Task Scheduler (Med.)

- **Problem (English)**:
        - You are given tasks represented by uppercase letters and a non-negative cooldown `n`.
        - In one unit of time, the CPU may execute one task or stay idle.
        - Two identical tasks must be separated by at least `n` intervals.
        - Return the minimum time needed to finish all tasks.
- **題目（中文）**：
        - 給定由大寫字母表示的任務陣列，以及非負整數冷卻時間 `n`。
        - 每個時間單位 CPU 只能執行一個任務或保持閒置。
        - 兩個相同任務之間至少要相隔 `n` 個時間單位。
        - 請回傳完成所有任務所需的最少時間。

- **Examples**:
- **Constraints**:
  - `1 <= tasks.length <= 10^4`
  - tasks[i] is an uppercase English letter.
  - `0 <= n <= 100`

- **套路**：max-heap + cooldown queue
- **思路**：
        - 每個時間點都優先執行剩餘次數最多的任務，因為它最容易成為瓶頸。
        - 任務執行後若還有剩餘次數，就把它放進 cooldown 佇列，並標記「最早何時可再回 heap」。
        - 只要 heap 還有任務或 cooldown 還沒清空，就持續推進時間。
- **TC**：O(T log m)
        - `T` 是最終排程長度，`m` 是任務種類數；每個實際執行步驟最多涉及常數次 heap 操作。
- **SC**：O(m)
        - heap 與 cooldown 佇列中保存的都是任務種類級別的資訊。
- **其他思路**：
        - **數學公式法**：利用最高頻任務形成骨架，答案為 `max(len(tasks), (max_freq - 1) * (n + 1) + count_max)`。
- **解法比較**：
        - **heap 模擬**：優點是最通用，當題目變形成真實模擬時也能沿用。缺點是複雜度與程式碼都比公式法大。
        - **公式法**：優點是簡潔而且更快。缺點是必須先理解為什麼最高頻任務決定最小長度。
- **測試重點 (Testing)**：
        - **標準案例**：`tasks = ['A','A','A','B','B','B'], n = 2`，預期 `8`。
        - **無冷卻**：`n = 0` 時，答案應直接等於任務數量。
        - **單一任務大量重複**：例如 `['A','A','A','A']`，容易暴露 idle 計算錯誤。
        - **多個最高頻任務**：確認 `count_max` 的處理正確。

```python
import heapq
from collections import Counter, deque


def leastInterval(tasks, n):
                heap = [-count for count in Counter(tasks).values()]
                heapq.heapify(heap)
                cooldown = deque()
                time = 0

                while heap or cooldown:
                                time += 1

                                while cooldown and cooldown[0][0] == time:
                                                _, count = cooldown.popleft()
                                                heapq.heappush(heap, count)

                                if not heap:
                                                continue

                                count = heapq.heappop(heap) + 1
                                if count != 0:
                                                cooldown.append((time + n + 1, count))

                return time
```

### 253. Meeting Rooms II (Med.)

- **Problem (English)**:
        - Given meeting intervals, return the minimum number of rooms required so that all meetings can be held without overlap.
        - If one meeting ends exactly when another starts, they may reuse the same room.
- **題目（中文）**：
        - 給定多個會議區間，請回傳為了讓所有會議都能進行且不衝突，最少需要幾間會議室。
        - 若一個會議剛好在另一個會議開始時結束，則可共用同一間會議室。
- **Examples**:
        - Example 1: `intervals = [[0,30],[5,10],[15,20]]`
                - Output: `2`
        - Example 2: `intervals = [[7,10],[2,4]]`
                - Output: `1`
- **Constraints**:
        - `0 <= intervals.length <= 10^4`
        - `0 <= start_i < end_i <= 10^6`

- **套路**：min-heap 存進行中會議的結束時間
- **思路**：
        - 先依開始時間排序，確保會議按時間軸進入系統。
        - heap 頂端永遠是目前最早結束的會議；若它已經在下一場會議開始前結束，就可以釋放房間。
        - 當前 heap 大小就是同一時間正在使用的房間數，取整段過程中的最大值即可。
- **TC**：O(n log n)
        - 排序花 O(n log n)，之後每個會議最多做一次 push 與若干次 pop，總計仍是 O(n log n)。
- **SC**：O(n)
        - 最壞情況所有會議都重疊，heap 需要保存全部結束時間。
- **其他思路**：
        - **開始時間 / 結束時間雙指標**：分別排序 starts 與 ends，用兩個指標掃描也能求最大同時會議數。
- **解法比較**：
        - **heap**：優點是直觀，且很容易延伸到實際房間排程問題。缺點是需要理解 heap 保存的是結束時間而不是整個會議。
        - **雙指標**：優點是程式短。缺點是較偏技巧，不如 heap 寫法自然。
- **測試重點 (Testing)**：
        - **完全重疊**：例如 `[[0,30],[5,10],[15,20]]`，預期 `2`。
        - **完全不重疊**：應只需要 `1` 個房間。
        - **端點相接**：`[1,2]` 與 `[2,3]` 可重用同一房間。
        - **大量短會議穿插長會議**：驗證 heap 釋放邏輯是否正確。

```python
import heapq


def minMeetingRooms(intervals):
                if not intervals:
                                return 0

                intervals.sort(key=lambda interval: interval[0])
                heap = []
                max_rooms = 0

                for start, end in intervals:
                                while heap and heap[0] <= start:
                                                heapq.heappop(heap)
                                heapq.heappush(heap, end)
                                max_rooms = max(max_rooms, len(heap))

                return max_rooms
```

### 295. Find Median from Data Stream (Hard)

- **Problem (English)**:
        - Design a data structure that supports `addNum(num)` and `findMedian()`.
        - `addNum` inserts a number from the stream, and `findMedian` returns the median of all inserted numbers so far.
- **題目（中文）**：
        - 設計一個資料結構，支援 `addNum(num)` 與 `findMedian()`。
        - `addNum` 用來插入資料流中的數字，`findMedian` 則回傳目前所有已插入數字的中位數。

- **Examples**:
- **Constraints**:
  - `-10^5 <= num <= 10^5`
  - There will be at least one element in the data structure before calling findMedian.
  - At most 5 * 10^4 calls will be made to addNum and findMedian.

- **套路**：雙 heap 維持左右兩半
- **思路**：
        - `small` 用 max-heap 存較小的一半元素，`large` 用 min-heap 存較大的一半元素。
        - 每次先把新數字放進 `small`，再把 `small` 最大值搬到 `large`，可維持左右區間順序。
        - 若 `large` 比 `small` 多，就再搬回一個元素，確保 `small` 的數量永遠與 `large` 相等或多一個。
- **TC**：`addNum` O(log n)，`findMedian` O(1)
        - 插入時會做常數次 heap push / pop；查中位數只看兩個 heap 頂端。
- **SC**：O(n)
        - 所有插入過的數字都要保存在兩個 heap 中。
- **其他思路**：
        - **有序陣列 + 二分插入**：每次用 `bisect` 插入到正確位置，取中位數很直接，但插入要搬移元素。
- **解法比較**：
        - **雙 heap**：優點是插入與查詢都平衡，是這題標準解。缺點是要同時維護順序與尺寸平衡。
        - **有序陣列**：優點是好理解。缺點是 `addNum` 退化成 O(n)。
- **測試重點 (Testing)**：
        - **奇數個元素**：中位數是單一中間值。
        - **偶數個元素**：中位數是兩個中間值平均。
        - **含負數與重複值**：確認 heap 平衡不受值域影響。
        - **持續交錯插入大 / 小值**：檢查兩個 heap 的平衡邏輯。

```python
import heapq


class MedianFinder:
                def __init__(self):
                                self.small = []
                                self.large = []

                def addNum(self, num):
                                heapq.heappush(self.small, -num)
                                heapq.heappush(self.large, -heapq.heappop(self.small))

                                if len(self.large) > len(self.small):
                                                heapq.heappush(self.small, -heapq.heappop(self.large))

                def findMedian(self):
                                if len(self.small) > len(self.large):
                                                return -self.small[0]
                                return (-self.small[0] + self.large[0]) / 2
```

### 759. Employee Free Time (Hard)

- **Problem (English)**:
        - Each employee has a list of non-overlapping working intervals, and each employee's intervals are already sorted.
        - Return the finite intervals representing common, positive-length free time for all employees, also in sorted order.
        - Infinite intervals such as `[-inf, x]` or `[y, inf]` are not part of the answer.
- **題目（中文）**：
        - 每位員工都有一份已排序且彼此不重疊的工作時間區間列表。
        - 請找出所有員工共同的、長度為正且有限的空閒區間，並依序回傳。
        - 像 `[-inf, x]` 或 `[y, inf]` 這種 infinite interval / 無限區間不算答案。
- **Examples**:
        - Example 1: `schedule = [[[1,2],[5,6]],[[1,3]],[[4,10]]]`
                - Output: `[[3,4]]`
        - Example 2: `schedule = [[[1,3],[6,7]],[[2,4]],[[2,5],[9,12]]]`
                - Output: `[[5,6],[7,9]]`
- **Constraints**:
        - `1 <= schedule.length <= 50`
        - `1 <= schedule[i].length <= 50`
        - `0 <= start < end <= 10^8`
        - Intervals of each employee are sorted and non-overlapping.

- **套路**：k-way merge + 區間合併
- **思路**：
        - 每位員工自己的區間已排序，所以可以像合併 K 個有序串列一樣，用 min-heap 取目前最早開始的區間。
        - 維護目前已合併到哪個結束時間 `prev_end`；若下一段區間的 `start > prev_end`，中間就是共同空閒時間。
        - 每次從某位員工拿出一段後，再把他的下一段區間推進 heap。
- **TC**：O(N log k)
        - `N` 是所有區間總數，`k` 是員工數；每段區間各進出 heap 一次。
- **SC**：O(k)
        - heap 中同時最多只會有每位員工的一段目前候選區間。
- **其他思路**：
        - **攤平後整體排序再合併**：把所有區間先展平成一個陣列，排序後做標準 merge interval。
- **解法比較**：
        - **k-way merge**：優點是直接利用每位員工區間已排序的條件。缺點是狀態稍微多一點。
        - **攤平排序**：優點是實作直觀。缺點是會丟掉原本分組已排序的資訊。
- **測試重點 (Testing)**：
        - **多位員工行程交錯**：確認空閒區間能正確被找出。
        - **完全沒有共同空閒**：應回傳空陣列。
        - **只有一段共同空閒**：確認邊界 `[prev_end, start]` 正確。
        - **某位員工只有一段行程**：確認 heap 推進邏輯仍正常。

```python
import heapq


def employeeFreeTime(schedule):
                if not schedule:
                                return []

                heap = []
                for employee, intervals in enumerate(schedule):
                                start, end = intervals[0]
                                heapq.heappush(heap, (start, end, employee, 0))

                _, prev_end, _, _ = heap[0]
                result = []

                while heap:
                                start, end, employee, index = heapq.heappop(heap)

                                if start > prev_end:
                                                result.append([prev_end, start])

                                prev_end = max(prev_end, end)

                                if index + 1 < len(schedule[employee]):
                                                next_start, next_end = schedule[employee][index + 1]
                                                heapq.heappush(heap, (next_start, next_end, employee, index + 1))

                return result
```

### 362. Design Hit Counter (Med.)

- **Problem (English)**:
        - Design a hit counter that counts the number of hits received in the past 5 minutes (the past 300 seconds).
        - Timestamps are given with seconds granularity, calls happen in chronological order, and multiple hits may happen at the same timestamp.
        - Implement `HitCounter()`, `hit(timestamp)`, and `getHits(timestamp)`.
- **題目（中文）**：
        - 設計一個 hit counter，用來統計最近 5 分鐘內，也就是過去 300 秒內的 hit 次數。
        - `timestamp` 以秒為單位，所有呼叫都會依時間先後順序發生，同一秒內也可能出現多次 hit。
        - 你需要實作 `HitCounter()`、`hit(timestamp)` 與 `getHits(timestamp)`。
- **Examples**:
        - Example 1: `hit(1)`, `hit(2)`, `hit(3)`, `getHits(4)`, `hit(300)`, `getHits(300)`, `getHits(301)`
                - Output: `[null,null,null,3,null,4,3]`
- **Constraints**:
        - `1 <= timestamp <= 2 * 10^9`
        - Calls to `hit` and `getHits` are made in chronological order.
        - At most `300` calls will be made to `hit` and `getHits`.

- **套路**：queue 保存最近 300 秒內的 hit
- **思路**：
        - 每次 `hit` 只要把時間戳塞進 queue 尾端。
        - 查詢前把所有 `<= timestamp - 300` 的舊資料從 queue 頭端清掉。
        - 清理完後 queue 的長度，就是最近 5 分鐘內的 hit 次數。
- **TC**：均攤 O(1)
        - 每個時間戳最多只會進 queue 一次、出 queue 一次，因此攤提下每個操作都是常數時間。
- **SC**：O(h)
        - `h` 是最近 300 秒內的 hit 數量；若同一秒大量請求，queue 會保存全部紀錄。
- **其他思路**：
        - **固定 300 格環形桶**：每一秒對應一個桶，保存該秒時間戳與計數，空間固定 O(300)。
- **解法比較**：
        - **queue**：優點是最好理解，面對不固定 hit 量也很自然。缺點是高流量下空間可能變大。
        - **環形桶**：優點是空間固定。缺點是要多維護覆寫舊桶與時間戳對齊邏輯。
- **測試重點 (Testing)**：
        - **同一秒多次 hit**：應全部被計入。
        - **剛好跨 300 秒邊界**：確認 `timestamp - 300` 的資料會被移除。
        - **長時間沒請求**：queue 應能被清空。
        - **短時間爆量請求**：確認均攤刪除邏輯仍正確。

```python
from collections import deque


class HitCounter:
                def __init__(self):
                                self.queue = deque()

                def hit(self, timestamp):
                                self.queue.append(timestamp)

                def getHits(self, timestamp):
                                while self.queue and self.queue[0] <= timestamp - 300:
                                                self.queue.popleft()
                                return len(self.queue)
```
