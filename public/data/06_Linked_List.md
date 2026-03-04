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

- **套路**：迭代反轉 (Iterative Reversal)
- **思路**：
  - 使用三個指標：`prev`（前一個節點，初始為 `None`）、`curr`（當前節點，初始為 `head`）、`next_node`（暫存下一個節點）。
  - 遍歷鏈結串列，在每一步中：
    1. 儲存 `curr.next` 到 `next_node`。
    2. 將 `curr.next` 指向 `prev`（反轉指針）。
    3. 更新 `prev` 為 `curr`。
    4. 更新 `curr` 為 `next_node`。
  - 當 `curr` 為 `None` 時，`prev` 就是新的頭部。
- **TC**：O(n)
  - n 為鏈結串列的長度。需要遍歷整個鏈結串列一次。
- **SC**：O(1)
  - 只使用了有限的額外變數（`prev`, `curr`, `next_node`），空間複雜度為常數。
- **其他思路**：
  - **遞迴 (Recursive)**：
    - Base Case：如果 `head` 為 `None` 或 `head.next` 為 `None`，直接返回 `head`。
    - 遞迴反轉後面的部分：`new_head = reverseList(head.next)`。
    - 處理當前節點：`head.next.next = head`，`head.next = None`。
    - 返回 `new_head`。
    - TC: O(n), SC: O(n)（遞迴堆疊空間）。
- **解法比較**：
  - **迭代**：
    - 優點：空間效率高 (O(1))，不易發生堆疊溢位（Stack Overflow），通常在面試中更受青睞。
    - 缺點：需要手動管理三個指標，邏輯稍顯繁瑣。
  - **遞迴**：
    - 優點：代碼簡潔，邏輯優雅，符合函數式編程思想。
    - 缺點：空間複雜度較高 (O(n))，當鏈結串列很長時可能導致堆疊溢位。
- **測試重點 (Testing)**：
  - **常規鏈結串列**：傳入 `1 -> 2 -> 3 -> 4 -> 5 -> None`，應回傳 `5 -> 4 -> 3 -> 2 -> 1 -> None`。
  - **只有一個節點**：傳入 `1 -> None`，應回傳 `1 -> None`。
  - **兩個節點**：傳入 `1 -> 2 -> None`，應回傳 `2 -> 1 -> None`。
  - **空鏈結串列**：傳入 `None`，應回傳 `None`。

```python
# 套路模板：迭代反轉鏈結串列
def reverseList(head):
    prev = None
    curr = head
    while curr:
        next_node = curr.next  # 儲存下一個節點
        curr.next = prev       # 反轉指針
        prev = curr            # 移動 prev
        curr = next_node       # 移動 curr
    return prev  # prev 是新的頭部
```

---

### 876. Middle of the Linked List (Easy)

---

### 141. Linked List Cycle (Easy)

- **套路**：快慢指標 (Floyd's Tortoise and Hare)
- **思路**：
  - 初始化快慢指標都指向頭部。
  - 每次迴圈，快指標走兩步 (`fast.next.next`)，慢指標走一步 (`slow.next`)。
  - 如果鏈結串列有環，快指標最終一定會追上慢指標（在環內相遇）。
  - 如果快指標或其下一步變為 `None`，表示到達鏈結串列末端，無環。
- **TC**：O(n)
  - n 為鏈結串列的長度。在最壞情況下（無環），快指標會遍歷整個鏈結串列。
- **SC**：O(1)
  - 只使用了有限的額外變數（快慢指標），空間複雜度為常數。
- **其他思路**：
  - **哈希集合 (Hash Set)**：將遍歷過的節點存入哈希集合，若遇到已存在的節點則表示有環。TC: O(n), SC: O(n)。
  - **修改節點值 (In-place Modification)**：將遍歷過的節點值改為特殊標記（如 `None` 或一個不在題目範圍內的特殊值），若遇到已修改的節點則表示有環。TC: O(n), SC: O(1)。但此方法會破壞原始鏈結串列結構。
- **解法比較**：
  - **快慢指標**：
    - 優點：空間效率最高 (O(1))，且不破壞原始鏈結串列。
    - 缺點：需要理解快慢指標的運動特性，邏輯相對抽象。
  - **哈希集合**：
    - 優點：代碼直觀易懂，容易實現。
    - 缺點：需要額外的空間存儲節點，空間複雜度較高。
  - **修改節點值**：
    - 優點：空間效率高 (O(1))，代碼簡單。
    - 缺點：會破壞原始鏈結串列，不適用於需要保留原始結構的場景。
- **測試重點 (Testing)**：
  - **無環鏈結串列**：傳入 `1 -> 2 -> 3 -> None`，應回傳 `False`。
  - **有環鏈結串列**：傳入 `1 -> 2 -> 3 -> 4 -> 2`（4 指向 2），應回傳 `True`。
  - **單節點有環**：傳入 `1 -> 1`，應回傳 `True`。
  - **單節點無環**：傳入 `1 -> None`，應回傳 `False`。
  - **空鏈結串列**：傳入 `None`，應回傳 `False`。

```python
# 套路模板：快慢指標偵測環
def hasCycle(head):
    slow = head
    fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True  # 找到環
    return False  # 到達鏈結串列末端
```

---

### 21. Merge Two Sorted Lists (Easy)

---

### 234. Palindrome Linked List (Easy)

---

### 19. Remove Nth Node From End of List (Med.)

---

### 24. Swap Nodes in Pairs (Med.)

---

### 143. Reorder List (Med.)

---

### 328. Odd Even Linked List (Med.)

---

### 61. Rotate List (Med.)

---

### 148. Sort List (Med.)

---

### 287. Find the Duplicate Number (Med.)

---

### 2. Add Two Numbers (Med.)

---

### 23. Merge k Sorted Lists (Hard)

---

### 25. Reverse Nodes in k-Group (Hard)
