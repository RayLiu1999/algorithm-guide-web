# 六、Linked List（鏈結串列）

## 題目目錄

- [206. Reverse Linked List (Easy)](#206-reverse-linked-list-easy)
- [876. Middle of the Linked List (Easy)](#876-middle-of-the-linked-list-easy)
- [141. Linked List Cycle (Easy)](#141-linked-list-cycle-easy)
- [21. Merge Two Sorted Lists (Easy)](#21-merge-two-sorted-lists-easy)
- [234. Palindrome Linked List (Easy)](#234-palindrome-linked-list-easy)
- [19. Remove Nth Node From End of List (Med.)](#19-remove-nth-node-from-end-of-list-med)
- [24. Swap Nodes in Pairs (Med.)](#24-swap-nodes-in-pairs-med)
- [143. Reorder List (Med.)](#143-reorder-list-med)
- [328. Odd Even Linked List (Med.)](#328-odd-even-linked-list-med)
- [61. Rotate List (Med.)](#61-rotate-list-med)
- [148. Sort List (Med.)](#148-sort-list-med)
- [287. Find the Duplicate Number (Med.)](#287-find-the-duplicate-number-med)
- [2. Add Two Numbers (Med.)](#2-add-two-numbers-med)
- [23. Merge k Sorted Lists (Hard)](#23-merge-k-sorted-lists-hard)
- [25. Reverse Nodes in k-Group (Hard)](#25-reverse-nodes-in-k-group-hard)

## 通用套路

**快慢指標**：快走兩步、慢走一步，常用來找中點、偵測環、切前後半段。

**虛擬頭節點 (Dummy Node)**：在頭部先放一個假節點，能統一刪除、插入、交換頭節點時的邊界處理。

**局部反轉 / 重新接線**：鏈結串列題的核心通常不是值怎麼算，而是每次修改 `next` 之前，有沒有先保住下一段的入口。

```python
# 套路模板：找鏈結串列中點
def find_middle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow


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

- **Problem (English)**:
  - Reverse a singly linked list so that the last node becomes the new head.
- **題目（中文）**：
  - 反轉一條單向鏈結串列，使原本的尾節點成為新的頭節點。

- **Examples**:
  - Example 1: `head = [1,2,3,4,5]`
    - Output: `[5,4,3,2,1]`
  - Example 2: `head = [1,2]`
    - Output: `[2,1]`
  - Example 3: `head = []`
    - Output: `[]`
- **Constraints**:
  - The number of nodes in the list is the range [0, 5000].
  - `-5000 <= Node.val <= 5000`

- **套路**：迭代反轉
- **思路**：
  - 用 `prev`、`curr`、`next_node` 三個指標依序保存前一個節點、目前節點與下一個節點。
  - 每走到一個節點，就先記住原本的 `next`，再把 `curr.next` 反指回 `prev`。
  - 走完整條鏈後，`prev` 就會停在新的頭節點。
- **TC**：O(n)
  - 每個節點只會被掃過一次，也只會改一次指標。
- **SC**：O(1)
  - 只使用三個工作指標，沒有額外資料結構。
- **其他思路**：
  - **遞迴反轉**：先把後半段反轉，再把當前節點接到尾端。TC: O(n), SC: O(n)（遞迴堆疊）。
- **解法比較**：
  - **迭代**：優點是空間最佳，也沒有遞迴深度限制。缺點是需要手動管理三個指標。
  - **遞迴**：優點是程式短且結構優雅。缺點是對長串列有堆疊風險。
- **測試重點 (Testing)**：
  - **一般案例**：`1 -> 2 -> 3 -> 4 -> 5`，應回傳 `5 -> 4 -> 3 -> 2 -> 1`。
  - **單一節點**：應原樣返回。
  - **兩個節點**：確認最小非 trivial 反轉正確。
  - **空串列**：應回傳 `None`。

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

- **Problem (English)**:
  - Return the middle node of a singly linked list.
  - If there are two middle nodes, return the second one.
- **題目（中文）**：
  - 回傳一條單向鏈結串列的中間節點。
  - 若有兩個中間節點，請回傳第二個。

- **Examples**:
  - Example 1: `head = [1,2,3,4,5]`
    - Output: `[3,4,5]`
    - Explanation: The middle node of the list is node 3.
  - Example 2: `head = [1,2,3,4,5,6]`
    - Output: `[4,5,6]`
    - Explanation: Since the list has two middle nodes with values 3 and 4, we return the second one.
- **Constraints**:
  - The number of nodes in the list is in the range [1, 100].
  - `1 <= Node.val <= 100`

- **套路**：快慢指標找中點
- **思路**：
  - `slow` 每次走一步，`fast` 每次走兩步。
  - 當 `fast` 走到尾端時，`slow` 剛好走到中間。
  - 若節點數是偶數，題目要回傳第二個中點，這個快慢指標寫法天然就會停在第二個中點。
- **TC**：O(n)
  - 快慢指標雖然速度不同，但本質上仍只做一次線性掃描。
- **SC**：O(1)
  - 只使用兩個指標。
- **其他思路**：
  - **先算長度再走一半**：第一趟求長度，第二趟走到 `length // 2`。TC: O(n), SC: O(1)。
- **解法比較**：
  - **快慢指標**：優點是一趟完成，面試最標準。缺點是對初學者來說停在第二個中點的原因要想一下。
  - **兩趟長度法**：優點是直觀。缺點是需要再走第二次。
- **測試重點 (Testing)**：
  - **奇數長度**：如 `1 -> 2 -> 3 -> 4 -> 5`，應回傳 `3`。
  - **偶數長度**：如 `1 -> 2 -> 3 -> 4 -> 5 -> 6`，應回傳 `4`。
  - **單一節點**：應直接回傳自己。
  - **兩個節點**：應回傳第二個節點。

```python
def middleNode(head):
    slow = fast = head

    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next

    return slow
```

### 141. Linked List Cycle (Easy)

- **Problem (English)**:
  - Determine whether a singly linked list contains a cycle.
  - The variable `pos` indicates the index that the tail connects to, and is used only to describe the input.
- **題目（中文）**：
  - 判斷一條單向鏈結串列是否存在環。
  - 輸入中的 `pos` 只用來描述尾節點連回哪個索引，不會作為函式參數傳入。

- **Examples**:
  - Example 1: `head = [3,2,0,-4], pos = 1`
    - Output: `true`
    - Explanation: There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed).
  - Example 2: `head = [1,2], pos = 0`
    - Output: `true`
    - Explanation: There is a cycle in the linked list, where the tail connects to the 0th node.
  - Example 3: `head = [1], pos = -1`
    - Output: `false`
    - Explanation: There is no cycle in the linked list.
- **Constraints**:
  - The number of the nodes in the list is in the range [0, 10^4].
  - `-10^5 <= Node.val <= 10^5`
  - pos is -1 or a valid index in the linked-list.

- **套路**：Floyd 快慢指標判環
- **思路**：
  - 若串列有環，快指標在環中每次比慢指標多走一步，最終一定會追上。
  - 若串列沒有環，快指標會先走到 `None`，此時可以直接判定無環。
  - 這題關鍵是利用「速度差」取代額外記憶體記錄走過的節點。
- **TC**：O(n)
  - 每個節點最多被快慢指標走過常數次；無環時快指標會先走到尾端，有環時會在有限步內相遇。
- **SC**：O(1)
  - 只使用兩個指標。
- **其他思路**：
  - **Hash Set 記節點位址**：每到一個節點就看是否出現過。TC: O(n), SC: O(n)。
- **解法比較**：
  - **快慢指標**：優點是空間最省，也是經典技巧。缺點是原理比 Hash Set 抽象。
  - **Hash Set**：優點是直觀。缺點是多花線性空間。
- **測試重點 (Testing)**：
  - **無環串列**：應回傳 `False`。
  - **環從中間開始**：確認能在環內相遇。
  - **單節點有環**：`head.next = head` 也要正確判斷。
  - **空串列**：應回傳 `False`。

```python
def hasCycle(head):
    slow = head
    fast = head

    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True

    return False
```

### 21. Merge Two Sorted Lists (Easy)

- **Problem (English)**:
  - Merge two sorted linked lists and return the merged sorted list.
  - The merged list should be formed by splicing together the nodes of the original lists.
- **題目（中文）**：
  - 合併兩條已排序的鏈結串列，並回傳新的排序串列。
  - 新串列應由原本兩條串列的節點重新接起來組成。

- **Examples**:
  - Example 1: `list1 = [1,2,4], list2 = [1,3,4]`
    - Output: `[1,1,2,3,4,4]`
  - Example 2: `list1 = [], list2 = []`
    - Output: `[]`
  - Example 3: `list1 = [], list2 = [0]`
    - Output: `[0]`
- **Constraints**:
  - The number of nodes in both lists is in the range [0, 50].
  - `-100 <= Node.val <= 100`
  - Both list1 and list2 are sorted in non-decreasing order.

- **套路**：Dummy Node 串接較小節點
- **思路**：
  - 建立虛擬頭節點 `dummy`，並用 `tail` 指向目前已合併串列的尾端。
  - 每次比較兩條串列的頭節點，把較小者接到 `tail.next`。
  - 其中一條走完後，剩餘部分一定已經有序，可以直接整段接上。
- **TC**：O(m + n)
  - 兩條串列的每個節點都只會被取出並接到答案一次。
- **SC**：O(1)
  - 只使用少量指標，沒有建立新的節點內容。
- **其他思路**：
  - **遞迴合併**：每次挑較小頭節點作為答案，剩下部分遞迴處理。TC: O(m + n), SC: O(m + n)（遞迴堆疊）。
- **解法比較**：
  - **Dummy 迭代**：優點是穩定、邊界最少。缺點是要手動維護尾指標。
  - **遞迴**：優點是程式短。缺點是有堆疊成本。
- **測試重點 (Testing)**：
  - **其中一條為空**：確認直接返回另一條。
  - **有重複值**：確認穩定接法不漏節點。
  - **長度差很多**：確認尾端整段接上正確。
  - **兩條都空**：應回傳 `None`。

```python
def mergeTwoLists(list1, list2):
    dummy = ListNode()
    tail = dummy

    while list1 and list2:
        if list1.val <= list2.val:
            tail.next = list1
            list1 = list1.next
        else:
            tail.next = list2
            list2 = list2.next
        tail = tail.next

    tail.next = list1 or list2
    return dummy.next
```

### 234. Palindrome Linked List (Easy)

- **Problem (English)**:
  - Determine whether a singly linked list forms a palindrome.
- **題目（中文）**：
  - 判斷一條單向鏈結串列是否為回文。

- **Examples**:
  - Example 1: `head = [1,2,2,1]`
    - Output: `true`
  - Example 2: `head = [1,2]`
    - Output: `false`
- **Constraints**:
  - The number of nodes in the list is in the range [1, 10^5].
  - `0 <= Node.val <= 9`

- **套路**：找中點 + 反轉後半段 + 雙向比對
- **思路**：
  - 先用快慢指標找到中點，將後半段原地反轉。
  - 接著從前半段頭與反轉後半段頭同步比較，只要出現一組值不同就不是回文。
  - 因為只反轉後半段，所以空間仍維持 O(1)。
- **TC**：O(n)
  - 找中點、反轉後半段、前後比對都各走線性長度，總和仍是 O(n)。
- **SC**：O(1)
  - 完全原地處理，只使用指標。
- **其他思路**：
  - **轉成陣列後對撞比較**：先把節點值抄到陣列，再用雙指標判斷。TC: O(n), SC: O(n)。
- **解法比較**：
  - **原地反轉後半段**：優點是符合進階要求、空間最佳。缺點是接線細節較多。
  - **陣列法**：優點是直觀。缺點是多用 O(n) 空間。
- **測試重點 (Testing)**：
  - **奇數長度回文**：如 `1 -> 2 -> 1`。
  - **偶數長度回文**：如 `1 -> 2 -> 2 -> 1`。
  - **中心附近才失敗**：確認不是只比頭尾。
  - **單一節點 / 空串列**：都應視為回文。

```python
def isPalindrome(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next

    prev = None
    while slow:
        next_node = slow.next
        slow.next = prev
        prev = slow
        slow = next_node

    left, right = head, prev
    while right:
        if left.val != right.val:
            return False
        left = left.next
        right = right.next

    return True
```

### 19. Remove Nth Node From End of List (Med.)

- **Problem (English)**:
  - Remove the `n`th node from the end of a linked list and return the head.
- **題目（中文）**：
  - 移除鏈結串列中倒數第 `n` 個節點，並回傳新的頭節點。

- **Examples**:
  - Example 1: `head = [1,2,3,4,5], n = 2`
    - Output: `[1,2,3,5]`
  - Example 2: `head = [1], n = 1`
    - Output: `[]`
  - Example 3: `head = [1,2], n = 1`
    - Output: `[1]`
- **Constraints**:
  - The number of nodes in the list is sz.
  - `1 <= sz <= 30`
  - `0 <= Node.val <= 100`
  - `1 <= n <= sz`

- **套路**：Dummy Node + 快慢指標固定距離
- **思路**：
  - 先讓 `fast` 從 `dummy` 出發往前走 `n` 步，之後再讓 `fast` 與 `slow` 同步前進。
  - 當 `fast.next` 走到尾端時，`slow.next` 就剛好是倒數第 `n` 個節點。
  - 使用 `dummy` 的好處是，即使刪的是原本頭節點，接線邏輯也完全一致。
- **TC**：O(n)
  - 只需要一次線性掃描找到目標節點前一個位置。
- **SC**：O(1)
  - 只使用固定數量的指標。
- **其他思路**：
  - **先算長度再刪除**：第一趟求長度，第二趟走到 `length - n` 的前一個節點。TC: O(n), SC: O(1)。
- **解法比較**：
  - **一趟快慢指標**：優點是一次完成，也是面試偏好的解法。缺點是距離關係要先想清楚。
  - **兩趟長度法**：優點是容易理解。缺點是要多走一次。
- **測試重點 (Testing)**：
  - **刪除頭節點**：`n == length` 時最容易出錯。
  - **刪除尾節點**：確認尾端接回 `None`。
  - **只有一個節點**：刪完後應回傳 `None`。
  - **一般中間節點**：確認鏈結不斷裂。

```python
def removeNthFromEnd(head, n):
    dummy = ListNode(0, head)
    fast = slow = dummy

    for _ in range(n):
        fast = fast.next

    while fast.next:
        fast = fast.next
        slow = slow.next

    slow.next = slow.next.next
    return dummy.next
```

### 24. Swap Nodes in Pairs (Med.)

- **Problem (English)**:
  - Swap every two adjacent nodes in a linked list and return the modified head.
  - You must swap the nodes themselves rather than only changing their values.
- **題目（中文）**：
  - 交換鏈結串列中每兩個相鄰節點，並回傳修改後的頭節點。
  - 必須交換節點本身，不能只修改節點值。

- **Examples**:
- **Constraints**:
  - The number of nodes in the list is in the range [0, 100].
  - `0 <= Node.val <= 100`

- **套路**：Dummy Node + 每次交換兩個節點
- **思路**：
  - 每輪都把 `prev` 後面的兩個節點 `first`、`second` 抓出來做局部重接。
  - 交換完成後，`prev` 前進到這組交換後的尾巴，也就是原本的 `first`。
  - Dummy Node 能讓「第一組就是頭節點」的情況也走同一套接線流程。
- **TC**：O(n)
  - 每個節點最多只會被訪問與接線常數次。
- **SC**：O(1)
  - 完全原地交換，只使用少量指標。
- **其他思路**：
  - **遞迴交換**：先交換前兩個，再把後面遞迴結果接回去。TC: O(n), SC: O(n)。
- **解法比較**：
  - **迭代接線**：優點是沒有遞迴深度問題。缺點是接線順序要非常小心。
  - **遞迴**：優點是結構漂亮。缺點是需要額外堆疊。
- **測試重點 (Testing)**：
  - **偶數節點數**：每個節點都應被交換。
  - **奇數節點數**：最後一個節點應保持不動。
  - **單一節點 / 空串列**：應原樣返回。
  - **只有兩個節點**：最小有效交換案例。

```python
def swapPairs(head):
    dummy = ListNode(0, head)
    prev = dummy

    while prev.next and prev.next.next:
        first = prev.next
        second = first.next

        prev.next = second
        first.next = second.next
        second.next = first

        prev = first

    return dummy.next
```

### 143. Reorder List (Med.)

- **Problem (English)**:
  - Reorder a linked list from `L0 -> L1 -> ... -> Ln` into `L0 -> Ln -> L1 -> Ln-1 -> L2 -> ...`.
  - You may not change node values; only node connections may be changed.
- **題目（中文）**：
  - 將鏈結串列由 `L0 -> L1 -> ... -> Ln` 重排成 `L0 -> Ln -> L1 -> Ln-1 -> L2 -> ...`。
  - 不可修改節點值，只能調整節點連接方式。

- **Examples**:
  - Example 1: `head = [1,2,3,4]`
    - Output: `[1,4,2,3]`
  - Example 2: `head = [1,2,3,4,5]`
    - Output: `[1,5,2,4,3]`
- **Constraints**:
  - The number of nodes in the list is in the range [1, 5 * 10^4].
  - `1 <= Node.val <= 1000`

- **套路**：找中點 + 反轉後半段 + 交錯合併
- **思路**：
  - 先用快慢指標把鏈結串列切成前後兩半。
  - 再把後半段反轉，讓原本尾端節點能從前往後依序取出。
  - 最後把前半段與反轉後半段交錯合併，就得到 `L0 -> Ln -> L1 -> Ln-1 ...` 的順序。
- **TC**：O(n)
  - 找中點、反轉、交錯合併都各做一次線性處理。
- **SC**：O(1)
  - 不借助陣列或堆疊，完全原地接線。
- **其他思路**：
  - **Stack / Deque 存所有節點**：先把節點收進容器，再從頭尾交錯取出。TC: O(n), SC: O(n)。
- **解法比較**：
  - **原地三步法**：優點是空間最佳，也是這題關鍵技巧。缺點是實作步驟多，容易漏切斷中點。
  - **Stack 法**：優點是概念直觀。缺點是多用 O(n) 空間。
- **測試重點 (Testing)**：
  - **長度 1、2**：應維持原樣。
  - **奇數長度**：中間節點最後應落在尾端。
  - **偶數長度**：確認兩半合併不漏節點。
  - **較長串列**：檢查是否出現環或斷鏈。

```python
def reorderList(head):
    if not head or not head.next:
        return

    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next

    prev = None
    curr = slow.next
    slow.next = None
    while curr:
        next_node = curr.next
        curr.next = prev
        prev = curr
        curr = next_node

    first, second = head, prev
    while second:
        next_first = first.next
        next_second = second.next
        first.next = second
        second.next = next_first
        first = next_first
        second = next_second
```

### 328. Odd Even Linked List (Med.)

- **Problem (English)**:
  - Group all nodes at odd indices together followed by nodes at even indices.
  - The relative order within the odd group and within the even group must stay the same.
- **題目（中文）**：
  - 將所有奇數位置的節點排在前面，再接上所有偶數位置的節點。
  - 奇數組內與偶數組內的相對順序都必須保留。

- **Examples**:
  - Example 1: `head = [1,2,3,4,5]`
    - Output: `[1,3,5,2,4]`
  - Example 2: `head = [2,1,3,5,6,4,7]`
    - Output: `[2,3,6,7,1,5,4]`
- **Constraints**:
  - The number of nodes in the linked list is in the range [0, 10^4].
  - `-10^6 <= Node.val <= 10^6`

- **套路**：奇偶指標分流後再拼接
- **思路**：
  - `odd` 串起所有奇數位置節點，`even` 串起所有偶數位置節點。
  - 每次更新時都把下一個奇數位接到 odd 鏈上，下一個偶數位接到 even 鏈上。
  - 最後把 odd 的尾端接回 even 的頭，就能完成重排，且保留各自原本相對順序。
- **TC**：O(n)
  - 每個節點最多被重新接線一次。
- **SC**：O(1)
  - 完全原地調整，不需要新節點。
- **其他思路**：
  - **建立兩條新串列再接起來**：分別蒐集奇數位與偶數位節點。TC: O(n), SC: O(1) 若重用節點，或 O(n) 若新建節點。
- **解法比較**：
  - **原地分流**：優點是空間最佳。缺點是奇偶指標更新順序容易寫錯。
  - **新串列法**：優點是較直觀。缺點是程式較長，且可能多用節點或額外指標。
- **測試重點 (Testing)**：
  - **節點數少於 3**：應原樣返回。
  - **奇數與偶數長度**：都要確認尾端接線正確。
  - **相對順序保留**：奇數位彼此與偶數位彼此的原順序都不能亂。
  - **多節點混合**：檢查不會出現環。

```python
def oddEvenList(head):
    if not head or not head.next:
        return head

    odd = head
    even = head.next
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

- **Problem (English)**:
  - Rotate a linked list to the right by `k` places.
- **題目（中文）**：
  - 將鏈結串列向右旋轉 `k` 次。

- **Examples**:
  - Example 1: `head = [1,2,3,4,5], k = 2`
    - Output: `[4,5,1,2,3]`
  - Example 2: `head = [0,1,2], k = 4`
    - Output: `[2,0,1]`
- **Constraints**:
  - The number of nodes in the list is in the range [0, 500].
  - `-100 <= Node.val <= 100`
  - `0 <= k <= 2 * 10^9`

- **套路**：先成環再斷開
- **思路**：
  - 先算出長度並找到尾節點，再把尾巴接回頭形成環。
  - 真正要往右轉的是 `k % length` 步，因此新尾巴會落在 `length - (k % length) - 1` 的位置。
  - 找到新尾巴後把環斷開，新頭就是 `new_tail.next`。
- **TC**：O(n)
  - 先走一趟求長度與尾巴，再走一趟找到新尾巴。
- **SC**：O(1)
  - 只使用常數個指標。
- **其他思路**：
  - **陣列收節點後重接**：先把節點存進陣列，再重新指定新頭與尾。TC: O(n), SC: O(n)。
- **解法比較**：
  - **成環再斷開**：優點是最自然，也最省空間。缺點是要先把 `k` 對長度取模。
  - **陣列法**：優點是直觀。缺點是多用 O(n) 空間。
- **測試重點 (Testing)**：
  - **`k` 大於串列長度**：確認取模後仍正確。
  - **`k = 0`**：應原樣返回。
  - **單一節點 / 空串列**：不應出錯。
  - **一般案例**：確認新頭與新尾巴位置正確。

```python
def rotateRight(head, k):
    if not head or not head.next or k == 0:
        return head

    length = 1
    tail = head
    while tail.next:
        tail = tail.next
        length += 1

    k %= length
    if k == 0:
        return head

    tail.next = head
    steps = length - k - 1
    new_tail = head
    for _ in range(steps):
        new_tail = new_tail.next

    new_head = new_tail.next
    new_tail.next = None
    return new_head
```

### 148. Sort List (Med.)

- **Problem (English)**:
  - Sort a linked list in ascending order.
- **題目（中文）**：
  - 將鏈結串列按照升序排序。

- **Examples**:
  - Example 1: `head = [4,2,1,3]`
    - Output: `[1,2,3,4]`
  - Example 2: `head = [-1,5,3,4,0]`
    - Output: `[-1,0,3,4,5]`
  - Example 3: `head = []`
    - Output: `[]`
- **Constraints**:
  - The number of nodes in the list is in the range [0, 5 * 10^4].
  - `-10^5 <= Node.val <= 10^5`

- **套路**：鏈結串列 Merge Sort
- **思路**：
  - 鏈結串列不適合 random access，因此不適合像陣列那樣直接套 quicksort 思路。
  - Merge sort 只需要把串列切半、遞迴排序左右兩段，再線性合併。
  - 用快慢指標找中點切半後，合併步驟和 Merge Two Sorted Lists 幾乎相同。
- **TC**：O(n log n)
  - 每層分治都會把所有節點合併一次，而層數是 log n。
- **SC**：O(log n)
  - 額外空間主要來自遞迴堆疊；合併本身是原地接線。
- **其他思路**：
  - **轉成陣列後排序再重建**：TC: O(n log n), SC: O(n)。
  - **Bottom-up Merge Sort**：同樣是 O(n log n) 但可把額外空間壓到 O(1)（不計指標變數），只是實作更複雜。
- **解法比較**：
  - **Top-down Merge Sort**：優點是最容易理解與手寫。缺點是有 O(log n) 遞迴堆疊。
  - **Bottom-up Merge Sort**：優點是更接近最優空間。缺點是實作難度高。
  - **陣列法**：優點是快速好寫。缺點是沒利用鏈結串列特性。
- **測試重點 (Testing)**：
  - **含負數與重複值**：確認排序穩定正確。
  - **已排序 / 逆序**：都要能處理。
  - **節點數為 0 或 1**：應直接返回。
  - **偶數與奇數長度**：切半位置要正確。

```python
def sortList(head):
    if not head or not head.next:
        return head

    slow = fast = head
    prev = None
    while fast and fast.next:
        prev = slow
        slow = slow.next
        fast = fast.next.next
    prev.next = None

    left = sortList(head)
    right = sortList(slow)

    dummy = ListNode()
    tail = dummy
    while left and right:
        if left.val <= right.val:
            tail.next = left
            left = left.next
        else:
            tail.next = right
            right = right.next
        tail = tail.next

    tail.next = left or right
    return dummy.next
```

### 287. Find the Duplicate Number (Med.)

- **Problem (English)**:
  - Given an array `nums` containing `n + 1` integers where each integer is in the range `[1, n]`, return the repeated number.
  - You must solve it without modifying the array and using only constant extra space.
- **題目（中文）**：
  - 給定一個長度為 `n + 1` 的整數陣列 `nums`，其中每個整數都介於 `[1, n]`，請找出重複出現的數字。
  - 解法不能修改原陣列，且只能使用常數額外空間。

- **Examples**:
  - Example 1: `nums = [1,3,4,2,2]`
    - Output: `2`
  - Example 2: `nums = [3,1,3,4,2]`
    - Output: `3`
  - Example 3: `nums = [3,3,3,3,3]`
    - Output: `3`
- **Constraints**:
  - `1 <= n <= 10^5`
  - `nums.length == n + 1`
  - `1 <= nums[i] <= n`
  - All the integers in nums appear only once except for precisely one integer which appears two or more times.

- **套路**：把陣列視為鏈結串列後做 Floyd Cycle Detection
- **思路**：
  - 把索引看成節點、`nums[i]` 看成 next 指標，因為值域落在 `1..n`，所以一定會形成一個環。
  - 重複數字對應的就是環入口，先用快慢指標找到相遇點，再讓一個指標回到起點同步前進即可找入口。
  - 這題雖然輸入是陣列，但核心技巧和鏈結串列找環完全相同。
- **TC**：O(n)
  - 快慢指標在函數圖中最多走線性步數就會相遇與定位入口。
- **SC**：O(1)
  - 只使用常數個指標變數。
- **其他思路**：
  - **Hash Set**：掃描時記錄出現過的值，第一個重複即答案。TC: O(n), SC: O(n)。
  - **值域二分**：用鴿籠原理統計 `<= mid` 的個數來縮小答案區間。TC: O(n log n), SC: O(1)。
- **解法比較**：
  - **Floyd**：優點是同時滿足 O(n) 時間與 O(1) 空間。缺點是觀念最抽象。
  - **Hash Set**：優點是最好懂。缺點是空間不符合進階要求。
  - **值域二分**：優點是也能做到 O(1) 額外空間。缺點是時間較慢。
- **測試重點 (Testing)**：
  - **重複值出現多次**：不只剛好兩次也要正確。
  - **最小合法輸入**：如 `[1,1]`。
  - **重複值在值域最大端**：如重複的是 `n`。
  - **不同排列**：確認答案和位置無關，只和重複值本身有關。

```python
def findDuplicate(nums):
    slow = fast = nums[0]

    while True:
        slow = nums[slow]
        fast = nums[nums[fast]]
        if slow == fast:
            break

    slow = nums[0]
    while slow != fast:
        slow = nums[slow]
        fast = nums[fast]

    return slow
```

### 2. Add Two Numbers (Med.)

- **Problem (English)**:
  - Two non-negative integers are stored in reverse order in two linked lists.
  - Add the numbers and return the sum as a linked list in the same reversed format.
- **題目（中文）**：
  - 兩個非負整數分別以反序方式存放在兩條鏈結串列中。
  - 請將它們相加，並以相同反序格式的鏈結串列回傳結果。

- **Examples**:
  - Example 1: `l1 = [2,4,3], l2 = [5,6,4]`
    - Output: `[7,0,8]`
    - Explanation: 342 + 465 = 807.
  - Example 2: `l1 = [0], l2 = [0]`
    - Output: `[0]`
  - Example 3: `l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]`
    - Output: `[8,9,9,9,0,0,0,1]`
- **Constraints**:
  - The number of nodes in each linked list is in the range [1, 100].
  - `0 <= Node.val <= 9`
  - It is guaranteed that the list represents a number that does not have leading zeros.

- **套路**：逐位相加 + 進位
- **思路**：
  - 兩條串列同步往後走，把當前兩位與 `carry` 相加。
  - 每次建立新節點保存 `total % 10`，並把 `carry` 更新為 `total // 10`。
  - 只要還有節點沒處理完，或最後還有進位，就要繼續建立節點。
- **TC**：O(max(m, n))
  - 兩條串列中每個節點只會被讀一次，較短那條走完後只剩較長那條與 carry。
- **SC**：O(max(m, n))
  - 需要建立新的答案串列，節點數量與輸出位數同階。
- **其他思路**：
  - **遞迴逐位相加**：概念類似，但需要處理長度差與尾端 carry。TC: O(max(m, n)), SC: O(max(m, n))。
  - **轉成整數再相加**：某些語言用大整數可行，但不符合題目想考的鏈結串列技巧。
- **解法比較**：
  - **迭代建新串列**：優點是最穩，邊界清楚。缺點是要寫一個 dummy + tail 模板。
  - **遞迴**：優點是表達自然。缺點是堆疊空間較大。
  - **整數法**：優點是短。缺點是偏離題意，也可能被大數限制卡住。
- **測試重點 (Testing)**：
  - **不同長度串列**：確認較長尾端仍會被處理。
  - **最後仍有進位**：如 `9 -> 9` 加 `1`。
  - **一邊為空或值為 0**：確認不會多建節點。
  - **多次連續進位**：檢查 carry 傳遞正確。

```python
def addTwoNumbers(l1, l2):
    dummy = ListNode()
    tail = dummy
    carry = 0

    while l1 or l2 or carry:
        total = carry
        if l1:
            total += l1.val
            l1 = l1.next
        if l2:
            total += l2.val
            l2 = l2.next

        carry, digit = divmod(total, 10)
        tail.next = ListNode(digit)
        tail = tail.next

    return dummy.next
```

### 23. Merge k Sorted Lists (Hard)

- **Problem (English)**:
  - Merge `k` sorted linked lists into one sorted linked list.
- **題目（中文）**：
  - 將 `k` 條已排序的鏈結串列合併成一條排序後的鏈結串列。

- **Examples**:
  - Example 1: `lists = [[1,4,5],[1,3,4],[2,6]]`
    - Output: `[1,1,2,3,4,4,5,6]`
    - Explanation: The linked-lists are:
[
1->4->5,
1->3->4,
2->6
]
merging them into one sorted linked list:
1->1->2->3->4->4->5->6
  - Example 2: `lists = []`
    - Output: `[]`
  - Example 3: `lists = [[]]`
    - Output: `[]`
- **Constraints**:
  - `k == lists.length`
  - `0 <= k <= 10^4`
  - `0 <= lists[i].length <= 500`
  - `-10^4 <= lists[i][j] <= 10^4`
  - lists[i] is sorted in ascending order.
  - The sum of lists[i].length will not exceed 10^4.

- **套路**：Min-Heap 合併 k 條有序鏈結串列
- **思路**：
  - 每條串列頭節點都是該串列目前最小值，所以先把所有非空頭節點放進 min-heap。
  - 每次取出 heap 中最小節點接到答案尾端，再把它的下一個節點放回 heap。
  - 這樣 heap 中始終只維護每條串列當前還沒處理的最小候選值。
- **TC**：O(N log k)
  - `N` 是所有節點總數；每個節點都會進出 heap 一次，而 heap 大小最多為 `k`。
- **SC**：O(k)
  - heap 同時最多只會放每條串列的一個當前節點。
- **其他思路**：
  - **Divide and Conquer**：兩兩合併串列，像 merge sort 一樣分治。TC: O(N log k), SC: O(log k) 或 O(1) 視實作而定。
- **解法比較**：
  - **Heap**：優點是思路直覺，適合「多路最小值」問題。缺點是要處理 Python heap 的比較 tie-breaker。
  - **分治合併**：優點是不用 heap，也很經典。缺點是需要重複調用兩串列合併模板。
- **測試重點 (Testing)**：
  - **有空串列**：確認初始化 heap 時不會出錯。
  - **`k = 1`**：應直接返回原串列。
  - **大量短串列**：檢查 heap 頻繁進出仍正確。
  - **值重複**：確認 tie-breaker 不會讓 heap 比較失敗。

```python
import heapq


def mergeKLists(lists):
    heap = []
    for index, node in enumerate(lists):
        if node:
            heapq.heappush(heap, (node.val, index, node))

    dummy = ListNode()
    tail = dummy

    while heap:
        _, index, node = heapq.heappop(heap)
        tail.next = node
        tail = tail.next

        if node.next:
            heapq.heappush(heap, (node.next.val, index, node.next))

    return dummy.next
```

### 25. Reverse Nodes in k-Group (Hard)

- **Problem (English)**:
  - Reverse nodes of a linked list `k` at a time.
  - If the remaining number of nodes is smaller than `k`, leave them as they are.
  - Node values may not be changed; only nodes themselves may be moved.
- **題目（中文）**：
  - 每次以 `k` 個節點為一組反轉鏈結串列。
  - 如果剩餘節點數少於 `k`，則保持原樣。
  - 不可修改節點值，只能調整節點本身的位置。

- **Examples**:
  - Example 1: `head = [1,2,3,4,5], k = 2`
    - Output: `[2,1,4,3,5]`
  - Example 2: `head = [1,2,3,4,5], k = 3`
    - Output: `[3,2,1,4,5]`
- **Constraints**:
  - The number of nodes in the list is n.
  - `1 <= k <= n <= 5000`
  - `0 <= Node.val <= 1000`

- **套路**：每 k 個節點做一次局部反轉
- **思路**：
  - 每輪先往前找第 `k` 個節點，若剩餘節點不足 `k` 個就直接結束。
  - 找到後，把這一段視為一個獨立區間做原地反轉，並讓反轉後頭尾重新接回前一段與下一段。
  - `group_prev` 會指向每輪處理前那一組的前導節點，方便局部接線。
- **TC**：O(n)
  - 每個節點最多只會被找第 k 個、反轉、接回等固定次數處理。
- **SC**：O(1)
  - 完全原地反轉，沒有額外堆疊或容器。
- **其他思路**：
  - **Stack 暫存每組節點**：每收滿 `k` 個就反向彈出重接。TC: O(n), SC: O(k)。
- **解法比較**：
  - **原地分組反轉**：優點是符合進階要求，空間最佳。缺點是接線順序最容易出 bug。
  - **Stack 法**：優點是概念直觀。缺點是多用 O(k) 空間。
- **測試重點 (Testing)**：
  - **節點數不是 `k` 的倍數**：最後不足 `k` 的尾段應保持不動。
  - **`k = 1`**：應原樣返回。
  - **`k` 大於長度**：整條串列都不能反轉。
  - **剛好整除**：確認每段都被正確反轉且接回。

```python
def reverseKGroup(head, k):
    dummy = ListNode(0, head)
    group_prev = dummy

    while True:
        kth = group_prev
        for _ in range(k):
            kth = kth.next
            if not kth:
                return dummy.next

        group_next = kth.next

        prev = group_next
        curr = group_prev.next
        while curr != group_next:
            next_node = curr.next
            curr.next = prev
            prev = curr
            curr = next_node

        new_group_tail = group_prev.next
        group_prev.next = kth
        group_prev = new_group_tail
```