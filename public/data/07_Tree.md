# 七、Tree（二元樹）

## 題目目錄

- [104. Maximum Depth of Binary Tree (Easy)](#104-maximum-depth-of-binary-tree-easy)
- [226. Invert Binary Tree (Easy)](#226-invert-binary-tree-easy)
- [100. Same Tree (Easy)](#100-same-tree-easy)
- [101. Symmetric Tree (Easy)](#101-symmetric-tree-easy)
- [572. Subtree of Another Tree (Easy)](#572-subtree-of-another-tree-easy)
- [543. Diameter of Binary Tree (Easy)](#543-diameter-of-binary-tree-easy)
- [110. Balanced Binary Tree (Easy)](#110-balanced-binary-tree-easy)
- [108. Convert Sorted Array to Binary Search Tree (Easy)](#108-convert-sorted-array-to-binary-search-tree-easy)
- [102. Binary Tree Level Order Traversal (Med.)](#102-binary-tree-level-order-traversal-med)
- [103. Binary Tree Zigzag Level Order Traversal (Med.)](#103-binary-tree-zigzag-level-order-traversal-med)
- [199. Binary Tree Right Side View (Med.)](#199-binary-tree-right-side-view-med)
- [662. Maximum Width of Binary Tree (Med.)](#662-maximum-width-of-binary-tree-med)
- [98. Validate Binary Search Tree (Med.)](#98-validate-binary-search-tree-med)
- [230. Kth Smallest Element in a BST (Med.)](#230-kth-smallest-element-in-a-bst-med)
- [285. Inorder Successor in BST (Med.)](#285-inorder-successor-in-bst-med)
- [235. Lowest Common Ancestor of a Binary Search Tree (Med.)](#235-lowest-common-ancestor-of-a-binary-search-tree-med)
- [236. Lowest Common Ancestor of a Binary Tree (Med.)](#236-lowest-common-ancestor-of-a-binary-tree-med)
- [105. Construct Binary Tree from Preorder and Inorder Traversal (Med.)](#105-construct-binary-tree-from-preorder-and-inorder-traversal-med)
- [113. Path Sum II (Med.)](#113-path-sum-ii-med)
- [437. Path Sum III (Med.)](#437-path-sum-iii-med)
- [124. Binary Tree Maximum Path Sum (Hard)](#124-binary-tree-maximum-path-sum-hard)
- [863. All Nodes Distance K in Binary Tree (Med.)](#863-all-nodes-distance-k-in-binary-tree-med)
- [297. Serialize and Deserialize Binary Tree (Hard)](#297-serialize-and-deserialize-binary-tree-hard)
- [310. Minimum Height Trees (Med.)](#310-minimum-height-trees-med)

## 通用套路

**DFS 遞迴**：大多數樹的題目用遞迴最自然。遞迴三要素：(1) Base case (2) 遞迴左右子樹 (3) 處理當前節點。

**BFS 層序遍歷**：用 Queue 逐層處理，適合「按層」相關的題目。

**路徑問題**：傳遞「從根到當前的累積值」或用「後序遍歷回傳子樹資訊」。

```python
# 套路模板：DFS 遞迴（後序）
def dfs(node):
    if not node:
        return 0  # base case
    left = dfs(node.left)
    right = dfs(node.right)
    # 處理當前節點，利用 left/right 的回傳值
    return some_combination(left, right, node.val)

# 套路模板：BFS 層序遍歷
from collections import deque
def bfs(root):
    if not root:
        return []
    queue = deque([root])
    result = []
    while queue:
        level_size = len(queue)
        level = []
        for _ in range(level_size):
            node = queue.popleft()
            level.append(node.val)
            if node.left:  queue.append(node.left)
            if node.right: queue.append(node.right)
        result.append(level)
    return result
```

---

### 104. Maximum Depth of Binary Tree (Easy)

---

### 226. Invert Binary Tree (Easy)

---

### 100. Same Tree (Easy)

---

### 101. Symmetric Tree (Easy)

---

### 572. Subtree of Another Tree (Easy)

---

### 543. Diameter of Binary Tree (Easy)

---

### 110. Balanced Binary Tree (Easy)

---

### 108. Convert Sorted Array to Binary Search Tree (Easy)

---

### 102. Binary Tree Level Order Traversal (Med.)

---

### 103. Binary Tree Zigzag Level Order Traversal (Med.)

---

### 199. Binary Tree Right Side View (Med.)

---

### 662. Maximum Width of Binary Tree (Med.)

---

### 98. Validate Binary Search Tree (Med.)

---

### 230. Kth Smallest Element in a BST (Med.)

---

### 285. Inorder Successor in BST (Med.)

---

### 235. Lowest Common Ancestor of a Binary Search Tree (Med.)

---

### 236. Lowest Common Ancestor of a Binary Tree (Med.)

---

### 105. Construct Binary Tree from Preorder and Inorder Traversal (Med.)

---

### 113. Path Sum II (Med.)

---

### 437. Path Sum III (Med.)

---

### 124. Binary Tree Maximum Path Sum (Hard)

---

### 863. All Nodes Distance K in Binary Tree (Med.)

---

### 297. Serialize and Deserialize Binary Tree (Hard)

---

### 310. Minimum Height Trees (Med.)
