# 二、Two Pointers（雙指標）

## 題目目錄

- [125. Valid Palindrome (Easy)](#125-valid-palindrome-easy)
- [11. Container With Most Water (Med.)](#11-container-with-most-water-med)
- [15. 3Sum (Med.)](#15-3sum-med)
- [16. 3Sum Closest (Med.)](#16-3sum-closest-med)
- [42. Trapping Rain Water (Hard)](#42-trapping-rain-water-hard)
- [283. Move Zeroes (Easy)](#283-move-zeroes-easy)
- [977. Squares of a Sorted Array (Easy)](#977-squares-of-a-sorted-array-easy)
- [5. Longest Palindromic Substring (Med.)](#5-longest-palindromic-substring-med)
- [9. Palindrome Number (Easy)](#9-palindrome-number-easy)

## 通用套路

**對撞指標**：左右各放一個指標，根據目前狀態決定該移動哪一側，常用在排序陣列、回文檢查、最大面積這類問題。

**快慢指標**：一個指標負責掃描，另一個指標負責維護「下一個要放的位置」或「慢速狀態」，常見於原地重排與去除元素。

```python
# 套路模板：對撞指標
def two_pointer_pattern(nums, target):
  left, right = 0, len(nums) - 1

  while left < right:
    total = nums[left] + nums[right]
    if total == target:
      return [left, right]
    if total < target:
      left += 1
    else:
      right -= 1
```

---

### 125. Valid Palindrome (Easy)

- **Problem (English)**:
  - Determine whether a string still reads the same forward and backward after removing non-alphanumeric characters and ignoring letter case.
- **題目（中文）**：
  - 判斷一個字串在忽略非英數字元與大小寫之後，是否仍然是回文。

- **Examples**:
  - Example 1: `s = "A man, a plan, a canal: Panama"`
    - Output: `true`
    - Explanation: "amanaplanacanalpanama" is a palindrome.
  - Example 2: `s = "race a car"`
    - Output: `false`
    - Explanation: "raceacar" is not a palindrome.
  - Example 3: `s = " "`
    - Output: `true`
    - Explanation: s is an empty string "" after removing non-alphanumeric characters.
Since an empty string reads the same forward and backward, it is a palindrome.
- **Constraints**:
  - `1 <= s.length <= 2 * 10^5`
  - s consists only of printable ASCII characters.

- **套路**：對撞指標 + 跳過無效字元
- **思路**：
  - 左右指標往中間收斂，但只在遇到英數字元時才真正比較。
  - 每次比較前都先略過標點、空白等無關字元，再把字元轉成小寫，等同於題目要求的 normalization。
  - 這樣可以避免先建立過濾後的新字串，直接在原字串上完成檢查。
- **TC**：O(n)
  - 每個字元最多只會被左指標或右指標略過或比較一次，所以總工作量與字串長度成正比。
- **SC**：O(1)
  - 只使用兩個指標與少量臨時變數，沒有額外建立過濾字串。
- **其他思路**：
  - **先過濾再反轉比較**：先把所有英數字元抽出並轉小寫，再判斷是否等於反轉字串。TC: O(n), SC: O(n)。
- **解法比較**：
  - **對撞指標**：優點是空間最省，面試中也更能展示 pointer 控制能力。缺點是邊界處理比字串法多一些。
  - **過濾後比較**：優點是可讀性高。缺點是會多用一份 O(n) 的額外空間。
- **測試重點 (Testing)**：
  - **含標點與空白**：`"A man, a plan, a canal: Panama"`，預期 `True`。
  - **一般失敗案例**：`"race a car"`，預期 `False`。
  - **全都是無效字元**：`".,"`，預期 `True`，因為過濾後是空字串。
  - **大小寫混合**：`"Aa"`，預期 `True`。

```python
def isPalindrome(s):
    left, right = 0, len(s) - 1

    while left < right:
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1

        if s[left].lower() != s[right].lower():
            return False

        left += 1
        right -= 1

    return True
```

### 11. Container With Most Water (Med.)

- **Problem (English)**:
  - You are given an array of heights where each value represents a vertical line.
  - Pick two lines so that, together with the x-axis, they form a container that holds the most water.
  - The area is the distance between the two lines multiplied by the shorter height.
- **題目（中文）**：
  - 給定一個高度陣列，每個值代表一條垂直線。
  - 請選出兩條線，與 x 軸共同形成一個能盛最多水的容器。
  - 容器面積等於兩線之間的距離乘上較短那側的高度。

- **Examples**:
  - Example 1: `height = [1,8,6,2,5,4,8,3,7]`
    - Output: `49`
    - Explanation: The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water (blue section) the container can contain is 49.
  - Example 2: `height = [1,1]`
    - Output: `1`
- **Constraints**:
  - `n == height.length`
  - `2 <= n <= 10^5`
  - `0 <= height[i] <= 10^4`

- **套路**：對撞指標 + 移動短板
- **思路**：
  - 面積由 `寬度 * min(height[left], height[right])` 決定，真正限制答案的是較短的那一側。
  - 若移動較高那邊，寬度只會縮小，而短板高度不會因此變高，因此不可能得到更好的答案。
  - 所以每一步都移動較短那邊，才有機會在寬度變小的同時，用更高的短板補回面積。
- **TC**：O(n)
  - 左右指標都只會單向往中間移動一次，總共最多移動 `n - 1` 步。
- **SC**：O(1)
  - 只需要左右指標與最佳答案，不需要額外資料結構。
- **其他思路**：
  - **暴力枚舉所有左右邊界**：對每一對 `(i, j)` 計算面積並取最大值。TC: O(n^2), SC: O(1)。
- **解法比較**：
  - **雙指標**：優點是線性時間，也是這題標準解。缺點是要理解「為什麼只能移動短板」。
  - **暴力法**：優點是直觀。缺點是輸入稍大就會超時。
- **測試重點 (Testing)**：
  - **題目範例**：`[1,8,6,2,5,4,8,3,7]`，預期 `49`。
  - **最小長度**：`[1,1]`，預期 `1`。
  - **單調遞增**：`[1,2,3,4,5]`，確認不會錯誤只看最右端。
  - **兩端同高**：`[4,3,2,1,4]`，預期 `16`。

```python
def maxArea(height):
  left, right = 0, len(height) - 1
  best = 0

  while left < right:
      width = right - left
      best = max(best, width * min(height[left], height[right]))

      if height[left] < height[right]:
          left += 1
      else:
          right -= 1

  return best
```

### 15. 3Sum (Med.)

- **Problem (English)**:
  - Given an integer array `nums`, return every unique triplet `[nums[i], nums[j], nums[k]]` whose sum is `0`.
  - The three indices must be different, and duplicate triplets are not allowed in the answer.
- **題目（中文）**：
  - 給定整數陣列 `nums`，找出所有總和為 `0` 的不重複三元組 `[nums[i], nums[j], nums[k]]`。
  - 三個元素必須來自不同索引，而且答案中不能出現重複三元組。

- **Examples**:
  - Example 1: `nums = [-1,0,1,2,-1,-4]`
    - Output: `[[-1,-1,2],[-1,0,1]]`
    - Explanation: nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0.
nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0.
nums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0.
The distinct triplets are [-1,0,1] and [-1,-1,2].
Notice that the order of the output and the order of the triplets does not matter.
  - Example 2: `nums = [0,1,1]`
    - Output: `[]`
    - Explanation: The only possible triplet does not sum up to 0.
  - Example 3: `nums = [0,0,0]`
    - Output: `[[0,0,0]]`
    - Explanation: The only possible triplet sums up to 0.
- **Constraints**:
  - `3 <= nums.length <= 3000`
  - `-10^5 <= nums[i] <= 10^5`

- **套路**：排序 + 固定一個數 + 對撞指標
- **思路**：
  - 先排序後，固定 `nums[i]`，問題就變成在右側區間找兩個數，使得三數總和為 0。
  - 因為陣列已排序，若當前總和太小就移動左指標，太大就移動右指標，可以線性調整。
  - 為了避免重複答案，要同時跳過重複的 `nums[i]`，以及找到解之後左右兩邊的重複值。
- **TC**：O(n^2)
  - 排序是 O(n log n)，外層固定一個數共 O(n)，內層雙指標每輪 O(n)，所以總和由 O(n^2) 主導。
- **SC**：O(1)
  - 若不計排序過程與輸出答案本身，只使用常數額外變數。
- **其他思路**：
  - **固定一個數 + Hash Set 找 2Sum**：對每個 `i` 用集合記錄看過的數，找目標 `-nums[i] - num`。TC: O(n^2), SC: O(n)。
- **解法比較**：
  - **排序 + 雙指標**：優點是去重邏輯清楚、空間更省。缺點是需要先排序。
  - **Hash Set**：優點是概念接近 2Sum。缺點是去重更麻煩，也需要額外空間。
- **測試重點 (Testing)**：
  - **經典案例**：`[-1,0,1,2,-1,-4]`，應得到 `[[-1,-1,2],[-1,0,1]]`。
  - **全部為 0**：`[0,0,0,0]`，只能輸出一組 `[0,0,0]`。
  - **無解情況**：`[1,2,-2,-1]`，預期空陣列。
  - **大量重複值**：`[-2,0,0,2,2]`，確認不會重複收錄答案。

```python
def threeSum(nums):
  nums.sort()
  result = []

  for index in range(len(nums) - 2):
    if index > 0 and nums[index] == nums[index - 1]:
      continue

    left, right = index + 1, len(nums) - 1
    while left < right:
      total = nums[index] + nums[left] + nums[right]

      if total == 0:
        result.append([nums[index], nums[left], nums[right]])
        left += 1
        right -= 1

        while left < right and nums[left] == nums[left - 1]:
          left += 1
        while left < right and nums[right] == nums[right + 1]:
          right -= 1
      elif total < 0:
        left += 1
      else:
        right -= 1

  return result
```

### 16. 3Sum Closest (Med.)

- **Problem (English)**:
  - Given an integer array `nums` and an integer `target`, choose three different elements whose sum is closest to `target`.
  - Return that sum.
  - You may assume each input has exactly one best answer.
- **題目（中文）**：
  - 給定整數陣列 `nums` 與整數 `target`，請選出三個不同元素，使它們的總和最接近 `target`。
  - 回傳這個最接近的總和。
  - 題目保證每組輸入只有一個最佳答案。

- **Examples**:
  - Example 1: `nums = [-1,2,1,-4], target = 1`
    - Output: `2`
    - Explanation: The sum that is closest to the target is 2. (-1 + 2 + 1 = 2).
  - Example 2: `nums = [0,0,0], target = 1`
    - Output: `0`
    - Explanation: The sum that is closest to the target is 0. (0 + 0 + 0 = 0).
- **Constraints**:
  - `3 <= nums.length <= 500`
  - `-1000 <= nums[i] <= 1000`
  - `-10^4 <= target <= 10^4`

- **套路**：排序 + 對撞指標找最接近值
- **思路**：
  - 和 3Sum 一樣先排序並固定第一個數，差別在於不需要剛好命中，只要持續維護最接近 `target` 的總和即可。
  - 因為排序後總和會隨著左指標右移而變大、右指標左移而變小，所以仍可用雙指標調整。
  - 只要發現更接近的總和就更新答案；若剛好等於 `target`，可直接提前返回。
- **TC**：O(n^2)
  - 排序 O(n log n)，外層固定一個數，內層雙指標掃過剩餘區間，整體仍由 O(n^2) 主導。
- **SC**：O(1)
  - 若不計排序空間，只使用常數額外變數。
- **其他思路**：
  - **排序 + 固定兩個數 + Binary Search 第三個數**：枚舉前兩個位置，對第三個值做二分搜尋。TC: O(n^2 log n), SC: O(1)。
- **解法比較**：
  - **雙指標**：優點是排序後可以線性調整第三個位置，速度更快。缺點是仍要先排序。
  - **Binary Search**：優點是想法直接。缺點是多了一個 `log n` 因子，整體較慢。
- **測試重點 (Testing)**：
  - **題目範例**：`nums = [-1,2,1,-4], target = 1`，預期 `2`。
  - **完全命中**：存在某組三數剛好等於 `target`，應直接返回該值。
  - **含重複與負數**：確認排序後不影響答案正確性。
  - **陣列最小合法長度**：只有 3 個元素時應直接得到那 3 個數的和。

```python
def threeSumClosest(nums, target):
  nums.sort()
  closest = nums[0] + nums[1] + nums[2]

  for index in range(len(nums) - 2):
    left, right = index + 1, len(nums) - 1

    while left < right:
      total = nums[index] + nums[left] + nums[right]

      if abs(total - target) < abs(closest - target):
        closest = total

      if total < target:
        left += 1
      elif total > target:
        right -= 1
      else:
        return total

  return closest
```

### 42. Trapping Rain Water (Hard)

- **Problem (English)**:
  - Given an elevation map where each bar has width `1`, compute how much rainwater can be trapped after raining.
- **題目（中文）**：
  - 給定一張高度圖，每根柱子的寬度都為 `1`，請計算下雨後總共能接住多少水。

- **Examples**:
  - Example 1: `height = [0,1,0,2,1,0,1,3,2,1,2,1]`
    - Output: `6`
    - Explanation: The above elevation map (black section) is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water (blue section) are being trapped.
  - Example 2: `height = [4,2,0,3,2,5]`
    - Output: `9`
- **Constraints**:
  - `n == height.length`
  - `1 <= n <= 2 * 10^4`
  - `0 <= height[i] <= 10^5`

- **套路**：對撞指標 + 左右最大值
- **思路**：
  - 每一格能裝多少水，取決於它左邊最高牆與右邊最高牆中較矮的那個，再減去自身高度。
  - 雙指標作法的關鍵是：若 `height[left] < height[right]`，代表目前左側的有效上界已經由 `left_max` 決定，右側至少還有一根更高的柱子撐住它。
  - 因此每次處理較矮那一側，就能在不預先知道另一邊完整資訊時，正確累加當前可接的水量。
- **TC**：O(n)
  - 左右指標都只會往中間移動一次，每個位置最多處理一次。
- **SC**：O(1)
  - 只維護左右指標、左右最大值與累積答案，沒有額外陣列。
- **其他思路**：
  - **前綴最大值 + 後綴最大值**：先預處理每個位置左側最高與右側最高，再逐格計算。TC: O(n), SC: O(n)。
  - **單調遞減 Stack**：把每個凹槽的水量轉成找到左右邊界後再計算面積。TC: O(n), SC: O(n)。
- **解法比較**：
  - **雙指標**：優點是空間最佳，也是面試常見標準解。缺點是推理較抽象。
  - **前後綴陣列**：優點是觀念最直觀。缺點是多用 O(n) 空間。
  - **單調 Stack**：優點是能連到 histogram 類題目。缺點是實作與除錯成本較高。
- **測試重點 (Testing)**：
  - **題目範例**：`[0,1,0,2,1,0,1,3,2,1,2,1]`，預期 `6`。
  - **單調遞增 / 遞減**：如 `[1,2,3,4]`、`[4,3,2,1]`，都應為 `0`。
  - **短陣列**：長度小於 3 不可能接水。
  - **多個凹槽**：`[4,2,0,3,2,5]`，預期 `9`。

```python
def trap(height):
    left, right = 0, len(height) - 1
    left_max = right_max = 0
    water = 0

    while left < right:
        if height[left] < height[right]:
            left_max = max(left_max, height[left])
            water += left_max - height[left]
            left += 1
        else:
            right_max = max(right_max, height[right])
            water += right_max - height[right]
            right -= 1

    return water
```

### 283. Move Zeroes (Easy)

- **Problem (English)**:
  - Move all zeroes in the array to the end while keeping the relative order of non-zero values unchanged.
  - The modification must be done in place.
- **題目（中文）**：
  - 把陣列中的所有 `0` 移到最後面，同時維持非零元素的相對順序不變。
  - 必須原地完成這個修改。

- **Examples**:
  - Example 1: `nums = [0,1,0,3,12]`
    - Output: `[1,3,12,0,0]`
  - Example 2: `nums = [0]`
    - Output: `[0]`
- **Constraints**:
  - `1 <= nums.length <= 10^4`
  - `-2^31 <= nums[i] <= 2^31 - 1`

- **套路**：快慢指標原地交換
- **思路**：
  - `fast` 負責掃描整個陣列，`slow` 指向下一個應放非零元素的位置。
  - 每當 `fast` 看到非零值，就把它交換到 `slow` 位置，保證左半部始終維持已整理好的非零區。
  - 因為掃描順序不變，所以非零元素的相對順序也會被保留下來。
- **TC**：O(n)
  - 每個元素只會被 `fast` 掃過一次，交換也只在遇到非零元素時發生。
- **SC**：O(1)
  - 完全原地操作，只用兩個指標。
- **其他思路**：
  - **覆寫非零值後補 0**：先把所有非零值依序寫到前面，再把剩下位置補成 0。TC: O(n), SC: O(1)。
- **解法比較**：
  - **交換法**：優點是單趟完成、語意直觀。缺點是當非零元素很多時，可能出現一些自我交換。
  - **覆寫法**：優點是寫入次數通常更可控。缺點是還要再補一輪尾端的 0。
- **測試重點 (Testing)**：
  - **基本案例**：`[0,1,0,3,12]`，處理後應為 `[1,3,12,0,0]`。
  - **全部為 0**：不應出錯，也不應改變長度。
  - **完全沒有 0**：原陣列應保持不變。
  - **0 都在尾端 / 開頭**：確認邊界位置正確。

```python
def moveZeroes(nums):
    slow = 0

    for fast in range(len(nums)):
        if nums[fast] != 0:
            nums[slow], nums[fast] = nums[fast], nums[slow]
            slow += 1
```

### 977. Squares of a Sorted Array (Easy)

- **Problem (English)**:
  - You are given an integer array sorted in non-decreasing order.
  - Return an array of the square of each number, also sorted in non-decreasing order.
- **題目（中文）**：
  - 給定一個已按非遞減順序排序的整數陣列。
  - 請回傳每個數字平方後所組成的新陣列，並且結果也要保持非遞減排序。

- **Examples**:
  - Example 1: `nums = [-4,-1,0,3,10]`
    - Output: `[0,1,9,16,100]`
    - Explanation: After squaring, the array becomes [16,1,0,9,100].
After sorting, it becomes [0,1,9,16,100].
  - Example 2: `nums = [-7,-3,2,3,11]`
    - Output: `[4,9,9,49,121]`
- **Constraints**:
  - `1 <= nums.length <= 10^4`
  - `-10^4 <= nums[i] <= 10^4`
  - nums is sorted in non-decreasing order.

- **套路**：對撞指標從尾端填答案
- **思路**：
  - 原陣列雖然已排序，但平方後的最大值可能出現在最左邊的負數，或最右邊的正數。
  - 因此比較兩端的絕對值，較大的平方一定是目前答案中尚未填入的最大值。
  - 從結果陣列尾端往前填，就能避免再做一次排序。
- **TC**：O(n)
  - 每次迴圈都會消耗左端或右端一個元素，總共剛好處理 `n` 個元素。
- **SC**：O(n)
  - 需要一個新陣列存排序後的平方結果。
- **其他思路**：
  - **全部平方後再排序**：先把每個數字平方，再呼叫排序。TC: O(n log n), SC: O(n) 或取決於排序實作。
- **解法比較**：
  - **雙指標**：優點是線性時間，充分利用題目已排序的資訊。缺點是需要從尾端填值的思維轉換。
  - **平方後排序**：優點是最直觀。缺點是浪費了原本已排序的結構。
- **測試重點 (Testing)**：
  - **經典案例**：`[-4,-1,0,3,10]`，預期 `[0,1,9,16,100]`。
  - **全負數**：`[-7,-3,-1]`，確認結果仍需遞增。
  - **全非負數**：`[0,2,3]`，應和直接平方相同。
  - **含重複絕對值**：`[-2,2]`，避免漏掉相同平方值。

```python
def sortedSquares(nums):
    left, right = 0, len(nums) - 1
    result = [0] * len(nums)

    for index in range(len(nums) - 1, -1, -1):
        if abs(nums[left]) > abs(nums[right]):
            result[index] = nums[left] * nums[left]
            left += 1
        else:
            result[index] = nums[right] * nums[right]
            right -= 1

    return result
```

### 5. Longest Palindromic Substring (Med.)

- **Problem (English)**:
  - Given a string `s`, return its longest contiguous substring that is a palindrome.
- **題目（中文）**：
  - 給定字串 `s`，請回傳其中最長的回文連續子字串。

- **Examples**:
  - Example 1: `s = "babad"`
    - Output: `"bab"`
    - Explanation: "aba" is also a valid answer.
  - Example 2: `s = "cbbd"`
    - Output: `"bb"`
- **Constraints**:
  - `1 <= s.length <= 1000`
  - s consist of only digits and English letters.

- **套路**：中心擴散
- **思路**：
  - 回文的中心只有兩種型態：單一字元的奇數中心，或兩個相鄰字元組成的偶數中心。
  - 以每個位置為中心向左右擴散，直到兩邊字元不同或超出邊界，便得到該中心的最長回文。
  - 枚舉所有中心後，取最長的那段即可。
- **TC**：O(n^2)
  - 一共有 O(n) 個中心，每個中心最壞可能往外擴到 O(n) 長度。
- **SC**：O(1)
  - 只使用索引與目前最佳答案位置，沒有 DP 表。
- **其他思路**：
  - **DP 判斷 `s[i:j]` 是否為回文**：用表格記錄區間是否為回文，再更新最長答案。TC: O(n^2), SC: O(n^2)。
  - **Manacher's Algorithm**：可做到 TC: O(n), SC: O(n)，但實作難度高。
- **解法比較**：
  - **中心擴散**：優點是容易實作，也是面試最常用版本。缺點是最壞仍是 O(n^2)。
  - **DP**：優點是狀態明確。缺點是空間較大。
  - **Manacher**：優點是理論最佳。缺點是對大多數面試來說過於複雜。
- **測試重點 (Testing)**：
  - **奇數回文**：`"babad"`，預期 `"bab"` 或 `"aba"`。
  - **偶數回文**：`"cbbd"`，預期 `"bb"`。
  - **單字元字串**：`"a"`，預期 `"a"`。
  - **全部相同字元**：`"aaaa"`，預期整串。

```python
def longestPalindrome(s):
    best = ""

    def expand(left, right):
        while left >= 0 and right < len(s) and s[left] == s[right]:
            left -= 1
            right += 1
        return s[left + 1:right] // 因為最後一次擴散會多移動一次，所以回傳時要調整回上一回合的位置

    for index in range(len(s)):
        odd = expand(index, index) // 奇數是同一點左右擴散
        even = expand(index, index + 1) // 偶數是相鄰兩點往外擴散
        candidate = odd if len(odd) >= len(even) else even
        if len(candidate) > len(best):
            best = candidate

    return best
```

### 9. Palindrome Number (Easy)

- **Problem (English)**:
  - Determine whether an integer reads the same forward and backward.
- **題目（中文）**：
  - 判斷一個整數是否為回文數，也就是正反讀都相同。

- **Examples**:
  - Example 1: `x = 121`
    - Output: `true`
    - Explanation: 121 reads as 121 from left to right and from right to left.
  - Example 2: `x = -121`
    - Output: `false`
    - Explanation: From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.
  - Example 3: `x = 10`
    - Output: `false`
    - Explanation: Reads 01 from right to left. Therefore it is not a palindrome.
- **Constraints**:
  - `-2^31 <= x <= 2^31 - 1`

- **套路**：反轉後半段數字
- **思路**：
  - 負數一定不是回文；尾數是 0 但本身不是 0 的正數也不可能是回文。
  - 不需要把整個數字都反轉，只要反轉後半段，直到 `reversed_half >= x` 為止。
  - 偶數位時比較 `x == reversed_half`，奇數位時中間那位不影響回文性，所以比較 `x == reversed_half // 10`。
- **TC**：O(log n)
  - 每次迴圈都去掉一位數字，處理步數與十進位位數成正比。
- **SC**：O(1)
  - 只使用常數個整數變數。
- **其他思路**：
  - **轉字串後對撞比較**：把數字轉成字串，再判斷是否為回文。TC: O(log n), SC: O(log n)。
- **解法比較**：
  - **反轉後半段**：優點是不用額外字串，符合題目對數字操作的精神。缺點是思路較不直覺。
  - **字串法**：優點是最容易寫。缺點是多用了額外空間，也較不像數學題解法。
- **測試重點 (Testing)**：
  - **正常回文**：`121`，預期 `True`。
  - **負數**：`-121`，預期 `False`。
  - **尾數為 0**：`10`，預期 `False`。
  - **0 本身**：`0`，預期 `True`。
  - **奇數與偶數位數**：例如 `12321`、`1221` 都應正確處理。

```python
def isPalindrome(x):
    if x < 0 or (x % 10 == 0 and x != 0):
        return False

    reversed_half = 0
    while x > reversed_half:
        reversed_half = reversed_half * 10 + x % 10
        x //= 10

    return x == reversed_half or x == reversed_half // 10
```