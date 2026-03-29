# 十三、Intervals（區間問題）

## 題目目錄

- [56. Merge Intervals (Med.)](#56-merge-intervals-med)
- [57. Insert Interval (Med.)](#57-insert-interval-med)
- [252. Meeting Rooms (Easy)](#252-meeting-rooms-easy)

## 通用套路

**排序後逐一處理**：大多數區間問題的關鍵是先決定排序基準，再用單趟掃描處理相鄰區間關係。

---

### 56. Merge Intervals (Med.)

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
