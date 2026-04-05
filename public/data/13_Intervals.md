# 十三、Intervals（區間問題）

## 題目目錄

- [56. Merge Intervals (Med.)](#56-merge-intervals-med)
- [57. Insert Interval (Med.)](#57-insert-interval-med)
- [252. Meeting Rooms (Easy)](#252-meeting-rooms-easy)

## 通用套路

**排序後逐一處理**：大多數區間問題的關鍵是先決定排序基準，再用單趟掃描處理相鄰區間關係。

---

### 56. Merge Intervals (Med.)

- **Problem (English)**:
	- You are given an array of intervals where `intervals[i] = [start_i, end_i]`.
	- Merge every pair of overlapping intervals and return the resulting non-overlapping intervals that fully cover the original ranges.
- **題目（中文）**：
	- 給定一個區間陣列，其中 `intervals[i] = [start_i, end_i]`。
	- 請把所有重疊區間合併，並回傳合併後的非重疊區間，完整涵蓋原本所有範圍。

- **Examples**:
  - Example 1: `intervals = [[1,3],[2,6],[8,10],[15,18]]`
    - Output: `[[1,6],[8,10],[15,18]]`
    - Explanation: Since intervals [1,3] and [2,6] overlap, merge them into [1,6].
  - Example 2: `intervals = [[1,4],[4,5]]`
    - Output: `[[1,5]]`
    - Explanation: Intervals [1,4] and [4,5] are considered overlapping.
  - Example 3: `intervals = [[4,7],[1,4]]`
    - Output: `[[1,7]]`
    - Explanation: Intervals [1,4] and [4,7] are considered overlapping.
- **Constraints**:
  - `1 <= intervals.length <= 10^4`
  - `intervals[i].length == 2`
  - `0 <= starti <= endi <= 10^4`

- **套路**：排序後線性合併
- **思路**：
	- 先按區間起點排序，這樣所有可能重疊的區間一定會相鄰出現。
	- 維護答案陣列 `merged` 的最後一段區間；若新區間起點小於等於 `merged[-1][1]`，就更新尾端結束點。
	- 若不重疊，代表這是新的一段區間，直接加入答案。
- **TC**：O(n log n)
	- 排序佔主要成本，排序後的單趟合併只有 O(n)。
- **SC**：O(n)
	- 最壞情況下沒有任何區間重疊，答案陣列需要保留全部區間。
- **其他思路**：
	- **掃描線**：把區間起終點拆成事件做掃描，但通常更複雜，適合更進階的區間統計問題。
	- **原地合併**：若允許修改原陣列，也可以用寫指標覆蓋舊資料，邏輯與標準解相近。
- **解法比較**：
	- **排序 + 合併**：優點是最標準、可讀性最好，面試辨識度高。缺點是一定要先排序。
	- **掃描線**：優點是可延伸到覆蓋次數、重疊長度等問題。缺點是這題屬於過度設計。
- **測試重點 (Testing)**：
	- **基本合併**：`[[1,3],[2,6],[8,10],[15,18]]`，預期 `[[1,6],[8,10],[15,18]]`。
	- **端點相接也算重疊**：`[[1,4],[4,5]]`，預期 `[[1,5]]`。
	- **完全不重疊**：驗證原順序經排序後仍會完整保留。
	- **單一區間**：`[[1,2]]`，預期原樣回傳。
	- **一段大區間包住多段小區間**：驗證尾端更新邏輯正確。

```python
def merge(intervals):
		intervals.sort(key=lambda interval: interval[0])
		merged = []

		for start, end in intervals:
				if not merged or start > merged[-1][1]:
						merged.append([start, end])
				else:
						merged[-1][1] = max(merged[-1][1], end)

		return merged
```

### 57. Insert Interval (Med.)

- **Problem (English)**:
	- You are given a list of non-overlapping intervals sorted by start time, along with a new interval.
	- Insert the new interval into the list and merge if necessary so that the final list remains sorted and non-overlapping.
	- You do not need to modify the original array in place; returning a new array is allowed.
- **題目（中文）**：
	- 給定一個依起點排序、彼此不重疊的區間陣列，以及一個新的區間。
	- 請把新區間插入原本的列表中，必要時進行合併，使最後結果仍然有序且不重疊。
	- 你不需要原地修改原陣列，可以建立並回傳新的結果陣列。

- **Examples**:
  - Example 1: `intervals = [[1,3],[6,9]], newInterval = [2,5]`
    - Output: `[[1,5],[6,9]]`
  - Example 2: `intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]`
    - Output: `[[1,2],[3,10],[12,16]]`
    - Explanation: Because the new interval [4,8] overlaps with [3,5],[6,7],[8,10].
- **Constraints**:
  - `0 <= intervals.length <= 10^4`
  - `intervals[i].length == 2`
  - `0 <= starti <= endi <= 10^5`
  - intervals is sorted by starti in ascending order.
  - `newInterval.length == 2`
  - `0 <= start <= end <= 10^5`

- **套路**：分三段處理區間插入
- **思路**：
	- 原陣列已依起點排序，因此可以把流程拆成三段：左邊不重疊、中央重疊、右邊不重疊。
	- 左邊不重疊區間可直接加入答案。
	- 中央所有與 `newInterval` 重疊的區間，持續把 `newInterval` 擴張成合併後的區間。
	- 最後接上右邊不重疊區間即可。
- **TC**：O(n)
	- 最多只線性掃描每個區間一次，不需要重新排序。
- **SC**：O(n)
	- 輸出答案陣列在最壞情況下會包含全部原區間加上新區間。
- **其他思路**：
	- **先插入再做 Merge Intervals**：邏輯簡單，但會把本來已排序的資訊浪費掉。TC: O(n log n), SC: O(n)。
	- **原地覆寫**：能減少額外陣列，但實作複雜度更高。
- **解法比較**：
	- **三段線性掃描**：優點是效率最好，也最能利用原輸入條件。缺點是需要把區間分段思考。
	- **插入後重新合併**：優點是容易從前一題延伸。缺點是多做一次排序，效率較差。
- **測試重點 (Testing)**：
	- **基本插入並合併**：`intervals = [[1,3],[6,9]], newInterval = [2,5]`，預期 `[[1,5],[6,9]]`。
	- **跨多段區間合併**：驗證中央重疊段能持續擴張。
	- **插在最前面**：如 `newInterval = [0,0]`。
	- **插在最後面**：如 `newInterval = [10,12]`。
	- **完全包住所有區間**：確保能合併成單一大區間。

```python
def insert(intervals, newInterval):
		result = []
		i = 0

		while i < len(intervals) and intervals[i][1] < newInterval[0]:
				result.append(intervals[i])
				i += 1

		while i < len(intervals) and intervals[i][0] <= newInterval[1]:
				newInterval[0] = min(newInterval[0], intervals[i][0])
				newInterval[1] = max(newInterval[1], intervals[i][1])
				i += 1

		result.append(newInterval)
		result.extend(intervals[i:])
		return result
```

### 252. Meeting Rooms (Easy)

- **Problem (English)**:
	- You are given meeting time intervals where `intervals[i] = [start_i, end_i]`.
	- Determine whether one person can attend every meeting without any time conflict.
- **題目（中文）**：
	- 給定多個會議時間區間，其中 `intervals[i] = [start_i, end_i]`。
	- 請判斷一個人是否能夠參加所有會議，而不發生時間衝突。
- **Examples**:
	- Example 1: `intervals = [[0,30],[5,10],[15,20]]`
		- Output: `false`
	- Example 2: `intervals = [[7,10],[2,4]]`
		- Output: `true`
- **Constraints**:
	- `0 <= intervals.length <= 10^4`
	- `intervals[i].length == 2`
	- `0 <= start_i < end_i <= 10^6`

- **套路**：排序後檢查相鄰區間是否重疊
- **思路**：
	- 先按會議開始時間排序。
	- 若某個會議的開始時間 `<` 前一個會議的結束時間，表示時間衝突，無法全部參加。
	- 若整趟掃描都沒有衝突，就代表只需要一個人依序參加全部會議即可。
- **TC**：O(n log n)
	- 排序需要 O(n log n)，排序後只需一次線性檢查。
- **SC**：O(1)
	- 若不計排序內部空間，只使用固定額外變數。
- **其他思路**：
	- **分離開始時間與結束時間排序**：可用於 Meeting Rooms II，但這題只需檢查是否重疊，沒必要拆兩個陣列。
	- **暴力兩兩比較**：直接比每一對區間是否衝突。TC: O(n^2), SC: O(1)。
- **解法比較**：
	- **排序後相鄰檢查**：優點是最簡單、最直觀。缺點是需要接受「只要看相鄰」建立在排序前提之上。
	- **暴力比較**：優點是容易想到。缺點是效率差很多。
- **測試重點 (Testing)**：
	- **明顯重疊**：`[[0,30],[5,10],[15,20]]`，預期 `False`。
	- **完全不重疊**：`[[7,10],[2,4]]`，預期 `True`。
	- **端點相接**：`[[1,2],[2,3]]`，預期 `True`，因為不算重疊。
	- **單一會議**：一定可參加。
	- **空輸入**：應回傳 `True`。

```python
def canAttendMeetings(intervals):
		intervals.sort(key=lambda interval: interval[0])
		for i in range(1, len(intervals)):
				if intervals[i][0] < intervals[i - 1][1]:
						return False
		return True
```
