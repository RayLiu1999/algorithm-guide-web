# 一、Array & Hashing（陣列與雜湊表）

## 題目目錄

- [1. Two Sum (Easy)](#1-two-sum-easy)
- [383. Ransom Note (Easy)](#383-ransom-note-easy)
- [409. Longest Palindrome (Easy)](#409-longest-palindrome-easy)
- [169. Majority Element (Easy)](#169-majority-element-easy)
- [217. Contains Duplicate (Easy)](#217-contains-duplicate-easy)
- [242. Valid Anagram (Easy)](#242-valid-anagram-easy)
- [121. Best Time to Buy and Sell Stock (Easy)](#121-best-time-to-buy-and-sell-stock-easy)
- [238. Product of Array Except Self (Med.)](#238-product-of-array-except-self-med)
- [49. Group Anagrams (Med.)](#49-group-anagrams-med)
- [53. Maximum Subarray (Med.)](#53-maximum-subarray-med)
- [525. Contiguous Array (Med.)](#525-contiguous-array-med)
- [560. Subarray Sum Equals K (Med.)](#560-subarray-sum-equals-k-med)
- [128. Longest Consecutive Sequence (Med.)](#128-longest-consecutive-sequence-med)
- [8. String to Integer - atoi (Med.)](#8-string-to-integer---atoi-med)
- [54. Spiral Matrix (Med.)](#54-spiral-matrix-med)
- [48. Rotate Image (Med.)](#48-rotate-image-med)
- [73. Set Matrix Zeroes (Med.)](#73-set-matrix-zeroes-med)
- [75. Sort Colors (Med.)](#75-sort-colors-med)
- [136. Single Number (Easy)](#136-single-number-easy)
- [179. Largest Number (Med.)](#179-largest-number-med)
- [189. Rotate Array (Med.)](#189-rotate-array-med)
- [41. First Missing Positive (Hard)](#41-first-missing-positive-hard)
- [271. Encode and Decode Strings (Med.)](#271-encode-and-decode-strings-med)
- [380. Insert Delete GetRandom O(1) (Med.)](#380-insert-delete-getrandom-o1-med)

## 通用套路

**Hash Map 反查法**：當題目要你「找到某個配對/目標」，用 Hash Map 把已經看過的值存起來，每次新元素進來就查表，達成 O(1) 查詢。

**Hash Set 去重法**：需要判斷是否存在重複、或快速判斷某元素是否出現過。

**計數法 (Counter)**：統計每個元素出現的次數，常用於 Anagram、Majority 類型題。

**前綴和 (Prefix Sum)**：需要快速計算子陣列的和時，先算出前綴和陣列，讓任意區間和變成 O(1)。

```python
# 套路模板：Hash Map 反查
def two_sum_pattern(nums, target):
  seen = {}  # 值 → 索引
  for i, num in enumerate(nums):
    complement = target - num
    if complement in seen:
      return [seen[complement], i]
    seen[num] = i

# 套路模板：前綴和 + Hash Map
def prefix_sum_pattern(nums, k):
  count = 0
  prefix = 0
  seen = {0: 1}  # 前綴和 → 出現次數
  for num in nums:
    prefix += num
    if prefix - k in seen:
      count += seen[prefix - k]
    seen[prefix] = seen.get(prefix, 0) + 1
  return count
```

---

### 1. Two Sum (Easy)

- **Problem (English)**:
  - Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.
  - You may assume that each input would have exactly one solution, and you may not use the same element twice.
  - You can return the answer in any order.
- **題目（中文）**：
  - 給你一個整數陣列 `nums` 和一個整數 `target`，請找出兩個數字，使它們的總和等於 `target`，並回傳這兩個數字的索引。
  - 你可以假設每組輸入都只有一個解，而且不能使用同一個元素兩次。
  - 你可以用任何順序回傳答案。

- **Examples**:
  - Example 1: `nums = [2,7,11,15], target = 9`
    - Output: `[0,1]`
    - Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
  - Example 2: `nums = [3,2,4], target = 6`
    - Output: `[1,2]`
  - Example 3: `nums = [3,3], target = 6`
    - Output: `[0,1]`
- **Constraints**:
  - `2 <= nums.length <= 10^4`
  - `-10^9 <= nums[i] <= 10^9`
  - `-10^9 <= target <= 10^9`
  - Only one valid answer exists.

- **套路**： Hash Map 反查法
- **思路**：
  - 遍歷陣列時，不直接找另一個數字，而是問 Hash Map：「我的另一半（target - num）在不在你家？」。
  - 如果在，直接回傳兩人的索引；如果不在，就把「自己」存入 Map，讓後面的人來找。
- **TC**：O(n)
  - 只需要掃描陣列一次。Hash Map 的查詢與插入平均皆為 O(1)。
- **SC**：O(n)
  - 最壞情況下，需要把除最後一個數字外的所有數字都存進 Hash Map。
  - 註：因為數字範圍通常極大，這裡不使用 m (種類) 分析，直接以 n (總數) 為準。
- **其他思路**：
  - 暴力解 (Brute Force)：兩層 for 迴圈硬找。TC: O(n^2), SC: O(1)。
  - 排序 + 雙指標：先排序再從兩頭找。TC: O(n \log n), SC: O(1) (取決於排序演算法)。
- **解法比較**：
  - Hash Map：優點：速度最快 (O(n))。缺點：需要額外的記憶體空間。
  - 排序 + 雙指標：優點：節省空間。缺點：會打亂原始索引（若題目要求回傳索引，需額外處理），且速度較慢。
- **測試重點 (Testing)**：
  - **重複數字**：傳入 `[3, 3], target = 6`，應回傳 `[0, 1]`（確保不會自己找自己）。
  - **無解案例**：傳入 `[1, 2, 3], target = 7`，應回傳 `[]`。
  - **負數案例**：傳入 `[-1, -3], target = -4`，應回傳 `[0, 1]`。

```python
# 套路模板：Hash Map 反查
def two_sum_pattern(nums, target):
  seen = {}  # 值 → 索引
  for i, num in enumerate(nums):
    complement = target - num
    if complement in seen:
      return [seen[complement], i]
    seen[num] = i
```

---

### 383. Ransom Note (Easy)

- **Problem (English)**:
  - Given two strings `ransomNote` and `magazine`, return `true` if `ransomNote` can be built using letters from `magazine`.
  - Each letter in `magazine` may be used at most once.
- **題目（中文）**：
  - 給定兩個字串 `ransomNote` 與 `magazine`，請判斷是否能用 `magazine` 中的字母拼出 `ransomNote`。
  - `magazine` 中的每個字母最多只能使用一次。

- **Examples**:
  - Example 1: `ransomNote = "a", magazine = "b"`
    - Output: `false`
  - Example 2: `ransomNote = "aa", magazine = "ab"`
    - Output: `false`
  - Example 3: `ransomNote = "aa", magazine = "aab"`
    - Output: `true`
- **Constraints**:
  - `1 <= ransomNote.length, magazine.length <= 10^5`
  - ransomNote and magazine consist of lowercase English letters.

- **套路**：字元計數
- **思路**：
  - 這題只在乎每個字元的數量夠不夠，不在乎順序，所以先統計 `magazine` 每個字元可提供的庫存最直接。
  - 之後逐字掃描 `ransomNote`，每用掉一個字元就把對應庫存扣 1。
  - 只要某個字元在需要時已經沒有庫存，就可以立刻判定無法構成。
- **TC**：O(m + n)
  - `m`、`n` 分別是 `ransomNote` 與 `magazine` 長度；建表一次、檢查一次。
- **SC**：O(1)
  - 若字元集固定為小寫英文字母，計數表大小固定；若字元集不固定，則與不同字元種類數有關。
- **其他思路**：
  - **排序 + 雙指標比對**：先排序兩字串，再用雙指標嘗試匹配 `ransomNote` 所需字元。TC: O(m log m + n log n), SC: 視排序實作而定。
- **解法比較**：
  - **計數表**：優點是線性時間，最符合題目本質；缺點是要維護字元頻率。
  - **排序 + 雙指標**：優點是不需 Counter；缺點是較慢，而且破壞原字串順序。
- **測試重點 (Testing)**：
  - **字元足夠**：`ransomNote = "aa", magazine = "aab"`，預期 `True`。
  - **字元不足**：`ransomNote = "aa", magazine = "ab"`，預期 `False`。
  - **`ransomNote` 為空**：應回傳 `True`。
  - **重複字元剛好用完**：確認扣庫存後不會多算。

```python
from collections import Counter


def canConstruct(ransomNote, magazine):
  count = Counter(magazine)

  for char in ransomNote:
    if count[char] == 0:
      return False
    count[char] -= 1

  return True
```

### 409. Longest Palindrome (Easy)

- **Problem (English)**:
  - Given a string containing uppercase and lowercase English letters, return the length of the longest palindrome that can be built from those letters.
- **題目（中文）**：
  - 給定一個包含大小寫英文字母的字串，請回傳能由這些字母組成的最長回文長度。

- **Examples**:
  - Example 1: `s = "abccccdd"`
    - Output: `7`
    - Explanation: One longest palindrome that can be built is "dccaccd", whose length is 7.
  - Example 2: `s = "a"`
    - Output: `1`
    - Explanation: The longest palindrome that can be built is "a", whose length is 1.
- **Constraints**:
  - `1 <= s.length <= 2000`
  - s consists of lowercase and/or uppercase English letters only.

- **套路**：統計奇偶次數
- **思路**：
  - 回文左右兩側必須成對，所以任何字元只要出現偶數次，就能全部放進回文。
  - 若某字元出現奇數次，最多只能拿 `count - 1` 個放在兩側，多出來的 1 個只能當中心。
  - 因此只要整體出現過任一奇數次字元，就可以額外在中心放 1 個字元。
- **TC**：O(n)
  - 統計字元次數 O(n)，之後掃描次數表也是線性於不同字元數。
- **SC**：O(1)
  - 若字元集固定，Counter 大小固定；若字元集不固定，則為 O(m) 不同字元數。
- **其他思路**：
  - **Set 切換奇偶狀態**：遇到字元就切換它是否在 odd set 中，最後用 odd set 大小推答案。TC: O(n), SC: O(m)。
- **解法比較**：
  - **Counter 計數**：優點是最直觀，容易解釋奇偶貢獻；缺點是需要第二次遍歷 counts。
  - **Set 切換**：優點是寫法精簡；缺點是推導答案公式時較不直觀。
- **測試重點 (Testing)**：
  - **題目範例**：`"abccccdd"`，預期 `7`。
  - **全部都是單一字元**：`"abc"`，預期 `1`。
  - **全部都是偶數次**：`"aabbcc"`，預期整串長度 `6`。
  - **單字元字串**：`"a"`，預期 `1`。

```python
from collections import Counter


def longestPalindrome(s):
  total = 0
  odd_found = False

  for count in Counter(s).values():
    if count % 2 == 0:
      total += count
    else:
      total += count - 1
      odd_found = True

  return total + int(odd_found)
```

### 169. Majority Element (Easy)

- **Problem (English)**:
  - Given an array `nums` of size `n`, return the majority element.
  - The majority element is the value that appears more than `floor(n / 2)` times.
  - The input always contains a majority element.
- **題目（中文）**：
  - 給定一個大小為 `n` 的陣列 `nums`，請回傳多數元素。
  - 多數元素是指出現次數嚴格超過 `floor(n / 2)` 的值。
  - 題目保證一定存在多數元素。

- **Examples**:
  - Example 1: `nums = [3,2,3]`
    - Output: `3`
  - Example 2: `nums = [2,2,1,1,1,2,2]`
    - Output: `2`
- **Constraints**:
  - `n == nums.length`
  - `1 <= n <= 5 * 10^4`
  - `-10^9 <= nums[i] <= 10^9`
  - The input is generated such that a majority element will exist in the array.

- **套路**：Boyer-Moore Voting
- **思路**：
  - 把過半元素想成最後一定會在「兩兩互相抵消」之後存活的那個候選人。
  - 當前數字等於候選人就加票，不等於就扣票；票數歸零時，代表前面的抵消已結束，可以改選新候選人。
  - 因為題目保證一定存在過半元素，所以最後留下的候選人就是答案，不必再驗證。
- **TC**：O(n)
  - 每個元素只處理一次，只有常數次更新。
- **SC**：O(1)
  - 只維護候選人與票數。
- **其他思路**：
  - **Hash Map 計數**：統計每個數字出現次數，超過 `n // 2` 就回傳。TC: O(n), SC: O(n)。
  - **排序後取中位數**：過半元素排序後一定站在中間。TC: O(n log n), SC: 取決於排序實作。
- **解法比較**：
  - **Boyer-Moore**：優點是空間最佳、面試辨識度高；缺點是較抽象，且若題目不保證存在過半元素還要再驗證一次。
  - **Hash Map**：優點是最容易想到；缺點是要額外空間。
- **測試重點 (Testing)**：
  - **單一元素**：`[1]`，預期 `1`。
  - **剛好過半**：`[2,2,1,1,1,2,2]`，預期 `2`。
  - **負數與混合值**：確認投票邏輯與數值大小無關。
  - **過半元素分散出現**：避免誤以為要連續出現。

```python
def majorityElement(nums):
  candidate = None
  count = 0

  for num in nums:
    if count == 0:
      candidate = num
    count += 1 if num == candidate else -1

  return candidate
```

### 217. Contains Duplicate (Easy)

- **Problem (English)**:
  - Given an integer array `nums`, return `true` if any value appears at least twice.
  - Return `false` if every element is distinct.
- **題目（中文）**：
  - 給定一個整數陣列 `nums`，若其中有任意值至少出現兩次，回傳 `true`。
  - 若所有元素都互不相同，回傳 `false`。

- **Examples**:
- **Constraints**:
  - `1 <= nums.length <= 10^5`
  - `-10^9 <= nums[i] <= 10^9`

- **套路**：Hash Set 去重
- **思路**：
  - 一邊掃描陣列，一邊把看過的值放進 set。
  - 如果當前值已經存在於 set 中，代表先前出現過，立即可回傳 `True`。
  - 如果掃描完都沒有重複，才回傳 `False`。
- **TC**：O(n)
  - 每個元素只會查詢與插入 set 一次，平均為 O(1)。
- **SC**：O(n)
  - 最壞情況下所有元素都不同，需要把整個陣列存進 set。
- **其他思路**：
  - **排序後檢查相鄰元素**：排序後只要有相鄰兩個值相同就代表有重複。TC: O(n log n), SC: 視排序實作而定。
- **解法比較**：
  - **Hash Set**：優點是最快；缺點是要額外空間。
  - **排序**：優點是不需 hash 結構；缺點是較慢，且若不想改原陣列可能要先複製。
- **測試重點 (Testing)**：
  - **有重複值**：`[1,2,3,1]`，預期 `True`。
  - **全部唯一**：`[1,2,3,4]`，預期 `False`。
  - **空陣列**：應回傳 `False`。
  - **重複值相距很遠**：確認不是只檢查相鄰位置。

```python
def containsDuplicate(nums):
  seen = set()

  for num in nums:
    if num in seen:
      return True
    seen.add(num)

  return False
```

### 242. Valid Anagram (Easy)

- **Problem (English)**:
  - Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`; otherwise return `false`.
  - An anagram uses exactly the same letters with exactly the same counts, only rearranged.
- **題目（中文）**：
  - 給定兩個字串 `s` 與 `t`，若 `t` 是 `s` 的異位詞則回傳 `true`，否則回傳 `false`。
  - 異位詞表示字母種類與每種字母數量都相同，只是排列順序不同。

- **Examples**:
- **Constraints**:
  - `1 <= s.length, t.length <= 5 * 10^4`
  - s and t consist of lowercase English letters.

- **套路**：Counter 比對
- **思路**：
  - 若兩字串長度不同，就不可能由同一批字元重新排列而成，可直接返回 `False`。
  - 若長度相同，再統計每個字元出現次數；只有每個字元次數都完全一致時，才是 anagram。
  - 這題本質上是在比較兩個字串的 multiset 是否相同。
- **TC**：O(n)
  - 長度檢查後，各掃描一次字串建表並比較。
- **SC**：O(1)
  - 若字元集固定為英文小寫字母，額外空間固定；若字元集不固定，則與不同字元數量有關。
- **其他思路**：
  - **排序後逐字比較**：把兩字串排序後比較是否相同。TC: O(n log n), SC: 視排序實作而定。
  - **26 長度陣列計數**：若限定小寫字母，可用固定長度陣列。TC: O(n), SC: O(1)。
- **解法比較**：
  - **Counter**：優點是泛用、可直接支援較大字元集；缺點是常數因子略高。
  - **排序**：優點是簡潔；缺點是較慢。
  - **固定陣列**：優點是最快；缺點是受限於字元集已知且很小。
- **測試重點 (Testing)**：
  - **標準案例**：`"anagram"` 與 `"nagaram"`，預期 `True`。
  - **長度不同**：應直接回傳 `False`。
  - **長度相同但次數不同**：例如 `"rat"` 與 `"car"`。
  - **重複字元很多**：確認頻率計算正確。

```python
from collections import Counter


def isAnagram(s, t):
  if len(s) != len(t):
    return False
  return Counter(s) == Counter(t)
```

### 121. Best Time to Buy and Sell Stock (Easy)

- **Problem (English)**:
  - Given an array `prices` where `prices[i]` is the stock price on day `i`, return the maximum profit from one buy and one sell.
  - If no profitable transaction exists, return `0`.
- **題目（中文）**：
  - 給定陣列 `prices`，其中 `prices[i]` 代表第 `i` 天的股價，請回傳只做一次買賣時可得到的最大利潤。
  - 若無法獲利，回傳 `0`。

- **Examples**:
  - Example 1: `prices = [7,1,5,3,6,4]`
    - Output: `5`
    - Explanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.
Note that buying on day 2 and selling on day 1 is not allowed because you must buy before you sell.
  - Example 2: `prices = [7,6,4,3,1]`
    - Output: `0`
    - Explanation: In this case, no transactions are done and the max profit = 0.
- **Constraints**:
  - `1 <= prices.length <= 10^5`
  - `0 <= prices[i] <= 10^4`

- **套路**：一次掃描維護最低買點
- **思路**：
  - 當走到第 `i` 天時，若要在今天賣出，最佳買點只可能是前面出現過的最低價格。
  - 因此一趟掃描中同步維護 `min_price` 與 `best_profit` 即可。
  - 每天先更新最低買點，再用 `price - min_price` 嘗試更新最佳利潤。
- **TC**：O(n)
  - 每一天只檢查一次，不需要雙層迴圈比所有買賣組合。
- **SC**：O(1)
  - 只使用兩個變數記錄最低價格與最大利潤。
- **其他思路**：
  - **Prefix Minimum 陣列**：先記錄每一天之前的最低價格，再逐日計算最大利潤。TC: O(n), SC: O(n)。
  - **暴力枚舉買賣日**：TC: O(n^2), SC: O(1)。
- **解法比較**：
  - **一次掃描**：優點是時間與空間都最佳；缺點是要理解為什麼「今天的最佳賣法」只取決於過去最低價。
  - **Prefix Minimum**：優點是狀態明確；缺點是多用了陣列空間。
- **測試重點 (Testing)**：
  - **標準案例**：`[7,1,5,3,6,4]`，預期 `5`。
  - **單調遞減**：`[7,6,4,3,1]`，預期 `0`。
  - **只有一天**：無法交易，預期 `0`。
  - **最佳賣點在最後一天**：確認不會提早固定答案。

```python
def maxProfit(prices):
  min_price = float("inf")
  best = 0

  for price in prices:
    min_price = min(min_price, price)
    best = max(best, price - min_price)

  return best
```

### 238. Product of Array Except Self (Med.)

- **Problem (English)**:
  - Given an integer array `nums`, return an array `answer` where `answer[i]` equals the product of all values in `nums` except `nums[i]`.
  - Solve it without using division.
- **題目（中文）**：
  - 給定整數陣列 `nums`，請回傳一個陣列 `answer`，其中 `answer[i]` 等於除了 `nums[i]` 之外所有元素的乘積。
  - 不可使用除法。

- **Examples**:
  - Example 1: `nums = [1,2,3,4]`
    - Output: `[24,12,8,6]`
  - Example 2: `nums = [-1,1,0,-3,3]`
    - Output: `[0,0,9,0,0]`
- **Constraints**:
  - `2 <= nums.length <= 10^5`
  - `-30 <= nums[i] <= 30`
  - The input is generated such that answer[i] is guaranteed to fit in a 32-bit integer.

- **套路**：前綴積 + 後綴積
- **思路**：
  - `answer[i]` 想要的是「左邊所有數的乘積」乘上「右邊所有數的乘積」。
  - 第一趟由左到右，把每個位置左側的乘積先存進 `answer[i]`。
  - 第二趟由右到左，用一個 `suffix` 變數累積右側乘積，再乘回 `answer[i]`，就完成左右資訊合併。
- **TC**：O(n)
  - 只做兩次線性掃描，每個元素被讀寫常數次。
- **SC**：O(1)
  - 若不計輸出陣列，額外只用到 `prefix` / `suffix` 這類常數變數。
- **其他思路**：
  - **顯式 prefix/suffix 陣列**：分別建立左乘積陣列與右乘積陣列，再相乘。TC: O(n), SC: O(n)。
  - **除法法 + 0 的個數分類**：若題目允許除法，可依據 0 的數量處理。TC: O(n), SC: O(1)。
- **解法比較**：
  - **前後綴合併**：優點是不需除法，且空間最佳；缺點是要理解兩趟掃描如何配合。
  - **顯式雙陣列**：優點是概念最清楚；缺點是多用 O(n) 空間。
  - **除法法**：優點是最短；缺點是遇到 0 較麻煩，且通常不符合題目限制。
- **測試重點 (Testing)**：
  - **一般案例**：`[1,2,3,4]`，預期 `[24,12,8,6]`。
  - **包含一個 0**：例如 `[1,2,0,4]`，只有 0 的位置可得到非 0 結果。
  - **包含兩個以上 0**：答案應全部為 0。
  - **含負數**：確認符號乘積正確。

```python
def productExceptSelf(nums):
  answer = [1] * len(nums)
  prefix = 1

  for index in range(len(nums)):
    answer[index] = prefix
    prefix *= nums[index]

  suffix = 1
  for index in range(len(nums) - 1, -1, -1):
    answer[index] *= suffix
    suffix *= nums[index]

  return answer
```

### 49. Group Anagrams (Med.)

- **Problem (English)**:
  - Given an array of strings `strs`, group the anagrams together.
  - You may return the groups in any order.
- **題目（中文）**：
  - 給定字串陣列 `strs`，請將彼此為異位詞的字串分組。
  - 回傳順序不限。

- **Examples**:
- **Constraints**:
  - `1 <= strs.length <= 10^4`
  - `0 <= strs[i].length <= 100`
  - strs[i] consists of lowercase English letters.

- **套路**：以排序後字串作為分組 key
- **思路**：
  - 互為 anagram 的字串，排序後一定會變成同一個字元序列。
  - 因此可以把 `"eat"`、`"tea"`、`"ate"` 這類字串都映射到同一個 key。
  - 用字典把相同 key 的原字串收集起來，最後輸出所有群組。
- **TC**：O(n * k log k)
  - `n` 是字串數量，`k` 是平均字串長度；每個字串都要排序一次。
- **SC**：O(n * k)
  - 需要儲存分組結果，key 與原字串總長度也與輸入規模同級。
- **其他思路**：
  - **26 維字元頻率 tuple 當 key**：若題目限定小寫字母，可把每個字串轉成 26 長度計數。TC: O(n * k), SC: O(n * k)。
- **解法比較**：
  - **排序 key**：優點是泛用，支援任意字元集；缺點是每個字串多了排序成本。
  - **頻率 tuple**：優點是更快；缺點是較依賴題目字元集條件。
- **測試重點 (Testing)**：
  - **標準案例**：`["eat","tea","tan","ate","nat","bat"]`。
  - **空字串**：`[""]` 應能正確分組。
  - **重複字串**：同一個單字出現多次也要放在同組。
  - **單元素輸入**：應回傳只有一組。

```python
from collections import defaultdict


def groupAnagrams(strs):
  groups = defaultdict(list)

  for word in strs:
    key = "".join(sorted(word))
    groups[key].append(word)

  return list(groups.values())
```

### 53. Maximum Subarray (Med.)

- **Problem (English)**:
  - Given an integer array `nums`, find the contiguous subarray with the largest sum and return that sum.
- **題目（中文）**：
  - 給定整數陣列 `nums`，請找出總和最大的連續子陣列，並回傳其總和。

- **Examples**:
  - Example 1: `nums = [-2,1,-3,4,-1,2,1,-5,4]`
    - Output: `6`
    - Explanation: The subarray [4,-1,2,1] has the largest sum 6.
  - Example 2: `nums = [1]`
    - Output: `1`
    - Explanation: The subarray [1] has the largest sum 1.
  - Example 3: `nums = [5,4,-1,7,8]`
    - Output: `23`
    - Explanation: The subarray [5,4,-1,7,8] has the largest sum 23.
- **Constraints**:
  - `1 <= nums.length <= 10^5`
  - `-10^4 <= nums[i] <= 10^4`

- **套路**：Kadane's Algorithm
- **思路**：
  - 定義 `current` 為「必須以當前元素結尾」的最大子陣列和。
  - 走到新元素 `num` 時，只要比較「把它接在前面最佳尾段後面」與「從它自己重新開始」哪個較好。
  - 每一步更新 `current` 後，再同步更新整體最佳答案 `best`。
- **TC**：O(n)
  - 每個元素只會被掃描一次，狀態轉移是常數時間。
- **SC**：O(1)
  - 只維護當前最佳尾段與全域最佳值。
- **其他思路**：
  - **Prefix Sum + 最小前綴值**：若目前前綴和是 `prefix`，最佳答案可來自 `prefix - min_prefix`。TC: O(n), SC: O(1)。
  - **Divide and Conquer**：分治計算左半、右半與跨中線最佳值。TC: O(n log n), SC: O(log n)。
- **解法比較**：
  - **Kadane**：優點是最短也最實用；缺點是初看時狀態意義較抽象。
  - **Prefix Sum**：優點是和其他前綴和題型能連結；缺點是思路稍繞。
  - **分治**：優點是有理論價值；缺點是不如線性解直接。
- **測試重點 (Testing)**：
  - **題目範例**：`[-2,1,-3,4,-1,2,1,-5,4]`，預期 `6`。
  - **全負數**：例如 `[-3,-2,-5]`，應回傳最大的那個負數。
  - **單元素**：直接回傳該元素。
  - **最佳子陣列在中間**：確認不會只看前綴或後綴。

```python
def maxSubArray(nums):
  current = best = nums[0]

  for num in nums[1:]:
    current = max(num, current + num)
    best = max(best, current)

  return best
```

### 525. Contiguous Array (Med.)

- **Problem (English)**:
  - Given a binary array `nums`, return the maximum length of a contiguous subarray with the same number of `0`s and `1`s.
- **題目（中文）**：
  - 給定一個二元陣列 `nums`，請回傳其中 `0` 與 `1` 數量相同的最長連續子陣列長度。

- **Examples**:
  - Example 1: `nums = [0,1]`
    - Output: `2`
    - Explanation: [0, 1] is the longest contiguous subarray with an equal number of 0 and 1.
  - Example 2: `nums = [0,1,0]`
    - Output: `2`
    - Explanation: [0, 1] (or [1, 0]) is a longest contiguous subarray with equal number of 0 and 1.
  - Example 3: `nums = [0,1,1,1,1,1,0,0,0]`
    - Output: `6`
    - Explanation: [1,1,1,0,0,0] is the longest contiguous subarray with equal number of 0 and 1.
- **Constraints**:
  - `1 <= nums.length <= 10^5`
  - nums[i] is either 0 or 1.

- **套路**：前綴和 + 首次出現索引
- **思路**：
  - 把 `0` 看成 `-1`、`1` 看成 `+1`，那麼某段區間若 0 和 1 數量相同，這段區間的總和就會是 0。
  - 若兩個位置的前綴和相同，表示它們中間那段區間總和為 0，也就是 0 和 1 數量相等。
  - 因此只要記錄每個前綴和第一次出現的位置，後面再次看到同值前綴和時就能更新最長距離。
- **TC**：O(n)
  - 每個元素只會更新一次前綴和，Hash Map 查詢與插入平均 O(1)。
- **SC**：O(n)
  - 最壞情況下每個位置都可能產生不同的前綴和值。
- **其他思路**：
  - **Prefix Sum + 暴力枚舉區間**：先建前綴和，再檢查所有子陣列。TC: O(n^2), SC: O(n)。
- **解法比較**：
  - **前綴和 + 首次索引**：優點是線性時間；缺點是要先做 `0 -> -1` 的轉換觀念。
  - **暴力法**：優點是最直觀；缺點是無法應付大輸入。
- **測試重點 (Testing)**：
  - **最小合法案例**：`[0,1]`，預期 `2`。
  - **大量交錯**：例如 `[0,1,0,1,0,1]`，應得到整段長度。
  - **全部相同**：例如 `[0,0,0]`，預期 `0`。
  - **最佳區間從索引 0 開始**：確認初始化 `{0: -1}` 正確。

```python
def findMaxLength(nums):
  first_seen = {0: -1}
  prefix = 0
  best = 0

  for index, num in enumerate(nums):
    prefix += 1 if num == 1 else -1
    if prefix in first_seen:
      best = max(best, index - first_seen[prefix])
    else:
      first_seen[prefix] = index

  return best
```

### 560. Subarray Sum Equals K (Med.)

- **Problem (English)**:
  - Given an integer array `nums` and an integer `k`, return the number of contiguous subarrays whose sum equals `k`.
- **題目（中文）**：
  - 給定整數陣列 `nums` 與整數 `k`，請回傳總和等於 `k` 的連續子陣列數量。

- **Examples**:
  - Example 1: `nums = [1,1,1], k = 2`
    - Output: `2`
  - Example 2: `nums = [1,2,3], k = 3`
    - Output: `2`
- **Constraints**:
  - `1 <= nums.length <= 2 * 10^4`
  - `-1000 <= nums[i] <= 1000`
  - `-10^7 <= k <= 10^7`

- **套路**：前綴和 + 次數表
- **思路**：
  - 設目前前綴和為 `prefix`，若先前某個位置的前綴和是 `prefix - k`，那麼中間那段子陣列和就會是 `k`。
  - 而且同一個 `prefix - k` 可能出現過多次，代表有多個不同起點都能形成合法子陣列。
  - 所以要記錄的是「某前綴和出現了幾次」，而不是只記錄第一次出現的位置。
- **TC**：O(n)
  - 每個元素只更新一次前綴和，並做固定次數的 Hash Map 查詢。
- **SC**：O(n)
  - 最壞情況下每個前綴和值都不同，需要全部存進字典。
- **其他思路**：
  - **Prefix Sum + 暴力枚舉右端點**：對每個右端點往前找所有起點。TC: O(n^2), SC: O(n)。
  - **滑動窗口**：只有在所有數字皆非負時才可行，不能作為本題通用解。
- **解法比較**：
  - **前綴和 + 次數表**：優點是能處理負數、0、正數混合情況；缺點是要理解為什麼記錄的是次數而不是索引。
  - **滑動窗口**：優點是在非負陣列時更直觀；缺點是本題不通用。
- **測試重點 (Testing)**：
  - **標準案例**：`nums = [1,1,1], k = 2`，預期 `2`。
  - **含負數**：例如 `[1,-1,0]`，確認不是只有非負數才成立。
  - **`k = 0`**：特別容易出現多段重疊答案。
  - **多個重疊子陣列**：確認計數不會漏掉。

```python
def subarraySum(nums, k):
  count = 0
  prefix = 0
  seen = {0: 1}

  for num in nums:
    prefix += num
    count += seen.get(prefix - k, 0)
    seen[prefix] = seen.get(prefix, 0) + 1

  return count
```

### 128. Longest Consecutive Sequence (Med.)

- **Problem (English)**:
  - Given an unsorted integer array `nums`, return the length of the longest sequence of consecutive integers.
  - Your algorithm must run in `O(n)` time.
- **題目（中文）**：
  - 給定一個未排序整數陣列 `nums`，請回傳最長連續整數序列的長度。
  - 演算法必須在 `O(n)` 時間內完成。

- **Examples**:
  - Example 1: `nums = [100,4,200,1,3,2]`
    - Output: `4`
    - Explanation: The longest consecutive elements sequence is [1, 2, 3, 4]. Therefore its length is 4.
  - Example 2: `nums = [0,3,7,2,5,8,4,6,0,1]`
    - Output: `9`
  - Example 3: `nums = [1,0,1,2]`
    - Output: `3`
- **Constraints**:
  - `0 <= nums.length <= 10^5`
  - `-10^9 <= nums[i] <= 10^9`

- **套路**：Hash Set 找序列起點
- **思路**：
  - 若某個數字 `num - 1` 也存在，代表 `num` 不是序列起點，從它開始往後數只會重複工作。
  - 所以只有當 `num - 1` 不在 set 中時，才從 `num` 開始延伸連續序列長度。
  - 這樣每條序列只會從真正起點掃一次，避免重複計算。
- **TC**：O(n)
  - 雖然有內層 while，但每個數最多只會在某條序列中被向前探查一次，總成本仍是線性。
- **SC**：O(n)
  - 需要用 set 儲存所有數字以支援 O(1) 查詢。
- **其他思路**：
  - **排序後線性掃描**：先排序，再找最長連續段。TC: O(n log n), SC: 視排序實作而定。
- **解法比較**：
  - **Hash Set 起點法**：優點是時間最佳；缺點是需要額外記憶體。
  - **排序法**：優點是直觀；缺點是較慢，且要處理重複值。
- **測試重點 (Testing)**：
  - **標準案例**：`[100,4,200,1,3,2]`，預期 `4`。
  - **含重複值**：例如 `[1,2,2,3]`，不能被重複值干擾。
  - **空陣列**：應回傳 `0`。
  - **含負數與多段序列**：確認只抓最長的一段。

```python
def longestConsecutive(nums):
  values = set(nums)
  best = 0

  for num in values:
    if num - 1 not in values:
      length = 1
      while num + length in values:
        length += 1
      best = max(best, length)

  return best
```

### 8. String to Integer - atoi (Med.)

- **Problem (English)**:
  - Implement `myAtoi(string s)`, which converts a string to a 32-bit signed integer.
  - Ignore leading whitespace, read an optional sign, then read digits until a non-digit is reached.
  - Clamp the result into the 32-bit signed integer range if it overflows.
- **題目（中文）**：
  - 實作 `myAtoi(string s)`，將字串轉成 32 位有號整數。
  - 需要先忽略前導空白，再讀取可選的正負號，接著盡可能讀取數字直到遇到非數字字元。
  - 若結果超出 32 位有號整數範圍，需截斷到邊界值。

- **Examples**:
- **Constraints**:
  - `0 <= s.length <= 200`
  - s consists of English letters (lower-case and upper-case), digits (0-9), ' ', '+', '-', and '.'.

- **套路**：字串模擬解析
- **思路**：
  - 按照題目規則依序處理：先跳過前導空白，再讀可選的正負號，最後連續讀取數字。
  - 一旦遇到非數字字元，就停止解析；後面的內容都不再影響答案。
  - 在累積數字的同時檢查是否超出 32 位整數範圍，必要時直接 clamp。
- **TC**：O(n)
  - 最多從左到右掃描字串一次，每個字元只處理一次。
- **SC**：O(1)
  - 只使用索引、符號與累積數值等常數變數。
- **其他思路**：
  - **有限狀態機 (FSM)**：把空白、正負號、數字、其他字元分成狀態轉移。TC: O(n), SC: O(1)。
  - **Regex 擷取前綴合法整數**：可快速完成，但面試通常不如手寫解析有代表性。
- **解法比較**：
  - **手動模擬**：優點是最貼近題意，面試易展示細節處理；缺點是邊界較多。
  - **FSM**：優點是結構化；缺點是對這題略顯繁瑣。
- **測試重點 (Testing)**：
  - **前導空白與正負號**：例如 `"   -42"`。
  - **讀到非數字即停止**：`"4193 with words"`。
  - **非法前綴**：`"words and 987"`，應回傳 `0`。
  - **溢位**：`"91283472332"`、`"-91283472332"` 都要被 clamp。
  - **只有符號沒有數字**：例如 `"+"`、`"-"`。

```python
def myAtoi(s):
  index = 0

  while index < len(s) and s[index] == " ":
    index += 1

  sign = 1
  if index < len(s) and s[index] in "+-":
    sign = -1 if s[index] == "-" else 1
    index += 1

  result = 0
  while index < len(s) and s[index].isdigit():
    result = result * 10 + int(s[index])
    value = sign * result

    if value < -(2 ** 31):
      return -(2 ** 31)
    if value > 2 ** 31 - 1:
      return 2 ** 31 - 1

    index += 1

  return sign * result
```

### 54. Spiral Matrix (Med.)

- **Problem (English)**:
  - Given an `m x n` matrix, return all elements in spiral order.
- **題目（中文）**：
  - 給定一個 `m x n` 矩陣，請依照螺旋順序回傳所有元素。

- **Examples**:
  - Example 1: `matrix = [[1,2,3],[4,5,6],[7,8,9]]`
    - Output: `[1,2,3,6,9,8,7,4,5]`
  - Example 2: `matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]`
    - Output: `[1,2,3,4,8,12,11,10,9,5,6,7]`
- **Constraints**:
  - `m == matrix.length`
  - `n == matrix[i].length`
  - `1 <= m, n <= 10`
  - `-100 <= matrix[i][j] <= 100`

- **套路**：四邊界逐層收縮
- **思路**：
  - 用 `top`、`bottom`、`left`、`right` 表示當前還沒走過的矩形邊界。
  - 每一輪依序走上邊、右邊、下邊、左邊，走完後收縮對應邊界。
  - 關鍵是每次走下邊或左邊前都要再次確認邊界仍合法，避免單行或單列重複加入。
- **TC**：O(m * n)
  - 每個元素都恰好被加入答案一次。
- **SC**：O(1)
  - 若不計輸出陣列，只使用邊界指標。
- **其他思路**：
  - **方向模擬 + visited 陣列**：一路沿著右下左上的方向走，碰牆就轉彎。TC: O(m * n), SC: O(m * n)。
- **解法比較**：
  - **四邊界法**：優點是空間省，適合面試；缺點是邊界判斷較多。
  - **visited 模擬**：優點是流程直觀；缺點是需要額外空間。
- **測試重點 (Testing)**：
  - **單行矩陣**：只會走上邊。
  - **單列矩陣**：只會走右邊。
  - **方形與長方形矩陣**：確認不同維度都能正常收縮。
  - **`1 x 1`**：最小邊界案例。

```python
def spiralOrder(matrix):
  top, bottom = 0, len(matrix) - 1
  left, right = 0, len(matrix[0]) - 1
  result = []

  while top <= bottom and left <= right:
    for col in range(left, right + 1):
      result.append(matrix[top][col])
    top += 1

    for row in range(top, bottom + 1):
      result.append(matrix[row][right])
    right -= 1

    if top <= bottom:
      for col in range(right, left - 1, -1):
        result.append(matrix[bottom][col])
      bottom -= 1

    if left <= right:
      for row in range(bottom, top - 1, -1):
        result.append(matrix[row][left])
      left += 1

  return result
```

### 48. Rotate Image (Med.)

- **Problem (English)**:
  - You are given an `n x n` matrix representing an image.
  - Rotate the image by 90 degrees clockwise in-place.
- **題目（中文）**：
  - 給定一個 `n x n` 的矩陣代表圖片。
  - 請原地將圖片順時針旋轉 90 度。

- **Examples**:
  - Example 1: `matrix = [[1,2,3],[4,5,6],[7,8,9]]`
    - Output: `[[7,4,1],[8,5,2],[9,6,3]]`
  - Example 2: `matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]`
    - Output: `[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]`
- **Constraints**:
  - `n == matrix.length == matrix[i].length`
  - `1 <= n <= 20`
  - `-1000 <= matrix[i][j] <= 1000`

- **套路**：先轉置再左右翻轉
- **思路**：
  - 順時針旋轉 90 度可以拆成兩個原地操作：先沿主對角線轉置，再把每一列反轉。
  - 轉置會把 `(r, c)` 搬到 `(c, r)`，再反轉每一列，就完成順時針旋轉。
  - 因為兩步都能原地做，所以不需要額外矩陣。
- **TC**：O(n^2)
  - 每個元素在轉置與反轉階段都只會被處理常數次。
- **SC**：O(1)
  - 只用交換操作，沒有建立新矩陣。
- **其他思路**：
  - **逐層四向交換**：一圈一圈把四個對應位置輪轉。TC: O(n^2), SC: O(1)。
- **解法比較**：
  - **轉置 + 反轉**：優點是結構簡潔、好記；缺點是要先看出幾何轉換關係。
  - **逐層交換**：優點是直接對應「旋轉」動作；缺點是索引較容易寫錯。
- **測試重點 (Testing)**：
  - **`1 x 1`**：應維持原樣。
  - **奇數與偶數維度**：如 `3 x 3`、`4 x 4`。
  - **值重複矩陣**：確認不依賴數值唯一性。
  - **多次旋轉推理**：可人工驗證四次旋轉會回原狀。

```python
def rotate(matrix):
  n = len(matrix)

  for row in range(n):
    for col in range(row + 1, n):
      matrix[row][col], matrix[col][row] = matrix[col][row], matrix[row][col]

  for row in matrix:
    row.reverse()
```

### 73. Set Matrix Zeroes (Med.)

- **Problem (English)**:
  - Given an `m x n` integer matrix, if an element is `0`, set its entire row and column to `0`.
  - You must modify the matrix in-place.
- **題目（中文）**：
  - 給定一個 `m x n` 的整數矩陣，若某個元素為 `0`，則將其整列與整欄都設為 `0`。
  - 必須原地修改矩陣。

- **Examples**:
  - Example 1: `matrix = [[1,1,1],[1,0,1],[1,1,1]]`
    - Output: `[[1,0,1],[0,0,0],[1,0,1]]`
  - Example 2: `matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]`
    - Output: `[[0,0,0,0],[0,4,5,0],[0,3,1,0]]`
- **Constraints**:
  - `m == matrix.length`
  - `n == matrix[0].length`
  - `1 <= m, n <= 200`
  - `-2^31 <= matrix[i][j] <= 2^31 - 1`

- **套路**：用第一列與第一欄當標記區
- **思路**：
  - 若某格是 0，那麼它所在的整列與整欄最後都要清成 0。
  - 為了避免額外用 row set / col set，可以直接把第一列與第一欄當成標記區，記錄哪一列或哪一欄需要清零。
  - 因為第一列與第一欄本身也可能本來就含 0，所以要先額外記錄它們是否需要清零。
- **TC**：O(m * n)
  - 需要掃描矩陣幾次，但每次都是線性於矩陣大小。
- **SC**：O(1)
  - 除了兩個布林值外，沒有額外使用與矩陣尺寸成長的結構。
- **其他思路**：
  - **row set + col set**：先記錄哪些列、欄需要清零，再第二次掃描設值。TC: O(m * n), SC: O(m + n)。
- **解法比較**：
  - **第一列/欄標記法**：優點是空間最佳；缺點是第一列與第一欄的邊界處理較繞。
  - **row/col set**：優點是比較直觀；缺點是多用空間。
- **測試重點 (Testing)**：
  - **0 在第一列**：確認第一列標記不會與一般標記混淆。
  - **0 在第一欄**：同上。
  - **多個 0 分散在不同列欄**：確認標記會累積。
  - **完全沒有 0**：矩陣應保持不變。

```python
def setZeroes(matrix):
  rows, cols = len(matrix), len(matrix[0])
  first_row_zero = any(matrix[0][col] == 0 for col in range(cols))
  first_col_zero = any(matrix[row][0] == 0 for row in range(rows))

  for row in range(1, rows):
    for col in range(1, cols):
      if matrix[row][col] == 0:
        matrix[row][0] = 0
        matrix[0][col] = 0

  for row in range(1, rows):
    for col in range(1, cols):
      if matrix[row][0] == 0 or matrix[0][col] == 0:
        matrix[row][col] = 0

  if first_row_zero:
    for col in range(cols):
      matrix[0][col] = 0

  if first_col_zero:
    for row in range(rows):
      matrix[row][0] = 0
```

### 75. Sort Colors (Med.)

- **Problem (English)**:
  - Given an array `nums` containing `0`, `1`, and `2` to represent red, white, and blue, sort the array in-place so equal colors are adjacent.
  - Do not use the library sort function.
- **題目（中文）**：
  - 給定一個只包含 `0`、`1`、`2` 的陣列 `nums`，分別代表紅、白、藍三種顏色，請原地排序讓相同顏色相鄰。
  - 不可使用函式庫內建排序。

- **Examples**:
  - Example 1: `nums = [2,0,2,1,1,0]`
    - Output: `[0,0,1,1,2,2]`
  - Example 2: `nums = [2,0,1]`
    - Output: `[0,1,2]`
- **Constraints**:
  - `n == nums.length`
  - `1 <= n <= 300`
  - nums[i] is either 0, 1, or 2.

- **套路**：Dutch National Flag
- **思路**：
  - 維護三個區域：`[0, left)` 都是 0，`(right, end]` 都是 2，中間是尚未分類的區域。
  - `index` 負責掃描未知區間，遇到 0 就交換到左邊，遇到 2 就交換到右邊。
  - 特別注意和 `right` 交換後不能立刻 `index += 1`，因為換回來的新值還沒檢查過。
- **TC**：O(n)
  - 三個指標都只會單調移動，每個元素最多被交換到正確區域幾次。
- **SC**：O(1)
  - 原地分類，不需要額外陣列。
- **其他思路**：
  - **Counting Sort**：先數 0、1、2 各有幾個，再回填。TC: O(n), SC: O(1)。
- **解法比較**：
  - **Dutch Flag**：優點是單趟完成，符合題目進階要求；缺點是 pointer 邊界容易出錯。
  - **Counting Sort**：優點是直觀；缺點是需要第二次回填，較不像原地 partition 技巧。
- **測試重點 (Testing)**：
  - **混合排列**：`[2,0,2,1,1,0]`。
  - **全相同顏色**：全 0、全 1、全 2。
  - **已排序與反向排序**：確認不會多做錯誤交換。
  - **2 被換回來的新值**：驗證 `index` 不前進的邏輯。

```python
def sortColors(nums):
  left, index, right = 0, 0, len(nums) - 1

  while index <= right:
    if nums[index] == 0:
      nums[left], nums[index] = nums[index], nums[left]
      left += 1
      index += 1
    elif nums[index] == 2:
      nums[right], nums[index] = nums[index], nums[right]
      right -= 1
    else:
      index += 1
```

### 136. Single Number (Easy)

- **Problem (English)**:
  - Given a non-empty integer array `nums`, every element appears twice except for one.
  - Return the element that appears exactly once.
  - The solution must run in linear time and use constant extra space.
- **題目（中文）**：
  - 給定一個非空整數陣列 `nums`，其中每個元素都出現兩次，只有一個元素只出現一次。
  - 請回傳那個只出現一次的元素。
  - 解法必須使用線性時間與常數額外空間。

- **Examples**:
- **Constraints**:
  - `1 <= nums.length <= 3 * 10^4`
  - `-3 * 10^4 <= nums[i] <= 3 * 10^4`
  - Each element in the array appears twice except for one element which appears only once.

- **套路**：XOR 抵消
- **思路**：
  - XOR 有兩個關鍵性質：`a ^ a = 0`，`a ^ 0 = a`。
  - 因為題目中除了答案外每個數都出現兩次，所以成對數字依序 XOR 之後都會互相抵消掉。
  - 最後剩下的值就是只出現一次的那個數。
- **TC**：O(n)
  - 只需線性掃描一次陣列。
- **SC**：O(1)
  - 只用一個累積 XOR 的變數。
- **其他思路**：
  - **Hash Map 計數**：統計頻率後找出次數為 1 的值。TC: O(n), SC: O(n)。
  - **排序後兩兩配對**：TC: O(n log n), SC: 視排序實作而定。
- **解法比較**：
  - **XOR**：優點是最精煉且空間最佳；缺點是需要對位元運算有直覺。
  - **Hash Map**：優點是容易想到；缺點是空間較差。
- **測試重點 (Testing)**：
  - **唯一值在頭尾或中間**：都應得到同一答案。
  - **只含一個元素**：直接回傳該元素。
  - **含負數**：XOR 仍適用。
  - **多組成對值**：確認全部都會正確抵消。

```python
def singleNumber(nums):
  answer = 0

  for num in nums:
    answer ^= num

  return answer
```

### 179. Largest Number (Med.)

- **Problem (English)**:
  - Given a list of non-negative integers `nums`, arrange them so they form the largest possible number.
  - Return the result as a string.
- **題目（中文）**：
  - 給定一組非負整數 `nums`，請重新排列它們，使其組成最大的數字。
  - 結果需以字串形式回傳。

- **Examples**:
  - Example 1: `nums = [10,2]`
    - Output: `"210"`
  - Example 2: `nums = [3,30,34,5,9]`
    - Output: `"9534330"`
- **Constraints**:
  - `1 <= nums.length <= 100`
  - `0 <= nums[i] <= 10^9`

- **套路**：自訂排序規則
- **思路**：
  - 關鍵不是比較數字大小，而是比較兩個字串 `a`、`b` 在拼接後 `a + b` 與 `b + a` 哪個更大。
  - 若 `a + b` 較大，就代表 `a` 應該排在 `b` 前面，這樣最終拼接字串才最大。
  - 排序完成後還要特別處理全為 0 的情況，避免輸出像 `"000"`。
- **TC**：O(n log n * k)
  - 排序主導時間，`k` 是平均字串長度；每次比較都可能涉及字串拼接比較。
- **SC**：O(n)
  - 需要把整數轉成字串並儲存排序結果。
- **其他思路**：
  - **固定長度重複字串當排序 key**：在題目位數上限已知時，可把字串重複到固定長度後排序。TC: O(n log n * k), SC: O(n)。
- **解法比較**：
  - **自訂 comparator**：優點是最通用、最穩健；缺點是在 Python 需要 `cmp_to_key`。
  - **重複字串 key**：優點是寫法較短；缺點是依賴題目位數上限，泛化性差。
- **測試重點 (Testing)**：
  - **基本案例**：`[10,2]`，預期 `"210"`。
  - **前綴關係陷阱**：`[3,30,34,5,9]`。
  - **全部為 0**：例如 `[0,0]`，預期 `"0"`。
  - **相近前綴**：如 `[34323,3432]`，確認比較規則正確。

```python
from functools import cmp_to_key


def largestNumber(nums):
  as_strings = list(map(str, nums))

  def compare(a, b):
    if a + b > b + a:
      return -1
    if a + b < b + a:
      return 1
    return 0

  as_strings.sort(key=cmp_to_key(compare))
  result = "".join(as_strings)
  return "0" if result[0] == "0" else result
```

### 189. Rotate Array (Med.)

- **Problem (English)**:
  - Given an integer array `nums`, rotate the array to the right by `k` steps.
  - Do it in-place when possible.
- **題目（中文）**：
  - 給定整數陣列 `nums`，請將陣列向右旋轉 `k` 步。
  - 盡可能原地完成。

- **Examples**:
  - Example 1: `nums = [1,2,3,4,5,6,7], k = 3`
    - Output: `[5,6,7,1,2,3,4]`
    - Explanation: rotate 1 steps to the right: [7,1,2,3,4,5,6]
rotate 2 steps to the right: [6,7,1,2,3,4,5]
rotate 3 steps to the right: [5,6,7,1,2,3,4]
  - Example 2: `nums = [-1,-100,3,99], k = 2`
    - Output: `[3,99,-1,-100]`
    - Explanation: rotate 1 steps to the right: [99,-1,-100,3]
rotate 2 steps to the right: [3,99,-1,-100]
- **Constraints**:
  - `1 <= nums.length <= 10^5`
  - `-2^31 <= nums[i] <= 2^31 - 1`
  - `0 <= k <= 10^5`

- **套路**：三次反轉
- **思路**：
  - 把陣列整體反轉後，原本最後面的 `k` 個元素會被翻到前面，但順序也被反轉。
  - 再把前 `k` 個元素反轉一次、後 `n-k` 個元素反轉一次，就能把兩段各自恢復正確順序。
  - 做 `k %= n` 後，就能處理 `k` 大於陣列長度的情況。
- **TC**：O(n)
  - 三次反轉總共仍是線性時間，每個元素只被交換常數次。
- **SC**：O(1)
  - 所有操作都在原陣列上完成。
- **其他思路**：
  - **額外陣列搬移**：建立新陣列，把 `nums[i]` 放到 `(i + k) % n`。TC: O(n), SC: O(n)。
  - **Cycle Replacement**：依照環狀位置替換可做到 O(1) 空間，但實作較 tricky。
- **解法比較**：
  - **三次反轉**：優點是簡潔且原地；缺點是要先看出反轉結構。
  - **額外陣列**：優點是最容易寫；缺點是空間較差。
- **測試重點 (Testing)**：
  - **`k` 大於陣列長度**：例如 `k = 10`。
  - **`k = 0`**：陣列應保持不變。
  - **單元素陣列**：不應出錯。
  - **重複值**：確認演算法不依賴值唯一性。

```python
def rotate(nums, k):
  k %= len(nums)

  def reverse(left, right):
    while left < right:
      nums[left], nums[right] = nums[right], nums[left]
      left += 1
      right -= 1

  reverse(0, len(nums) - 1)
  reverse(0, k - 1)
  reverse(k, len(nums) - 1)
```

### 41. First Missing Positive (Hard)

- **Problem (English)**:
  - Given an unsorted integer array `nums`, return the smallest missing positive integer.
  - Your algorithm must run in `O(n)` time and use `O(1)` extra space.
- **題目（中文）**：
  - 給定一個未排序整數陣列 `nums`，請回傳最小缺失正整數。
  - 演算法必須在 `O(n)` 時間內完成，並只使用 `O(1)` 額外空間。

- **Examples**:
  - Example 1: `nums = [1,2,0]`
    - Output: `3`
    - Explanation: The numbers in the range [1,2] are all in the array.
  - Example 2: `nums = [3,4,-1,1]`
    - Output: `2`
    - Explanation: 1 is in the array but 2 is missing.
  - Example 3: `nums = [7,8,9,11,12]`
    - Output: `1`
    - Explanation: The smallest positive integer 1 is missing.
- **Constraints**:
  - `1 <= nums.length <= 10^5`
  - `-2^31 <= nums[i] <= 2^31 - 1`

- **套路**：原地放回對應索引
- **思路**：
  - 長度為 `n` 的陣列，第一個缺失的正整數只可能落在 `1` 到 `n + 1` 之間。
  - 若 `nums[i]` 是合法值 `x`，它理想上應該待在索引 `x - 1` 的位置，所以就把它交換回去。
  - 全部放好後，第一個 `nums[i] != i + 1` 的位置，其 `i + 1` 就是最小缺失正整數。
- **TC**：O(n)
  - 雖然有 while 交換，但每個數字最多只會被交換到正確位置幾次，總體仍是線性。
- **SC**：O(1)
  - 完全原地重排，沒有額外集合或陣列。
- **其他思路**：
  - **Hash Set 紀錄出現過的正數**：再從 1 開始往上找第一個不存在的值。TC: O(n), SC: O(n)。
- **解法比較**：
  - **原地索引放置**：優點是符合進階要求、空間最佳；缺點是交換條件較多。
  - **Hash Set**：優點是好理解；缺點是多用了線性空間。
- **測試重點 (Testing)**：
  - **缺少 1**：例如 `[7,8,9,11,12]`，預期 `1`。
  - **陣列已完整包含 `1..n`**：答案應為 `n + 1`。
  - **含負數與 0**：應被忽略。
  - **含重複值**：確認 while 不會無限交換。

```python
def firstMissingPositive(nums):
  n = len(nums)

  for index in range(n):
    while 1 <= nums[index] <= n and nums[nums[index] - 1] != nums[index]:
      target = nums[index] - 1
      nums[index], nums[target] = nums[target], nums[index]

  for index, num in enumerate(nums):
    if num != index + 1:
      return index + 1

  return n + 1
```

### 271. Encode and Decode Strings (Med.)

- **Problem (English)**:
  - Design an algorithm to encode a list of strings into a single string so it can be sent over a network and decoded back to the original list.
  - Implement `encode` and `decode` so the decoded list exactly matches the original list.
  - You may not use built-in serialize methods such as `eval`.
- **題目（中文）**：
  - 設計一個演算法，將字串列表編碼成單一字串，以便透過網路傳送後再正確解碼回原本的列表。
  - 你需要實作 `encode` 與 `decode`，並保證解碼後的結果和原始列表完全相同。
  - 不能直接使用內建的 serialize 類型方法，例如 `eval`。
- **Examples**:
  - Example 1: `dummy_input = ["Hello","World"]`
    - Output: `["Hello","World"]`
    - Explanation: After encoding on one machine and decoding on another, the recovered list must still be `["Hello","World"]`.
  - Example 2: `dummy_input = [""]`
    - Output: `[""]`
- **Constraints**:
  - `1 <= strs.length <= 200`
  - `0 <= strs[i].length <= 200`
  - `strs[i]` may contain any of the 256 valid ASCII characters.
- **套路**：長度前綴編碼
- **思路**：
  - 若只用某個分隔符直接 join，原字串本身也可能含有那個分隔符，decode 時就會歧義。
  - 所以把每個字串編成 `length#content`，decode 時先讀到 `#` 取得長度，再精準取出後面的固定長度字串。
  - 因為長度是明確的，內容中即使出現 `#` 或空字串也不會造成解析錯誤。
- **TC**：O(total_chars)
  - encode 與 decode 都只會線性掃過所有字元一次。
- **SC**：O(total_chars)
  - 輸出字串與解碼結果都與總字元數成正比。
- **其他思路**：
  - **跳脫字元 + 分隔符**：對分隔符本身做 escape 再 join。TC: O(total_chars), SC: O(total_chars)。
- **解法比較**：
  - **長度前綴**：優點是最穩健，內容不怕衝突；缺點是 decode 需手動解析長度。
  - **escape 分隔符**：優點是看起來像一般序列化；缺點是 escape/unescape 容易漏邊界。
- **測試重點 (Testing)**：
  - **空字串**：例如 `[""]`。
  - **空清單**：encode/decode 後都要正確。
  - **內容含 `#`**：不能被誤判成分隔符。
  - **多位數長度**：例如長度超過 9 的字串。

```python
def encode(strs):
  return "".join(f"{len(word)}#{word}" for word in strs)


def decode(s):
  result = []
  index = 0

  while index < len(s):
    split = index
    while s[split] != "#":
      split += 1

      length = int(s[index:split])
      result.append(s[split + 1:split + 1 + length])
      index = split + 1 + length

  return result
```

### 380. Insert Delete GetRandom O(1) (Med.)

- **Problem (English)**:
  - Design a data structure that supports `insert`, `remove`, and `getRandom` in average `O(1)` time.
  - `insert(val)` returns whether the value was newly added.
  - `remove(val)` returns whether the value existed and was removed.
  - `getRandom()` returns a random current element, with each element having equal probability.
- **題目（中文）**：
  - 設計一個資料結構，支援平均 `O(1)` 時間的 `insert`、`remove` 與 `getRandom`。
  - `insert(val)` 需回傳該值是否為新加入。
  - `remove(val)` 需回傳該值是否存在並被成功刪除。
  - `getRandom()` 需從目前元素中等機率回傳一個值。

- **Examples**:
- **Constraints**:
  - `-2^31 <= val <= 2^31 - 1`
  - At most 2 * 10^5 calls will be made to insert, remove, and getRandom.
  - There will be at least one element in the data structure when getRandom is called.

- **套路**：陣列 + Hash Map 索引
- **思路**：
  - 陣列適合做 `getRandom()`，因為可 O(1) 隨機存取。
  - Hash Map 則記錄每個值在陣列中的索引，讓 `insert` 能 O(1) 查重。
  - `remove` 的關鍵是把要刪的元素和尾元素交換，再把尾端彈出，如此就避免從中間刪除造成 O(n) 位移。
- **TC**：平均每個操作 O(1)
  - dict 查詢 / 更新與 list 尾端 append、pop 都是平均 O(1)，`getRandom` 直接隨機索引。
- **SC**：O(n)
  - 需要同時儲存所有元素及其索引映射。
- **其他思路**：
  - **直接用 set 儲存，`getRandom` 時轉成 list**：`insert` / `remove` 平均 O(1)，但 `getRandom` 變成 O(n)。
- **解法比較**：
  - **陣列 + Hash Map**：優點是三種操作都能達到平均 O(1)；缺點是刪除時索引更新容易漏。
  - **單純 set**：優點是結構簡單；缺點是無法滿足 O(1) random。
- **測試重點 (Testing)**：
  - **重複插入**：第二次插入同值應回傳 `False`。
  - **刪除不存在元素**：應回傳 `False`。
  - **刪除中間元素**：確認被換上來的尾元素索引有同步更新。
  - **多次刪除後再 `getRandom`**：應只會回傳目前仍存在的值。

```python
import random


class RandomizedSet:
  def __init__(self):
      self.values = []
      self.index = {}

  def insert(self, val):
    if val in self.index:
      return False

    self.index[val] = len(self.values)
    self.values.append(val)
    return True

  def remove(self, val):
    if val not in self.index:
      return False

    remove_index = self.index[val]
    last_val = self.values[-1]

    self.values[remove_index] = last_val
    self.index[last_val] = remove_index

    self.values.pop()
    del self.index[val]
    return True

  def getRandom(self):
    return random.choice(self.values)
```
