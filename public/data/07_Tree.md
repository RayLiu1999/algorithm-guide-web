# 七、Tree（二元樹）

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

### 63. Maximum Depth of Binary Tree (Easy)

- **套路**：DFS 遞迴（後序）
- **思路**：深度 = max(左子樹深度, 右子樹深度) + 1。
- **複雜度**：O(n) / O(h)

```python
def maxDepth(root):
    if not root:
        return 0
    return max(maxDepth(root.left), maxDepth(root.right)) + 1
```

### 60. Invert Binary Tree (Easy)

- **套路**：DFS 遞迴
- **思路**：交換左右子樹，然後遞迴翻轉。
- **複雜度**：O(n) / O(h)

```python
def invertTree(root):
    if not root:
        return None
    root.left, root.right = invertTree(root.right), invertTree(root.left)
    return root
```

### 61. Same Tree (Easy)

- **套路**：同步 DFS
- **思路**：同時遍歷兩棵樹，比較每個對應位置的值。
- **複雜度**：O(n) / O(h)

```python
def isSameTree(p, q):
    if not p and not q:
        return True
    if not p or not q or p.val != q.val:
        return False
    return isSameTree(p.left, q.left) and isSameTree(p.right, q.right)
```

### 62. Symmetric Tree (Easy)

- **套路**：鏡像 DFS
- **思路**：檢查左子樹的左 == 右子樹的右，左子樹的右 == 右子樹的左。
- **複雜度**：O(n) / O(h)

```python
def isSymmetric(root):
    def mirror(t1, t2):
        if not t1 and not t2:
            return True
        if not t1 or not t2 or t1.val != t2.val:
            return False
        return mirror(t1.left, t2.right) and mirror(t1.right, t2.left)
    return mirror(root.left, root.right)
```

### 46. Subtree of Another Tree (Easy)

- **套路**：DFS + isSameTree
- **💡 白話文解說**：如果要在桌子上把數字亂排。每擺下一個位子，你就會有這一個數字跟「還沒有擺到桌上的那些數字」可以選。所以我們帶著一個「使用清單(Used Array)」闖蕩迴圈，如果用了就畫掉，闖蕩完再把畫掉的痕跡塗銷準備試下一套排法。
- **思路**：遍歷主樹每個節點，檢查以該節點為根的子樹是否和目標樹完全相同。
- **複雜度**：O(m·n) / O(h)

```python
def isSubtree(root, subRoot):
    if not root:
        return False
    if isSameTree(root, subRoot):
        return True
    return isSubtree(root.left, subRoot) or isSubtree(root.right, subRoot)
```

### 25. Diameter of Binary Tree (Easy)

- **套路**：DFS 後序 + 全域變數追蹤最大值
- **思路**：直徑 = 某節點的左深度 + 右深度。遞迴計算每個節點的深度，同時更新全域最大直徑。
- **要點**：答案不一定經過根節點。
- **複雜度**：O(n) / O(h)

```python
def diameterOfBinaryTree(root):
    diameter = 0
    def depth(node):
        nonlocal diameter
        if not node:
            return 0
        left = depth(node.left)
        right = depth(node.right)
        diameter = max(diameter, left + right)
        return max(left, right) + 1
    depth(root)
    return diameter
```

### 69. Balanced Binary Tree (Easy)

- **套路**：DFS 後序 + 提前剪枝
- **思路**：平衡 = 左右子樹高度差 ≤ 1 且左右子樹各自也平衡。用 -1 表示不平衡來提前剪枝。
- **複雜度**：O(n) / O(h)

```python
def isBalanced(root):
    def height(node):
        if not node:
            return 0
        left = height(node.left)
        right = height(node.right)
        if left == -1 or right == -1 or abs(left - right) > 1:
            return -1  # 不平衡
        return max(left, right) + 1
    return height(root) != -1
```

### 67. Convert Sorted Array to Binary Search Tree (Easy)

- **套路**：二分遞迴建樹
- **思路**：取中間元素為根，左半邊遞迴建左子樹，右半邊建右子樹。
- **複雜度**：O(n) / O(log n)

```python
def sortedArrayToBST(nums):
    if not nums:
        return None
    mid = len(nums) // 2
    root = TreeNode(nums[mid])
    root.left = sortedArrayToBST(nums[:mid])
    root.right = sortedArrayToBST(nums[mid+1:])
    return root
```

### 61. Binary Tree Level Order Traversal (Med.)

- **套路**：BFS 層序
- **思路**：用 Queue，每次處理一整層。
- **複雜度**：O(n) / O(n)

```python
from collections import deque

def levelOrder(root):
    if not root:
        return []
    queue = deque([root])
    result = []
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node.val)
            if node.left:  queue.append(node.left)
            if node.right: queue.append(node.right)
        result.append(level)
    return result
```

### 64. Binary Tree Zigzag Level Order Traversal (Med.)

- **套路**：BFS + 奇偶層反轉
- **思路**：和標準層序一樣，但奇數層把結果 reverse。
- **複雜度**：O(n) / O(n)

```python
from collections import deque

def zigzagLevelOrder(root):
    if not root:
        return []
    queue = deque([root])
    result = []
    left_to_right = True
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node.val)
            if node.left:  queue.append(node.left)
            if node.right: queue.append(node.right)
        result.append(level if left_to_right else level[::-1])
        left_to_right = not left_to_right
    return result
```

### 44. Binary Tree Right Side View (Med.)

- **套路**：BFS 取每層最後一個
- **思路**：層序遍歷，每層只取最後一個節點放入結果。
- **複雜度**：O(n) / O(n)

```python
from collections import deque

def rightSideView(root):
    if not root:
        return []
    queue = deque([root])
    result = []
    while queue:
        for i in range(len(queue)):
            node = queue.popleft()
            if node.left:  queue.append(node.left)
            if node.right: queue.append(node.right)
        result.append(node.val)  # 每層最後一個
    return result
```

### 88. Maximum Width of Binary Tree (Med.)

- **套路**：BFS + 節點編號
- **思路**：給每個節點一個編號（二元堆積的方式：左=2i, 右=2i+1），每層寬度 = 最右編號 - 最左編號 + 1。
- **複雜度**：O(n) / O(n)

```python
from collections import deque

def widthOfBinaryTree(root):
    if not root:
        return 0
    queue = deque([(root, 0)])
    max_width = 0
    while queue:
        _, first_idx = queue[0]
        for _ in range(len(queue)):
            node, idx = queue.popleft()
            if node.left:  queue.append((node.left, 2 * idx))
            if node.right: queue.append((node.right, 2 * idx + 1))
        max_width = max(max_width, idx - first_idx + 1)
    return max_width
```

### 59. Validate Binary Search Tree (Med.)

- **套路**：DFS + 上下界
- **思路**：每個節點的值必須在 (lower, upper) 範圍內。左子樹 upper 變成當前值，右子樹 lower 變成當前值。
- **複雜度**：O(n) / O(h)

```python
def isValidBST(root):
    def validate(node, lower, upper):
        if not node:
            return True
        if node.val <= lower or node.val >= upper:
            return False
        return (validate(node.left, lower, node.val) and
                validate(node.right, node.val, upper))
    return validate(root, float('-inf'), float('inf'))
```

### 62. Kth Smallest Element in a BST (Med.)

- **套路**：中序遍歷 (Inorder) — BST 中序就是排序
- **思路**：BST 的中序遍歷結果是遞增的。走到第 k 個就是答案。
- **複雜度**：O(H+k) / O(H)

```python
def kthSmallest(root, k):
    stack = []
    curr = root
    while curr or stack:
        while curr:
            stack.append(curr)
            curr = curr.left
        curr = stack.pop()
        k -= 1
        if k == 0:
            return curr.val
        curr = curr.right
```

### 135. Inorder Successor in BST (Med.)

- **套路**：BST 性質搜尋
- **思路**：如果當前值 <= p.val，後繼在右邊。如果當前值 > p.val，當前可能是後繼，但還要往左看有沒有更小的。
- **複雜度**：O(h) / O(1)

```python
def inorderSuccessor(root, p):
    successor = None
    while root:
        if root.val <= p.val:
            root = root.right
        else:
            successor = root  # 候選
            root = root.left  # 看有沒有更小的
    return successor
```

### 66. Lowest Common Ancestor of a BST (Med.)

- **套路**：利用 BST 性質分流
- **思路**：如果 p, q 都小於當前節點，LCA 在左邊。都大於就在右邊。分岔處就是 LCA。
- **複雜度**：O(h) / O(1)

```python
def lowestCommonAncestor(root, p, q):
    while root:
        if p.val < root.val and q.val < root.val:
            root = root.left
        elif p.val > root.val and q.val > root.val:
            root = root.right
        else:
            return root
```

### 67. Lowest Common Ancestor of a Binary Tree (Med.)

- **套路**：DFS 後序找分岔點
- **思路**：遞迴搜尋左右子樹。如果左右都找到了，當前節點就是 LCA。只有一邊找到就回傳那邊。
- **複雜度**：O(n) / O(h)

```python
def lowestCommonAncestor(root, p, q):
    if not root or root == p or root == q:
        return root
    left = lowestCommonAncestor(root.left, p, q)
    right = lowestCommonAncestor(root.right, p, q)
    if left and right:
        return root    # p, q 分別在左右子樹 → 當前就是 LCA
    return left or right
```

### 64. Construct Binary Tree from Preorder and Inorder Traversal (Med.)

- **套路**：前序第一個 = 根，中序切割左右子樹
- **思路**：前序的第一個元素是根。在中序中找到根的位置，左邊是左子樹，右邊是右子樹。遞迴建構。
- **複雜度**：O(n) / O(n)

```python
def buildTree(preorder, inorder):
    if not preorder:
        return None
    root_val = preorder[0]
    root = TreeNode(root_val)
    mid = inorder.index(root_val)
    root.left = buildTree(preorder[1:mid+1], inorder[:mid])
    root.right = buildTree(preorder[mid+1:], inorder[mid+1:])
    return root
```

### 70. Path Sum II (Med.)

- **套路**：DFS + 路徑追蹤
- **思路**：從根到葉的路徑，邊走邊累計路徑上的值。到葉節點時檢查總和是否等於 target。
- **複雜度**：O(n) / O(h)

```python
def pathSum(root, targetSum):
    result = []
    def dfs(node, remaining, path):
        if not node:
            return
        path.append(node.val)
        if not node.left and not node.right and remaining == node.val:
            result.append(path[:])  # 找到一條路徑
        dfs(node.left, remaining - node.val, path)
        dfs(node.right, remaining - node.val, path)
        path.pop()  # 回溯
    dfs(root, targetSum, [])
    return result
```

### 165. Path Sum III (Med.)

- **套路**：前綴和 + DFS
- **思路**：和 Subarray Sum Equals K 一樣的前綴和技巧，只是在樹上做。用 DFS 遍歷時維護前綴和和 Hash Map。
- **複雜度**：O(n) / O(n)

```python
def pathSum(root, targetSum):
    count = 0
    prefix_sums = {0: 1}

    def dfs(node, curr_sum):
        nonlocal count
        if not node:
            return
        curr_sum += node.val
        count += prefix_sums.get(curr_sum - targetSum, 0)
        prefix_sums[curr_sum] = prefix_sums.get(curr_sum, 0) + 1
        dfs(node.left, curr_sum)
        dfs(node.right, curr_sum)
        prefix_sums[curr_sum] -= 1  # 回溯

    dfs(root, 0)
    return count
```

### 74. Binary Tree Maximum Path Sum (Hard)

- **套路**：DFS 後序 + 全域最大值
- **思路**：每個節點可以選擇「接上左子樹」或「接上右子樹」或「兩邊都不接」。但路徑不能分叉，所以回傳給父節點時只能選一邊。
- **要點**：全域答案可以是「左+當前+右」（在當前節點拐彎），但回傳值只能是「max(左,右)+當前」。
- **複雜度**：O(n) / O(h)

```python
def maxPathSum(root):
    max_sum = float('-inf')
    def dfs(node):
        nonlocal max_sum
        if not node:
            return 0
        left = max(0, dfs(node.left))    # 負數就不接
        right = max(0, dfs(node.right))
        max_sum = max(max_sum, left + right + node.val)  # 在此拐彎的最大值
        return max(left, right) + node.val  # 回傳單邊最大延伸
    dfs(root)
    return max_sum
```

### 154. All Nodes Distance K in Binary Tree (Med.)

- **套路**：建圖 + BFS
- **思路**：把樹轉成無向圖（加上 parent 邊），然後從 target 做 BFS，走 K 步。
- **複雜度**：O(n) / O(n)

```python
from collections import deque, defaultdict

def distanceK(root, target, k):
    # 建圖
    graph = defaultdict(list)
    def build(node, parent):
        if not node:
            return
        if parent:
            graph[node.val].append(parent.val)
            graph[parent.val].append(node.val)
        build(node.left, node)
        build(node.right, node)
    build(root, None)
    # BFS
    queue = deque([target.val])
    visited = {target.val}
    for _ in range(k):
        for _ in range(len(queue)):
            node = queue.popleft()
            for neighbor in graph[node]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)
    return list(queue)
```

### 32. Serialize and Deserialize Binary Tree (Hard)

- **套路**：前序遍歷 + null 標記
- **思路**：序列化時用前序遍歷，null 用 "N" 表示。反序列化時按順序讀取，遇到 "N" 返回 None。
- **複雜度**：O(n) / O(n)

```python
class Codec:
    def serialize(self, root):
        vals = []
        def dfs(node):
            if not node:
                vals.append("N")
                return
            vals.append(str(node.val))
            dfs(node.left)
            dfs(node.right)
        dfs(root)
        return ",".join(vals)

    def deserialize(self, data):
        vals = iter(data.split(","))
        def dfs():
            val = next(vals)
            if val == "N":
                return None
            node = TreeNode(int(val))
            node.left = dfs()
            node.right = dfs()
            return node
        return dfs()
```

### 36. Minimum Height Trees (Med.)

- **套路**：拓撲排序剝洋蔥（從葉子向中心）
- **思路**：MHT 的根一定在「圖的中心」。反覆移除所有葉節點（degree=1），最後剩下的 1-2 個就是答案。
- **💡 白話文解說**：要把圖片順時針旋轉 90 度，其實有一個數學小魔術：先把它「上下翻轉」（或者沿著對角線翻轉），然後再把每一行「左右翻轉」，結果就會剛好是旋轉 90 度的樣子！這樣就不用去算複雜的座標變換了。
- **複雜度**：O(n) / O(n)

```python
from collections import deque, defaultdict

def findMinHeightTrees(n, edges):
    if n == 1:
        return [0]
    graph = defaultdict(set)
    for u, v in edges:
        graph[u].add(v)
        graph[v].add(u)
    leaves = deque(node for node in graph if len(graph[node]) == 1)
    remaining = n
    while remaining > 2:
        remaining -= len(leaves)
        new_leaves = deque()
        for leaf in leaves:
            neighbor = graph[leaf].pop()
            graph[neighbor].remove(leaf)
            if len(graph[neighbor]) == 1:
                new_leaves.append(neighbor)
        leaves = new_leaves
    return list(leaves)
```

---
