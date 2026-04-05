# 十二、Greedy（貪心法）

## 題目目錄

- [55. Jump Game (Med.)](#55-jump-game-med)
- [134. Gas Station (Med.)](#134-gas-station-med)
- [435. Non-overlapping Intervals (Med.)](#435-non-overlapping-intervals-med)

## 通用套路

**核心**：每一步都做當下看起來最好的選擇，並證明這個局部最優不會破壞全域最優。

---

### 55. Jump Game (Med.)

- **Problem (English)**:
	- You are given an array of non-negative integers where each value tells you the farthest distance you may jump from that index.
	- Starting at index `0`, determine whether you can reach the last index.
- **題目（中文）**：
	- 給定一個非負整數陣列，每個元素表示你從該位置最多可以往前跳多遠。
	- 請判斷從索引 `0` 出發，是否能夠抵達最後一個索引。

- **Examples**:
  - Example 1: `nums = [2,3,1,1,4]`
    - Output: `true`
    - Explanation: Jump 1 step from index 0 to 1, then 3 steps to the last index.
  - Example 2: `nums = [3,2,1,0,4]`
    - Output: `false`
    - Explanation: You will always arrive at index 3 no matter what. Its maximum jump length is 0, which makes it impossible to reach the last index.
- **Constraints**:
  - `1 <= nums.length <= 10^4`
  - `0 <= nums[i] <= 10^5`

- **套路**：貪心維護最遠可達位置
- **思路**：
	- 從左到右掃描陣列，維護目前能到達的最遠索引 `farthest`。
	- 如果掃描到索引 `i` 時發現 `i > farthest`，代表前面的跳躍無法覆蓋這一格，直接失敗。
	- 每次更新 `farthest = max(farthest, i + nums[i])`；只要最後能覆蓋末尾索引，就表示可達。
- **TC**：O(n)
	- 每個位置只會被掃描一次，且每一步只做 O(1) 的比較與更新。
- **SC**：O(1)
	- 只需要 `farthest` 與迴圈索引等常數額外空間，不需要額外陣列。
- **其他思路**：
	- **DP 判斷可達性**：定義 `dp[i]` 表示第 `i` 格是否可達，對每格回頭看前面哪些點能跳過來。TC: O(n^2), SC: O(n)。
	- **反向貪心**：從終點往前找能到達目前目標的位置，持續把目標往左縮。TC: O(n), SC: O(1)。
- **解法比較**：
	- **正向貪心**：優點是最好寫、最直觀，且容易在面試中解釋「最遠覆蓋範圍」的概念。缺點是需要理解為什麼只追蹤最遠位置就足夠。
	- **反向貪心**：優點是證明也很漂亮，從終點反推起點是否可成。缺點是對初學者來說不如正向掃描自然。
	- **DP**：優點是狀態定義直接。缺點是時間複雜度較差，通常不是面試首選。
- **測試重點 (Testing)**：
	- **正常可達**：`nums = [2, 3, 1, 1, 4]`，預期 `True`。
	- **被 0 卡住**：`nums = [3, 2, 1, 0, 4]`，預期 `False`。
	- **單一元素**：`nums = [0]`，預期 `True`，因為起點同時就是終點。
	- **一開始就跳不動**：`nums = [0, 2]`，預期 `False`。
	- **大跳直接到終點**：`nums = [5, 0, 0, 0, 0]`，預期 `True`。

```python
def canJump(nums):
		farthest = 0
		for i, jump in enumerate(nums):
				if i > farthest:
						return False
				farthest = max(farthest, i + jump)
		return True
```

### 134. Gas Station (Med.)

- **Problem (English)**:
	- There are `n` gas stations arranged in a circle.
	- At station `i`, you can fill `gas[i]` units, and it costs `cost[i]` units to travel to the next station.
	- Starting with an empty tank, return the unique starting station index that lets you complete the circuit, or `-1` if it cannot be done.
- **題目（中文）**：
	- 有 `n` 個加油站沿環狀路線排列。
	- 在第 `i` 站可以加 `gas[i]` 單位的油，前往下一站需要花費 `cost[i]` 單位。
	- 初始油箱為空，請回傳能繞完整圈的唯一起點索引；如果不存在，回傳 `-1`。

- **Examples**:
  - Example 1: `gas = [1,2,3,4,5], cost = [3,4,5,1,2]`
    - Output: `3`
    - Explanation: Start at station 3 (index 3) and fill up with 4 unit of gas. Your tank = 0 + 4 = 4
Travel to station 4. Your tank = 4 - 1 + 5 = 8
Travel to station 0. Your tank = 8 - 2 + 1 = 7
Travel to station 1. Your tank = 7 - 3 + 2 = 6
Travel to station 2. Your tank = 6 - 4 + 3 = 5
Travel to station 3. The cost is 5. Your gas is just enough to travel back to station 3.
Therefore, return 3 as the starting index.
  - Example 2: `gas = [2,3,4], cost = [3,4,3]`
    - Output: `-1`
    - Explanation: You can't start at station 0 or 1, as there is not enough gas to travel to the next station.
Let's start at station 2 and fill up with 4 unit of gas. Your tank = 0 + 4 = 4
Travel to station 0. Your tank = 4 - 3 + 2 = 3
Travel to station 1. Your tank = 3 - 3 + 3 = 3
You cannot travel back to station 2, as it requires 4 unit of gas but you only have 3.
Therefore, you can't travel around the circuit once no matter where you start.
- **Constraints**:
  - `n == gas.length == cost.length`
  - `1 <= n <= 10^5`
  - `0 <= gas[i], cost[i] <= 10^4`
  - The input is generated such that the answer is unique.

- **套路**：貪心 + 前綴盈虧重置起點
- **思路**：
	- 先檢查總油量是否小於總成本；若 `sum(gas) < sum(cost)`，不論怎麼選起點都不可能繞一圈。
	- 掃描每個站點時維護目前油箱餘額 `tank += gas[i] - cost[i]`。
	- 一旦 `tank < 0`，代表從目前起點到 `i` 之間的任何站都不可能成為合法起點，因此可直接把起點設為 `i + 1`。
- **TC**：O(n)
	- 只做兩次線性累積：一次總量判斷，一次單趟掃描找起點。
- **SC**：O(1)
	- 只使用 `start`、`tank` 與總量等常數變數。
- **其他思路**：
	- **暴力枚舉每個起點**：從每一站出發模擬完整一圈，看是否能回到原點。TC: O(n^2), SC: O(1)。
	- **前綴和最小值法**：將每站淨收益做前綴和，從最小前綴和之後的位置開始。TC: O(n), SC: O(1) 或 O(n) 視寫法而定。
- **解法比較**：
	- **單趟貪心**：優點是面試最標準、推導簡潔，利用「失敗區間整段淘汰」的性質直接得到答案。缺點是第一次看到時較不容易自己證明。
	- **前綴和法**：優點是數學觀點清楚。缺點是對大部分面試官來說，不如單趟貪心常見。
	- **暴力模擬**：優點是容易想到。缺點是時間太差，輸入大時會超時。
- **測試重點 (Testing)**：
	- **標準可行案例**：`gas = [1,2,3,4,5], cost = [3,4,5,1,2]`，預期 `3`。
	- **總量不足**：`gas = [2,3,4], cost = [3,4,3]`，預期 `-1`。
	- **起點在最後一站附近**：驗證重置起點邏輯是否正確。
	- **只有一站且剛好夠**：`gas = [5], cost = [5]`，預期 `0`。
	- **途中多次歸零**：確保 `tank == 0` 時不會誤判失敗。

```python
def canCompleteCircuit(gas, cost):
		if sum(gas) < sum(cost):
				return -1

		start = 0
		tank = 0
		for i in range(len(gas)):
				tank += gas[i] - cost[i]
				if tank < 0:
						start = i + 1
						tank = 0
		return start
```

### 435. Non-overlapping Intervals (Med.)

- **Problem (English)**:
	- You are given a list of intervals.
	- Remove the minimum number of intervals so that the remaining intervals do not overlap.
	- Intervals that only touch at an endpoint are considered non-overlapping.
- **題目（中文）**：
	- 給定一組區間，請移除最少數量的區間，使剩下的區間彼此不重疊。
	- 如果兩個區間只是端點相接，視為不重疊。

- **Examples**:
  - Example 1: `intervals = [[1,2],[2,3],[3,4],[1,3]]`
    - Output: `1`
    - Explanation: [1,3] can be removed and the rest of the intervals are non-overlapping.
  - Example 2: `intervals = [[1,2],[1,2],[1,2]]`
    - Output: `2`
    - Explanation: You need to remove two [1,2] to make the rest of the intervals non-overlapping.
  - Example 3: `intervals = [[1,2],[2,3]]`
    - Output: `0`
    - Explanation: You don't need to remove any of the intervals since they're already non-overlapping.
- **Constraints**:
  - `1 <= intervals.length <= 10^5`
  - `intervals[i].length == 2`
  - `-5 * 10^4 <= starti < endi <= 5 * 10^4`

- **套路**：按結束點排序的區間貪心
- **思路**：
	- 目標是移除最少區間，等價於保留最多不重疊區間。
	- 若要保留最多區間，就應優先選「結束得最早」的區間，這樣能留給後面的區間最多空間。
	- 先按結束點排序，掃描時若當前區間起點 `< prev_end`，代表和前面保留的區間重疊，只能移除它；否則更新 `prev_end`。
- **TC**：O(n log n)
	- 排序需要 O(n log n)，排序後的單趟掃描只需 O(n)。
- **SC**：O(1)
	- 若不計排序演算法的內部空間，只使用常數額外變數。
- **其他思路**：
	- **DP 最長不重疊子序列**：定義 `dp[i]` 為以第 `i` 個區間結尾時最多可保留幾個區間。TC: O(n^2), SC: O(n)。
	- **按起點排序後遇到重疊保留較短結尾者**：本質上仍是貪心，只是實作角度不同。TC: O(n log n), SC: O(1)。
- **解法比較**：
	- **按結束點排序的貪心**：優點是證明最乾淨，也是經典區間排程模板。缺點是需要先理解為何不是按起點排序。
	- **按起點排序的變形貪心**：優點是有些人更順手。缺點是狀態更新較繞，不如按結束點寫法清楚。
	- **DP**：優點是直觀。缺點是時間較慢，面試通常不會選它。
- **測試重點 (Testing)**：
	- **只有一個衝突**：`[[1,2],[2,3],[3,4],[1,3]]`，預期 `1`。
	- **全部重疊**：`[[1,2],[1,2],[1,2]]`，預期 `2`。
	- **完全不重疊**：`[[1,2],[2,3]]`，預期 `0`。
	- **巢狀區間**：`[[1,10],[2,3],[3,4],[4,5]]`，驗證是否會保留短區間。
	- **負數端點**：確認排序與比較不依賴正整數假設。

```python
def eraseOverlapIntervals(intervals):
		intervals.sort(key=lambda interval: interval[1])
		removed = 0
		prev_end = intervals[0][1]

		for start, end in intervals[1:]:
				if start < prev_end:
						removed += 1
				else:
						prev_end = end

		return removed
```
