# 六、Linked List（鏈結串列）

## 通用套路

**快慢指標**：Floyd's Tortoise and Hare。快走兩步、慢走一步，用於找中點、偵測環。

**虛擬頭節點 (Dummy Node)**：在鏈結串列頭部新增一個假節點，簡化邊界處理。

**遞迴 vs 迭代**：鏈結串列操作適合練習兩種寫法。

```python
# 套路模板：找鏈結串列中點
def find_middle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow  # slow 就是中點

# 套路模板：反轉鏈結串列
def reverse_list(head):
    prev = None
    curr = head
    while curr:
        next_node = curr.next
        curr.next = prev
        prev = curr
        curr = next_node
    return prev
```

---

### 206. Reverse Linked List (Easy)

- **套路**：迭代三指標反轉
- **思路**：用 prev/curr/next 三個指標，逐一將每個節點的 next 指向前一個。
- **💡 白話文解說**：反轉鏈結串列，就像是讓一排人完全踵頂走。你從第一個節點開始，讓它的指向從「往後」改為「往前（None）」，然後逐一往後處理。整個過程只需要 3 個指標： prev（已處理的領頭）、curr（當前）、next_node（備份下一個），每步反轉一個節點的指向。
- **複雜度**：O(n) / O(1)

```python
def reverseList(head):
    prev = None
    curr = head
    while curr:
        next_node = curr.next
        curr.next = prev
        prev = curr
        curr = next_node
    return prev
```

### 876. Middle of the Linked List (Easy)

- **套路**：快慢指標
- **思路**：快指標走兩步、慢指標走一步。快到終點時，慢剛好在中間。
- **複雜度**：O(n) / O(1)

```python
def middleNode(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow
```

### 141. Linked List Cycle (Easy)

- **套路**：快慢指標偵測環
- **思路**：快慢指標同時出發。如果有環，快指標最終會追上慢指標。
- **💡 白話文解說**：想像兩個人在操場跑步，一個跑得快（快指標）、一個跑得慢（慢指標）。如果操場是直的，快的永遠不會遇到慢的；但如果操場是個圓圈（有環），跑得快的人最後一定會從後面「套圈圈」追上跑得慢的人。只要兩個人相遇，就代表有環！
- **複雜度**：O(n) / O(1)

```python
def hasCycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False
```

### 21. Merge Two Sorted Lists (Easy)

- **套路**：Dummy Node + 逐一比較
- **思路**：建一個 dummy 節點，每次比較兩個鏈結串列的頭，較小的接到結果後面。
- **💡 白話文解說**：想像你在把兩副已經排好點數的撲克牌合在一起。你每次只要比較兩副牌最上面那張，把比較小的那張拿出來放到新的牌堆裡，最後把還沒拿完的那副牌整個接在後面就完成了。
- **複雜度**：O(n+m) / O(1)

```python
def mergeTwoLists(list1, list2):
    dummy = ListNode(0)
    curr = dummy
    while list1 and list2:
        if list1.val <= list2.val:
            curr.next = list1
            list1 = list1.next
        else:
            curr.next = list2
            list2 = list2.next
        curr = curr.next
    curr.next = list1 or list2
    return dummy.next
```

### 234. Palindrome Linked List (Easy)

- **套路**：快慢指標找中點 + 反轉後半段 + 逐一比較
- **思路**：找到中點後反轉後半段，然後從頭和從中間開始逐一比較。
- **複雜度**：O(n) / O(1)

```python
def isPalindrome(head):
    # 找中點
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    # 反轉後半段
    prev = None
    while slow:
        next_node = slow.next
        slow.next = prev
        prev = slow
        slow = next_node
    # 比較
    left, right = head, prev
    while right:
        if left.val != right.val:
            return False
        left = left.next
        right = right.next
    return True
```

### 19. Remove Nth Node From End of List (Med.)

- **套路**：快慢指標（間距 N）
- **思路**：快指標先走 N 步，然後快慢同時走。快到末尾時，慢剛好在倒數第 N 個前面。
- **💡 白話文解說**：你要刪除倒數第 N 個人。你可以派兩個探子，讓第一個探子先往前走 N 步。接著兩個探子一起以同樣的速度往下走。當第一個探子抵達終點時，第二個探子剛好就會停在「要被刪除的那個人」的前面一格！
- **要點**：用 Dummy Node 處理「刪除頭節點」的邊界。
- **複雜度**：O(n) / O(1)

```python
def removeNthFromEnd(head, n):
    dummy = ListNode(0, head)
    fast = slow = dummy
    for _ in range(n + 1):
        fast = fast.next
    while fast:
        fast = fast.next
        slow = slow.next
    slow.next = slow.next.next
    return dummy.next
```

### 24. Swap Nodes in Pairs (Med.)

- **套路**：Dummy Node + 成對交換
- **思路**：每次取兩個節點交換，指標跳兩步。
- **💡 白話文解說**：要把相鄰的節點兩兩互換，就像排隊時把前後兩個人的位置對調。我們在最前面放一個 dummy 銀主，讓他每次把緊跟在後的兩個節點互換位置，之後跳過這兩個繼續處理後面的，重複直到結束。
- **複雜度**：O(n) / O(1)

```python
def swapPairs(head):
    dummy = ListNode(0, head)
    prev = dummy
    while prev.next and prev.next.next:
        a, b = prev.next, prev.next.next
        prev.next = b
        a.next = b.next
        b.next = a
        prev = a
    return dummy.next
```

### 143. Reorder List (Med.)

- **套路**：找中點 + 反轉後半 + 交錯合併
- **思路**：1→2→3→4→5 變成 1→5→2→4→3。分三步：找中點切開、反轉後半、交錯合併。
- **複雜度**：O(n) / O(1)

```python
def reorderList(head):
    # 步驟 1：找中點
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    # 步驟 2：反轉後半段
    prev, curr = None, slow.next
    slow.next = None  # 切斷
    while curr:
        next_node = curr.next
        curr.next = prev
        prev = curr
        curr = next_node
    # 步驟 3：交錯合併
    first, second = head, prev
    while second:
        tmp1, tmp2 = first.next, second.next
        first.next = second
        second.next = tmp1
        first, second = tmp1, tmp2
```

### 328. Odd Even Linked List (Med.)

- **套路**：分離奇偶串接
- **思路**：用兩個指標分別串起奇數位和偶數位的節點，最後把偶數鏈接到奇數鏈尾部。
- **複雜度**：O(n) / O(1)

```python
def oddEvenList(head):
    if not head:
        return head
    odd, even = head, head.next
    even_head = even
    while even and even.next:
        odd.next = even.next
        odd = odd.next
        even.next = odd.next
        even = even.next
    odd.next = even_head
    return head
```

### 61. Rotate List (Med.)

- **套路**：成環再斷開
- **思路**：尾接頭形成環，然後在 (len - k % len) 處斷開。
- **複雜度**：O(n) / O(1)

```python
def rotateRight(head, k):
    if not head or not head.next or k == 0:
        return head
    # 計算長度並找到尾巴
    length = 1
    tail = head
    while tail.next:
        tail = tail.next
        length += 1
    k %= length
    if k == 0:
        return head
    # 成環
    tail.next = head
    # 找新的尾巴（從頭走 length - k 步）
    new_tail = head
    for _ in range(length - k - 1):
        new_tail = new_tail.next
    new_head = new_tail.next
    new_tail.next = None
    return new_head
```

### 148. Sort List (Med.)

- **套路**：Merge Sort（找中點 + 遞迴排序 + 合併）
- **思路**：鏈結串列天生適合 Merge Sort：找中點切開、各自排序、合併有序鏈結串列。
- **複雜度**：O(n·log n) / O(log n) 遞迴棧

```python
def sortList(head):
    if not head or not head.next:
        return head
    # 找中點
    slow, fast = head, head.next
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    mid = slow.next
    slow.next = None
    # 遞迴排序
    left = sortList(head)
    right = sortList(mid)
    # 合併
    dummy = ListNode(0)
    curr = dummy
    while left and right:
        if left.val <= right.val:
            curr.next = left
            left = left.next
        else:
            curr.next = right
            right = right.next
        curr = curr.next
    curr.next = left or right
    return dummy.next
```

### 287. Find the Duplicate Number (Med.)

- **套路**：Floyd 環偵測（快慢指標）
- **思路**：把值當作 next 索引，問題轉化為「鏈結串列找環的入口」。快慢指標相遇後，一個回起點，兩個各走一步直到再次相遇就是重複值。
- **要點**：這題不修改陣列、O(1) 空間的最佳解。
- **複雜度**：O(n) / O(1)

```python
def findDuplicate(nums):
    # 階段 1：快慢指標找相遇點
    slow = fast = nums[0]
    while True:
        slow = nums[slow]
        fast = nums[nums[fast]]
        if slow == fast:
            break
    # 階段 2：找環的入口
    slow = nums[0]
    while slow != fast:
        slow = nums[slow]
        fast = nums[fast]
    return slow
```

### 2. Add Two Numbers (Med.)

- **套路**：逐位相加 + 進位
- **思路**：兩個鏈結串列從頭開始逐位相加，carry 傳遞進位。類似手算加法。
- **💡 白話文解說**：這就跟國小學的直式加法一模一樣！從最低位（個位數）開始，兩個數字相加，如果超過 10 就把進位（carry）記下來留給下一個位數去加，直到兩個數字都加完，而且進位也歸零為止。
- **複雜度**：O(max(m,n)) / O(1)

```python
def addTwoNumbers(l1, l2):
    dummy = ListNode(0)
    curr = dummy
    carry = 0
    while l1 or l2 or carry:
        val = carry
        if l1:
            val += l1.val
            l1 = l1.next
        if l2:
            val += l2.val
            l2 = l2.next
        carry, val = divmod(val, 10)
        curr.next = ListNode(val)
        curr = curr.next
    return dummy.next
```

### 23. Merge k Sorted Lists (Hard)

- **套路**：分治合併 / Min-Heap
- **思路**：用 Min-Heap 同時維護 k 個鏈結串列的當前頭部，每次取最小的加入結果。
- **💡 白話文解說**：想像你有 K 副已經排好的撲克牌，你要把它們合併。如果你每次都檢查 K 張牌會太慢，所以你可以找一個「裁判」（最小堆積 Min-Heap），同時把 K 副牌最上面的牌交給裁判。裁判每次只會把最小的那張發給你，你就可以一直拿到目前最小的牌了！
- **複雜度**：O(n·log k) / O(k)

```python
import heapq

def mergeKLists(lists):
    heap = []
    for i, lst in enumerate(lists):
        if lst:
            heapq.heappush(heap, (lst.val, i, lst))
    dummy = ListNode(0)
    curr = dummy
    while heap:
        val, i, node = heapq.heappop(heap)
        curr.next = node
        curr = curr.next
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))
    return dummy.next
```

### 25. Reverse Nodes in k-Group (Hard)

- **套路**：逐組反轉
- **💡 白話文解說**：和逐對互換類似，但這次是每 k 個為一組倒過來。先確認後面還剩幾個節點，只有夠 k 個才做反轉；把這 k 個節點的順序倒過來，然後接上遞迴處理後面剩下的部分。
- **思路**：先檢查剩餘節點是否 >= k，是的話反轉這 k 個並接上遞迴處理後續的結果。
- **複雜度**：O(n) / O(n/k) 遞迴棧

```python
def reverseKGroup(head, k):
    # 檢查是否有 k 個節點
    node = head
    for _ in range(k):
        if not node:
            return head  # 不足 k 個，不反轉
        node = node.next
    # 反轉前 k 個
    prev, curr = None, head
    for _ in range(k):
        next_node = curr.next
        curr.next = prev
        prev = curr
        curr = next_node
    # head 現在是反轉後的尾部，接上後續遞迴結果
    head.next = reverseKGroup(curr, k)
    return prev
```

---
