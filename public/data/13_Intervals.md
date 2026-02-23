# 十三、Intervals（區間問題）

## 通用套路

**排序後逐一處理**：大多數區間問題第一步都是排序（按起點或終點），然後逐一比較相鄰區間。

---

### 37. Merge Intervals (Med.)

- **套路**：排序 + 合併
- **思路**：按起點排序後，逐一檢查是否與前一個重疊。重疊就合併（取較大的終點），不重疊就加入結果。
- **💡 白話文解說**：Anagram 就是「字母組成完全一樣，只是順序不同」的字串。我們把每個字串拿去「按字母排序」，這樣只要是同一組的，排序完長得都一模一樣！我們就把這些長得一樣的東西丟進同一個籃子裡收集起來就好。
- **複雜度**：O(n·log n) / O(n)

```python
def merge(intervals):
    intervals.sort()
    merged = [intervals[0]]
    for start, end in intervals[1:]:
        if start <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    return merged
```

### 38. Insert Interval (Med.)

- **套路**：三階段處理
- **💡 白話文解說**：突然被安插了一個外來的全新區間。先安安穩穩放所有在這區間之前的事情。接著，只要有牽扯到這個新區間的人，就把它全部融合吞噬掉，變成一個無敵大行程，最後再把剩下不相干的後續事件接上去。
- **思路**：(1) 加入所有在 newInterval 之前的區間 (2) 合併所有重疊的 (3) 加入剩餘的。
- **複雜度**：O(n) / O(n)

```python
def insert(intervals, newInterval):
    result = []
    i = 0
    # 階段 1：加入在 newInterval 之前的
    while i < len(intervals) and intervals[i][1] < newInterval[0]:
        result.append(intervals[i])
        i += 1
    # 階段 2：合併重疊的
    while i < len(intervals) and intervals[i][0] <= newInterval[1]:
        newInterval[0] = min(newInterval[0], intervals[i][0])
        newInterval[1] = max(newInterval[1], intervals[i][1])
        i += 1
    result.append(newInterval)
    # 階段 3：加入剩餘的
    result.extend(intervals[i:])
    return result
```

### 126. Meeting Rooms (Easy)

- **套路**：排序 + 檢查重疊
- **💡 白話文解說**：非常直覺，只要把所有開會時間按順序排好，然後看看這陣列有沒有任何兩場會議「頭尾互相吃字交疊」了，如果有那就是衝堂了，參加不完！
- **思路**：按起點排序，檢查是否有任何相鄰區間重疊 (前一個的結束 > 下一個的開始)。
- **複雜度**：O(n·log n) / O(1)

```python
def canAttendMeetings(intervals):
    intervals.sort()
    for i in range(1, len(intervals)):
        if intervals[i][0] < intervals[i-1][1]:
            return False
    return True
```

---
