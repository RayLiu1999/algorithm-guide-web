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

---

### 876. Middle of the Linked List (Easy)

---

### 141. Linked List Cycle (Easy)

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
