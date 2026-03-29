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

- **套路**：DFS 遞迴算高度
- **思路**：
  - 樹的最大深度，本質上就是「根節點到底下最深葉節點的最長路徑長度」。
  - 對每個節點來說，答案都可拆成 `1 + max(左子樹深度, 右子樹深度)`。
  - 空節點深度定義為 0，這樣葉節點就會自然回傳 1。
- **TC**：O(n)
  - 每個節點都只會被 DFS 訪問一次，並做常數次比較。
- **SC**：O(h)
  - `h` 是樹高，額外空間主要來自遞迴呼叫堆疊。
- **其他思路**：
  - **BFS 層序遍歷**：逐層走訪並計算總共有幾層，最後層數就是最大深度。
- **解法比較**：
  - **DFS**：優點是程式最短，也最符合樹高的遞迴定義。缺點是極度偏斜的樹會有較深遞迴。
  - **BFS**：優點是「數層數」很直觀，也不需要從子問題往回推。缺點是 queue 在寬樹時可能較大。
- **測試重點 (Testing)**：
  - **空樹**：`root = None`，預期 `0`。
  - **單一節點**：預期 `1`。
  - **完全平衡樹**：確認左右子樹都會被正確比較。
  - **只有左鏈或右鏈**：確認答案等於節點數量。

```python
def maxDepth(root):
        if not root:
                return 0
        return 1 + max(maxDepth(root.left), maxDepth(root.right))
```

### 226. Invert Binary Tree (Easy)

- **套路**：DFS 交換左右子樹
- **思路**：
  - 題目要求把整棵樹鏡像翻轉，所以每個節點都要把 `left` 和 `right` 交換。
  - 交換後還要遞迴處理左右子樹，因為子樹內部結構也必須一起翻轉。
  - 空節點直接返回 `None`，作為遞迴終止條件。
- **TC**：O(n)
  - 每個節點恰好被處理一次，每次只做一次交換與兩次遞迴呼叫。
- **SC**：O(h)
  - 額外空間來自遞迴堆疊，深度等於樹高 `h`。
- **其他思路**：
  - **BFS 迭代**：用 queue 逐層取出節點，當場交換左右子節點。
- **解法比較**：
  - **DFS**：優點是寫法最簡潔。缺點是深樹時遞迴層數較深。
  - **BFS**：優點是沒有遞迴深度問題。缺點是要額外維護 queue。
- **測試重點 (Testing)**：
  - **空樹**：應回傳 `None`。
  - **單一節點**：翻轉前後相同。
  - **完整二元樹**：確認每一層都正確交換。
  - **偏斜樹**：例如只有左子樹，翻轉後應變成只有右子樹。

```python
def invertTree(root):
        if not root:
                return None

        root.left, root.right = invertTree(root.right), invertTree(root.left)
        return root
```

### 100. Same Tree (Easy)

- **套路**：同步 DFS 比較
- **思路**：
  - 兩棵樹相同，代表每個對應位置都要同時滿足「值相同」與「結構相同」。
  - 若兩個節點都為空，表示這一支匹配成功；若只有一邊為空，就立刻失敗。
  - 當前節點值相同後，還要遞迴確認左右子樹也都相同。
- **TC**：O(n)
  - 最壞情況下要把兩棵樹所有對應節點都比較一遍。
- **SC**：O(h)
  - 主要來自遞迴堆疊深度，`h` 為樹高。
- **其他思路**：
  - **BFS 成對比較**：用 queue 每次取出 `(p_node, q_node)` 一起檢查，逐層驗證兩棵樹。
- **解法比較**：
  - **DFS**：優點是最貼近樹的定義，程式短。缺點是深樹可能遞迴較深。
  - **BFS**：優點是逐層檢查時很直觀。缺點是需要顯式保存待比較的節點對。
- **測試重點 (Testing)**：
  - **兩棵空樹**：應回傳 `True`。
  - **值不同**：結構相同但某一節點值不同，應回傳 `False`。
  - **結構不同**：例如一邊缺左子樹，另一邊缺右子樹。
  - **完全相同**：確認遞迴能正確走完整棵樹。

```python
def isSameTree(p, q):
        if not p and not q:
                return True
        if not p or not q or p.val != q.val:
                return False
        return isSameTree(p.left, q.left) and isSameTree(p.right, q.right)
```

### 101. Symmetric Tree (Easy)

- **套路**：鏡像 DFS
- **思路**：
  - 對稱樹不是比較左子樹和右子樹是否一樣，而是要比較它們是否互為鏡像。
  - 所以要同時檢查 `left.left` 對 `right.right`，以及 `left.right` 對 `right.left`。
  - 空樹本身也視為對稱，這是容易漏掉的邊界。
- **TC**：O(n)
  - 每個節點都只會在鏡像比較過程中被訪問一次。
- **SC**：O(h)
  - 額外空間來自遞迴堆疊，深度最多為樹高 `h`。
- **其他思路**：
  - **BFS 成對入 queue**：每次把要互相比較的兩個節點一起入隊，逐層驗證鏡像關係。
- **解法比較**：
  - **DFS**：優點是鏡像定義寫起來非常直接。缺點是對空樹和交叉比對方向要小心。
  - **BFS**：優點是逐層看對稱關係更直觀。缺點是 queue 中要同時管理成對節點。
- **測試重點 (Testing)**：
  - **空樹**：`root = None`，應回傳 `True`。
  - **完全對稱**：左右子樹值與結構都鏡像。
  - **值相同但結構不對稱**：應回傳 `False`。
  - **深層不對稱**：根附近看似對稱，但更下層破壞鏡像。

```python
def isSymmetric(root):
        if not root:
                return True

        def mirror(left, right):
                if not left and not right:
                        return True
                if not left or not right or left.val != right.val:
                        return False
                return mirror(left.left, right.right) and mirror(left.right, right.left)

        return mirror(root.left, root.right)
```

### 572. Subtree of Another Tree (Easy)

- **套路**：遍歷大樹 + 比對同構子樹
- **思路**：
  - 先寫一個 `same(a, b)`，專門判斷兩棵樹是否完全相同。
  - 接著把 `root` 的每個節點都視為可能的子樹根，檢查 `same(root, subRoot)` 是否成立。
  - 若當前節點不匹配，就繼續遞迴檢查左子樹與右子樹。
- **TC**：O(m \* n)
  - `m` 是大樹節點數、`n` 是 `subRoot` 節點數；最壞情況下大樹每個節點都要觸發一次完整比對。
- **SC**：O(h_root + h_subRoot)
  - 來自遍歷 `root` 與比對 `same()` 時的遞迴堆疊深度。
- **其他思路**：
  - **序列化 + 子字串比對**：把樹以前序加 `null` 標記序列化，再判斷 `subRoot` 的序列是否出現在 `root` 內。
- **解法比較**：
  - **直接 DFS 比對**：優點是最好理解，不需要額外字串處理。缺點是重複比對多時會慢。
  - **序列化**：優點是可轉成字串匹配問題。缺點是一定要保留空節點標記，否則不同結構可能誤判。
- **測試重點 (Testing)**：
  - **`subRoot` 真正存在**：出現在左子樹或右子樹都要能找到。
  - **值相同但結構不同**：應回傳 `False`。
  - **大樹有很多重複值**：確認不會只看值而忽略結構。
  - **`root` 比 `subRoot` 小**：應直接回傳 `False`。

```python
def isSubtree(root, subRoot):
    def same(a, b):
        if not a and not b:
            return True
        if not a or not b or a.val != b.val:
            return False
        return same(a.left, b.left) and same(a.right, b.right)

        if not subRoot:
                return True
    if not root:
        return False
    return same(root, subRoot) or isSubtree(root.left, subRoot) or isSubtree(root.right, subRoot)
```

### 543. Diameter of Binary Tree (Easy)

- **套路**：後序遍歷回傳高度
- **思路**：
  - 直徑定義為任兩節點間最長路徑的邊數，而一條最佳路徑可能剛好穿過某個節點。
  - 對每個節點來說，若路徑穿過它，長度就是 `left_height + right_height`。
  - 因此 DFS 回傳高度時，同步用這個節點更新全域最大直徑即可。
- **TC**：O(n)
  - 每個節點只做一次後序處理，計算左右高度與更新答案都是 O(1)。
- **SC**：O(h)
  - 額外空間主要是遞迴堆疊，深度為樹高 `h`。
- **其他思路**：
  - **暴力法**：對每個節點都重新計算左右子樹高度，再更新直徑，寫法直觀但會重複算很多次高度。
- **解法比較**：
  - **單次後序 DFS**：優點是標準最優解，時間 O(n)。缺點是要理解「回傳高度，但更新直徑」這個雙任務。
  - **暴力法**：優點是容易想到。缺點是會退化成 O(n^2)。
- **測試重點 (Testing)**：
  - **單一節點**：直徑應為 `0`。
  - **直線樹**：答案等於節點數減 1。
  - **平衡樹**：最佳路徑常穿過根節點。
  - **最佳路徑不經根**：確認全域答案不是只看根。

```python
def diameterOfBinaryTree(root):
        diameter = 0

        def dfs(node):
                nonlocal diameter
                if not node:
                        return 0

                left = dfs(node.left)
                right = dfs(node.right)
                diameter = max(diameter, left + right)
                return 1 + max(left, right)

        dfs(root)
        return diameter
```

### 110. Balanced Binary Tree (Easy)

- **套路**：後序遍歷 + `-1` 哨兵
- **思路**：
  - 判斷平衡需要先知道左右子樹高度，所以最自然的是後序遍歷。
  - 若某個子樹已經失衡，就直接回傳 `-1`，讓上層知道這整支不必再細算。
  - 只有當左右子樹都平衡，且高度差不超過 1 時，才回傳實際高度。
- **TC**：O(n)
  - 每個節點只會被計算高度一次，沒有重複掃描子樹。
- **SC**：O(h)
  - 額外空間來自遞迴堆疊，深度為樹高 `h`。
- **其他思路**：
  - **Top-down**：對每個節點分別計算左右子樹高度，再遞迴判斷左右子樹是否平衡。
- **解法比較**：
  - **後序 + 哨兵**：優點是一次 DFS 就能完成，時間最優。缺點是 `-1` 哨兵技巧需要先想通。
  - **Top-down**：優點是概念直接。缺點是高度會被重複計算，最壞 O(n^2)。
- **測試重點 (Testing)**：
  - **空樹**：應回傳 `True`。
  - **完全平衡樹**：應回傳 `True`。
  - **高度差剛好為 2**：應回傳 `False`。
  - **局部深層失衡**：根節點附近看起來平衡，但深層某支已失衡。

```python
def isBalanced(root):
        def height(node):
                if not node:
                        return 0

                left = height(node.left)
                right = height(node.right)

                if left == -1 or right == -1 or abs(left - right) > 1:
                        return -1
                return 1 + max(left, right)

        return height(root) != -1
```

### 108. Convert Sorted Array to Binary Search Tree (Easy)

- **套路**：分治取中點建樹
- **思路**：
  - 有序陣列若想建出高度平衡 BST，最自然的根節點就是中間值。
  - 中點左邊元素都比根小，遞迴建成左子樹；中點右邊元素都比根大，遞迴建成右子樹。
  - 只要每層都選中點，整棵樹就能盡量保持平衡。
- **TC**：O(n)
  - 每個陣列元素都只會被選成節點一次，總共建立 `n` 個節點。
- **SC**：O(log n)
  - 不計輸出樹本身時，額外空間主要是遞迴堆疊，平衡情況下深度約為 `log n`。
- **其他思路**：
  - **切片遞迴**：直接對 `nums[:mid]` 與 `nums[mid+1:]` 遞迴，寫法簡單，但會多出切片成本。
- **解法比較**：
  - **索引分治**：優點是時間與空間都更乾淨，不會重複複製陣列。缺點是要多管理左右邊界。
  - **切片遞迴**：優點是程式短。缺點是切片會造成額外 O(n) 級別的複製成本。
- **測試重點 (Testing)**：
  - **奇數長度陣列**：根節點唯一明確。
  - **偶數長度陣列**：中點選法不同也可接受，但樹必須平衡。
  - **只有一個元素**：應形成單一節點。
  - **空陣列**：應回傳 `None`。

```python
def sortedArrayToBST(nums):
        def build(left, right):
                if left > right:
                        return None

                mid = (left + right) // 2
                root = TreeNode(nums[mid])
                root.left = build(left, mid - 1)
                root.right = build(mid + 1, right)
                return root

        return build(0, len(nums) - 1)
```

### 102. Binary Tree Level Order Traversal (Med.)

- **套路**：BFS 層序遍歷
- **思路**：
  - queue 裡保存目前待處理的節點，每次先記下當層節點數 `level_size`。
  - 之後只彈出這 `level_size` 個節點，就能保證我們處理的是同一層。
  - 收完一層後，把左右子節點放進 queue，交給下一輪處理。
- **TC**：O(n)
  - 每個節點只會進 queue 一次、出 queue 一次。
- **SC**：O(n)
  - 最壞情況下 queue 可能同時保存某一整層的所有節點。
- **其他思路**：
  - **DFS + depth 參數**：遞迴時把當前深度一起傳下去，若 `result[depth]` 不存在就先建立。
- **解法比較**：
  - **BFS**：優點是題意完全對應「一層一層走」。缺點是需要 queue。
  - **DFS + depth**：優點是不用顯式 queue。缺點是對初學者來說不如 BFS 直觀。
- **測試重點 (Testing)**：
  - **空樹**：應回傳 `[]`。
  - **單一節點**：應回傳 `[[root.val]]`。
  - **多層完整樹**：確認每層分組正確。
  - **不平衡樹**：某些層只有左或右子節點時仍要正確分層。

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
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        result.append(level)
    return result
```

### 103. Binary Tree Zigzag Level Order Traversal (Med.)

- **套路**：BFS + 奇偶層改變加入方向
- **思路**：
  - 主體仍是 level order，只是偶數層從左到右收，奇數層從右到左收。
  - 若直接在每層最後做 `reverse()` 也行，但用 `deque` 可以在收集當層時就決定要 `append` 還是 `appendleft`。
  - 每處理完一層，就切換 `left_to_right` 狀態。
- **TC**：O(n)
  - 每個節點只被訪問一次，加入 `deque` 也是 O(1)。
- **SC**：O(n)
  - queue 與當層結果在最壞情況下都可能保存 O(n) 個節點。
- **其他思路**：
  - **DFS + depth**：根據深度奇偶，把節點值加到對應層的尾端或前端。
- **解法比較**：
  - **BFS**：優點是和 level order 幾乎同模板，最容易從前一題延伸。缺點是要多維護方向旗標。
  - **DFS + depth**：優點是遞迴寫法也很漂亮。缺點是沒有 BFS 那麼貼近層序語意。
- **測試重點 (Testing)**：
  - **單一節點**：應回傳單層結果。
  - **三層樹**：確認第二層方向會反轉。
  - **不完整樹**：左右子節點缺失時，順序仍要正確。
  - **只有左鏈 / 右鏈**：zigzag 不應影響結果正確性。

```python
from collections import deque


def zigzagLevelOrder(root):
    if not root:
        return []

    queue = deque([root])
    result = []
    left_to_right = True

    while queue:
                level = deque()
        for _ in range(len(queue)):
            node = queue.popleft()
                        if left_to_right:
                                level.append(node.val)
                        else:
                                level.appendleft(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
                result.append(list(level))
        left_to_right = not left_to_right

    return result
```

### 199. Binary Tree Right Side View (Med.)

- **套路**：BFS 每層取最後一個節點
- **思路**：
  - 從右側看一棵樹時，每一層真正可見的，就是該層最右邊的節點。
  - 用 level order 逐層掃描時，當層最後被彈出的節點就是這一層答案。
  - 所以每一層只要在 `i == level_size - 1` 時把 `node.val` 加進結果即可。
- **TC**：O(n)
  - 每個節點只會被 queue 處理一次。
- **SC**：O(n)
  - 最壞情況下 queue 會保存某一整層所有節點。
- **其他思路**：
  - **DFS 先右後左**：第一次到達某個深度時看到的節點，就是該深度的右視圖。
- **解法比較**：
  - **BFS**：優點是和題意最一致，很容易直接看出每層最後一個。缺點是要維護 queue。
  - **右優先 DFS**：優點是程式也很短。缺點是需要額外理解「每層第一次看到的節點」這個性質。
- **測試重點 (Testing)**：
  - **只有右子樹**：結果就是整條鏈。
  - **只有左子樹**：每層仍能看到唯一節點。
  - **左右混合缺節點**：確認不是單純取每層的右孩子。
  - **空樹**：應回傳 `[]`。

```python
from collections import deque


def rightSideView(root):
    if not root:
        return []

    queue = deque([root])
    result = []

    while queue:
                level_size = len(queue)
                for i in range(level_size):
            node = queue.popleft()
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
                        if i == level_size - 1:
                                result.append(node.val)

    return result
```

### 662. Maximum Width of Binary Tree (Med.)

- **套路**：BFS + 完全二元樹索引
- **思路**：
  - 題目中的寬度要把中間缺掉的空位也算進去，所以不能只看實際節點數量。
  - 做法是把節點想像成放在完全二元樹中的位置，根編號為 0，左子 `2*i`、右子 `2*i+1`。
  - 每層寬度就是 `last_index - first_index + 1`；為避免數字過大，可把每層索引都減去該層最左值做正規化。
- **TC**：O(n)
  - 每個節點只會進出 queue 一次，索引計算是 O(1)。
- **SC**：O(n)
  - queue 最壞情況下可能保存某一層的所有節點及其索引。
- **其他思路**：
  - **DFS 記錄每層最左索引**：第一次到達某深度時記下左邊界，後續節點用目前索引減它求寬度。
- **解法比較**：
  - **BFS**：優點是自然按層計算寬度。缺點是 queue 會較大。
  - **DFS**：優點是不用顯式 queue。缺點是索引與深度對應較抽象。
- **測試重點 (Testing)**：
  - **中間缺節點**：例如左右端都有點，中間為空，寬度仍要計入空位。
  - **單一節點**：答案應為 `1`。
  - **極度偏斜樹**：每層寬度都應為 `1`。
  - **深層節點很多**：確認索引正規化後不會溢位或失真。

```python
from collections import deque


def widthOfBinaryTree(root):
        if not root:
                return 0

        queue = deque([(root, 0)])
        best = 0

        while queue:
                _, first = queue[0]
                _, last = queue[-1]
                best = max(best, last - first + 1)

                for _ in range(len(queue)):
                        node, index = queue.popleft()
                        index -= first
                        if node.left:
                                queue.append((node.left, 2 * index))
                        if node.right:
                                queue.append((node.right, 2 * index + 1))

        return best
```

### 98. Validate Binary Search Tree (Med.)

- **套路**：遞迴傳上下界
- **思路**：
  - BST 的條件不是只看父子節點，而是每個節點都要落在整條祖先路徑定下的合法範圍內。
  - 走到左子樹時，上界會縮成當前節點值；走到右子樹時，下界會縮成當前節點值。
  - 只要出現 `node.val` 不在 `(low, high)` 之間，就能立即判定失敗。
- **TC**：O(n)
  - 每個節點最多檢查一次範圍是否合法。
- **SC**：O(h)
  - 主要是遞迴堆疊深度，`h` 為樹高。
- **其他思路**：
  - **中序遍歷檢查遞增**：BST 的中序結果必須是嚴格遞增序列，只要出現不遞增就失敗。
- **解法比較**：
  - **上下界 DFS**：優點是能直接表達 BST 真正限制，最不容易漏深層違規。缺點是要多帶兩個邊界。
  - **中序檢查**：優點是概念熟悉。缺點是第一次看到時不如上下界寫法那麼語意直接。
- **測試重點 (Testing)**：
  - **標準合法 BST**：應回傳 `True`。
  - **深層違規**：例如某個右子樹的節點卻小於根，應回傳 `False`。
  - **含重複值**：BST 此題要求嚴格不等，重複值應判定失敗。
  - **極值節點**：確認 `-inf / inf` 邊界不會誤傷正常值。

```python
def isValidBST(root):
        def dfs(node, low, high):
                if not node:
                        return True
                if not (low < node.val < high):
                        return False
                return dfs(node.left, low, node.val) and dfs(node.right, node.val, high)

        return dfs(root, float("-inf"), float("inf"))
```

### 230. Kth Smallest Element in a BST (Med.)

- **套路**：BST 中序遍歷
- **思路**：
  - BST 的中序遍歷順序是由小到大，所以第 `k` 個被訪問到的節點就是答案。
  - 用 iterative inorder 可以避免遞迴，並在訪問節點時計數。
  - 當 `k` 減到 0 時就可立刻返回，不必走完整棵樹。
- **TC**：O(h + k)
  - 先沿左鏈下探花 O(h)，之後最多再彈出並訪問 `k` 個節點。
- **SC**：O(h)
  - stack 最多保存從根到某節點的一條路徑，深度為樹高 `h`。
- **其他思路**：
  - **遞迴中序**：同樣按照升序訪問節點，用外部計數器在第 `k` 次命中時回傳。
- **解法比較**：
  - **迭代中序**：優點是沒有遞迴深度限制。缺點是 stack 操作對初學者稍微繞。
  - **遞迴中序**：優點是更短、更像模板。缺點是深樹時會吃遞迴堆疊。
- **測試重點 (Testing)**：
  - **`k = 1`**：應拿到最小值。
  - **`k = n`**：應拿到最大值。
  - **左偏或右偏 BST**：確認 stack 邏輯正確。
  - **一般平衡 BST**：驗證中序順序與計數一致。

```python
def kthSmallest(root, k):
        stack = []

        while True:
                while root:
                        stack.append(root)
                        root = root.left

                root = stack.pop()
                k -= 1
                if k == 0:
                        return root.val
                root = root.right
```

### 285. Inorder Successor in BST (Med.)

- **套路**：利用 BST 性質往下維護候選 successor
- **思路**：
  - 中序後繼是「比 `p` 大的最小節點」。
  - 若目前 `root.val > p.val`，那它有資格當 successor，但左邊可能還有更小且仍大於 `p` 的值，所以先記下再往左走。
  - 若 `root.val <= p.val`，代表當前節點和其左子樹都不可能是答案，直接往右走。
- **TC**：O(h)
  - 每一步都只沿 BST 的單一路徑往下走，最多走樹高 `h` 步。
- **SC**：O(1)
  - 只使用常數個指標變數，不需要額外容器。
- **其他思路**：
  - **完整中序遍歷**：把 BST 中序走完，找到 `p` 後取下一個節點。可行，但沒有用到 BST 性質。
- **解法比較**：
  - **BST 導航**：優點是時間最優、空間 O(1)。缺點是要先理解「候選人」的維護方式。
  - **完整中序**：優點是容易想到。缺點是會多走很多不必要的節點。
- **測試重點 (Testing)**：
  - **successor 在祖先節點**：不是右子樹裡，而是在往上回溯的某個祖先。
  - **successor 在右子樹**：確認仍能找到右子樹中的最左節點。
  - **`p` 是最大值**：應回傳 `None`。
  - **只有一個節點**：也應回傳 `None`。

```python
def inorderSuccessor(root, p):
        successor = None

        while root:
                if root.val > p.val:
                        successor = root
                        root = root.left
                else:
                        root = root.right

        return successor
```

### 235. Lowest Common Ancestor of a Binary Search Tree (Med.)

- **套路**：利用 BST 找分叉點
- **思路**：
  - BST 中，若 `p` 和 `q` 都比當前節點小，LCA 一定在左子樹。
  - 若兩者都比當前節點大，LCA 一定在右子樹。
  - 一旦出現一左一右，或其中一個剛好等於當前節點，這個節點就是最低共同祖先。
- **TC**：O(h)
  - 每次比較後都能確定往左或往右，只需走一條根到節點的路徑。
- **SC**：O(1)
  - 迭代解只使用固定數量指標。
- **其他思路**：
  - **記錄 root 到 `p`、`q` 的路徑**：分別找出兩條路徑後，最後一個共同節點就是 LCA。
- **解法比較**：
  - **BST 分叉點法**：優點是最簡潔，也最能利用 BST 性質。缺點是只適用於 BST。
  - **路徑法**：優點是觀念直白。缺點是要保存完整路徑，空間較多。
- **測試重點 (Testing)**：
  - **`p`、`q` 分居左右**：答案通常是某個中間祖先。
  - **一個節點是另一個祖先**：祖先本身就是答案。
  - **答案是根節點**：確認分叉判斷正確。
  - **極度偏斜 BST**：仍應沿單一路徑找到答案。

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

### 236. Lowest Common Ancestor of a Binary Tree (Med.)

- **套路**：後序遞迴回傳命中結果
- **思路**：
  - 若當前節點剛好是 `p` 或 `q`，就直接把它往上回傳。
  - 遞迴左右子樹後，若左右都回傳非空，表示 `p`、`q` 分別落在兩側，當前節點就是 LCA。
  - 若只有一邊非空，就把那一邊繼續往上傳，讓祖先節點決定答案。
- **TC**：O(n)
  - 最壞情況下需要遍歷整棵樹一次才能確認 `p` 與 `q` 的位置。
- **SC**：O(h)
  - 額外空間來自遞迴堆疊，深度為樹高 `h`。
- **其他思路**：
  - **parent map + 祖先集合**：先記錄每個節點父節點，再從 `p` 往上收祖先，最後從 `q` 往上找第一個命中的祖先。
- **解法比較**：
  - **後序 DFS**：優點是標準、漂亮，而且不需要額外 parent map。缺點是要理解回傳值代表什麼。
  - **parent map**：優點是好想像。缺點是要多用 O(n) 空間保存父指標。
- **測試重點 (Testing)**：
  - **`p`、`q` 分居左右子樹**：答案通常是某個中間祖先。
  - **一個節點是另一個祖先**：祖先應直接成為 LCA。
  - **答案在根節點**：確認左右都命中時會回傳根。
  - **答案在深層**：不是只看接近根的節點。

```python
def lowestCommonAncestor(root, p, q):
        if not root or root == p or root == q:
                return root

        left = lowestCommonAncestor(root.left, p, q)
        right = lowestCommonAncestor(root.right, p, q)

        if left and right:
                return root
        return left or right
```

### 105. Construct Binary Tree from Preorder and Inorder Traversal (Med.)

- **套路**：前序定根 + 中序切左右子樹
- **思路**：
  - 前序遍歷的第一個值一定是目前子樹的根，這讓我們能快速知道「誰是根」。
  - 在中序遍歷中找到這個根的位置後，左邊區間就是左子樹，右邊區間就是右子樹。
  - 若用索引邊界而不是切片遞迴，就能避免重複複製陣列。
- **TC**：O(n)
  - 每個節點只會被建立一次，且 `index_map` 讓根在中序的位置查詢變成 O(1)。
- **SC**：O(n)
  - `index_map` 需要 O(n)；另外遞迴堆疊最壞可達 O(n)。
- **其他思路**：
  - **切片遞迴**：每次直接用 `preorder[1:...]` 和 `inorder[:mid]` 遞迴，寫法直觀但會有額外切片成本。
- **解法比較**：
  - **索引 + hash map**：優點是標準最優解，時間 O(n)。缺點是要管理多個邊界與外部索引。
  - **切片遞迴**：優點是容易理解。缺點是效能較差，資料一大容易退化。
- **測試重點 (Testing)**：
  - **單一節點**：最小非空案例。
  - **左右子樹都存在**：確認左右區間切分正確。
  - **極度偏斜樹**：例如全左鏈或全右鏈，驗證遞迴邊界。
  - **空輸入**：`preorder = [], inorder = []`，應回傳 `None`。

```python
def buildTree(preorder, inorder):
        index_map = {value: i for i, value in enumerate(inorder)}
        preorder_index = 0

        def build(left, right):
                nonlocal preorder_index
                if left > right:
                        return None

                root_val = preorder[preorder_index]
                preorder_index += 1

                root = TreeNode(root_val)
                mid = index_map[root_val]
                root.left = build(left, mid - 1)
                root.right = build(mid + 1, right)
                return root

        return build(0, len(inorder) - 1)
```

### 113. Path Sum II (Med.)

- **套路**：DFS 路徑累積 + 回溯
- **思路**：
  - 從根往下走時，把當前節點值加進 `path`，並同步維護剩餘目標值 `remain`。
  - 只有當前節點是葉節點，且 `remain == node.val` 時，這條從根到葉的路徑才是合法答案。
  - 回到上一層前一定要 `pop()`，否則路徑內容會污染兄弟分支。
- **TC**：O(n \* h)
  - DFS 本體會訪問每個節點一次，但每次找到合法路徑時都要複製長度最多為 `h` 的 `path`；最壞偏斜樹下可視為 O(n^2)。
- **SC**：O(h)
  - `path` 與遞迴深度都最多等於樹高 `h`，不計輸出答案本身。
- **其他思路**：
  - **BFS 保存 path 與累積和**：queue 中同時存節點、目前和、目前路徑，也能逐層找所有合法根到葉路徑。
- **解法比較**：
  - **DFS 回溯**：優點是最標準，空間也通常較乾淨。缺點是要注意 `path.pop()` 與複製時機。
  - **BFS**：優點是不用遞迴。缺點是 queue 內若直接存完整路徑，空間通常更大。
- **測試重點 (Testing)**：
  - **多條合法路徑**：確認不會漏掉其中任何一條。
  - **完全無解**：應回傳空陣列。
  - **單一路徑樹**：確認路徑回溯邏輯正確。
  - **含負數節點**：不能用單純「大於 target 就剪枝」的思路。

```python
def pathSum(root, targetSum):
        result = []

        def dfs(node, remain, path):
                if not node:
                        return

                path.append(node.val)

                if not node.left and not node.right and remain == node.val:
                        result.append(path[:])

                dfs(node.left, remain - node.val, path)
                dfs(node.right, remain - node.val, path)
                path.pop()

        dfs(root, targetSum, [])
        return result
```

### 437. Path Sum III (Med.)

- **套路**：樹上前綴和
- **思路**：
  - 把「從根走到目前節點的和」記成 `prefix`。
  - 若之前曾出現過某個前綴和 `prefix - targetSum`，代表從那個位置的下一個節點走到現在，剛好形成和為 `targetSum` 的向下路徑。
  - DFS 離開當前節點時，要把它對應的前綴和次數扣回去，避免影響到其他分支。
- **TC**：O(n)
  - 每個節點都只做一次前綴和查詢、更新與回溯，字典操作平均為 O(1)。
- **SC**：O(n)
  - 最壞情況下前綴和字典與遞迴堆疊都可能達到 O(n)。
- **其他思路**：
  - **從每個節點重新往下 DFS**：把每個節點都當起點，累加所有往下路徑。概念簡單，但會重複計算很多次。
- **解法比較**：
  - **前綴和**：優點是最優解，能處理路徑不從根開始的情況。缺點是對初學者較抽象。
  - **逐點暴力 DFS**：優點是容易想到。缺點是最壞會退化成 O(n^2)。
- **測試重點 (Testing)**：
  - **路徑不從根開始**：這是本題和 `Path Sum II` 最大差別。
  - **路徑不一定到葉節點**：中途結束也可能是答案。
  - **含負數與 0**：前綴和可能重複出現，需正確統計次數。
  - **多條不同起點路徑命中同一 target**：確認不會漏算。

```python
def pathSum(root, targetSum):
        prefix_count = {0: 1}

        def dfs(node, prefix):
                if not node:
                        return 0

                prefix += node.val
                count = prefix_count.get(prefix - targetSum, 0)

                prefix_count[prefix] = prefix_count.get(prefix, 0) + 1
                count += dfs(node.left, prefix)
                count += dfs(node.right, prefix)
                prefix_count[prefix] -= 1

                return count

        return dfs(root, 0)
```

### 124. Binary Tree Maximum Path Sum (Hard)

- **套路**：後序遍歷回傳單邊最大貢獻
- **思路**：
  - 對父節點來說，一條可往上延伸的路徑最多只能選左邊或右邊其中一支，所以 DFS 要回傳的是「單邊最大貢獻」。
  - 但對當前節點本身來說，最佳答案可能是 `left + node + right`，因此更新全域最大值時可以同時吃左右兩邊。
  - 若某邊貢獻為負，直接視為 0 比較好，代表那支子樹不值得接上來。
- **TC**：O(n)
  - 每個節點只做一次後序處理，包含常數次比較與加法。
- **SC**：O(h)
  - 額外空間來自遞迴堆疊，深度為樹高 `h`。
- **其他思路**：
  - **暴力枚舉路徑**：把樹視為無向圖，枚舉節點對並計算路徑和。概念上可行，但大量重複計算，效率非常差。
- **解法比較**：
  - **後序 DP**：優點是標準最優解，也是面試預期寫法。缺點是要分清楚「回傳值」與「全域答案」不是同一件事。
  - **暴力法**：優點是概念直接。缺點是幾乎不可用，時間太差。
- **測試重點 (Testing)**：
  - **全負數**：答案應是最大單一節點，而不是 0。
  - **最佳路徑穿過根**：確認左右兩邊能同時加進全域答案。
  - **最佳路徑不穿過根**：確認 DFS 不會只盯著根節點。
  - **只有單一節點**：應直接回傳該節點值。

```python
def maxPathSum(root):
        best = float("-inf")

        def dfs(node):
                nonlocal best
                if not node:
                        return 0

                left = max(dfs(node.left), 0)
                right = max(dfs(node.right), 0)

                best = max(best, node.val + left + right)
                return node.val + max(left, right)

        dfs(root)
        return best
```

### 863. All Nodes Distance K in Binary Tree (Med.)

- **套路**：建 `parent map` 後從 `target` 做 BFS
- **思路**：
  - 原本的樹只能往下走，但距離 `K` 可能往上再往旁邊，因此先建立每個節點的 `parent` 指標。
  - 這樣就能把樹視為無向圖，從 `target` 出發，把 `left`、`right`、`parent` 都當作鄰居做 BFS。
  - BFS 走到第 `k` 層時，那一整層的節點值就是答案。
- **TC**：O(n)
  - 建 parent map 走一遍樹，之後 BFS 最多再走一遍節點。
- **SC**：O(n)
  - `parent` 字典、visited 集合與 queue 在最壞情況下都可能達到 O(n)。
- **其他思路**：
  - **純 DFS 距離回傳法**：遞迴找出 target，往上回傳距離，並在另一側子樹中收集對應深度的節點。
- **解法比較**：
  - **parent map + BFS**：優點是思路最清楚，把問題直接變成圖的距離問題。缺點是要多存一份 parent map。
  - **純 DFS**：優點是不用額外 parent map。缺點是推導較難，面試時比較容易寫錯。
- **測試重點 (Testing)**：
  - **`k = 0`**：答案應只有 `target` 本身。
  - **`target` 在根節點**：只需要往下擴展。
  - **`target` 在葉節點**：答案可能要先往上再往其他分支走。
  - **`k` 大於樹高**：應回傳空陣列。

```python
from collections import deque


def distanceK(root, target, k):
        if not root:
                return []

    parent = {}

    def build(node, par):
        if not node:
            return
        parent[node] = par
        build(node.left, node)
        build(node.right, node)

    build(root, None)
    queue = deque([(target, 0)])
    visited = {target}

    while queue:
        node, dist = queue.popleft()
        if dist == k:
            return [node.val] + [n.val for n, d in queue if d == k]

        for neighbor in (node.left, node.right, parent[node]):
            if neighbor and neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, dist + 1))

    return []
```

### 297. Serialize and Deserialize Binary Tree (Hard)

- **套路**：前序遍歷 + 空節點標記
- **思路**：
  - 若序列化時只記錄存在的節點值，會失去樹的結構，因此空節點也必須寫成特殊標記，例如 `#`。
  - `serialize` 用前序遍歷輸出 `root,left,right`；`deserialize` 再以相同順序讀回去，就能唯一重建原樹。
  - 關鍵是「序列化順序」與「反序列化讀取順序」必須完全一致。
- **TC**：O(n)
  - 序列化與反序列化都會把每個真實節點和每個空指標位置處理一次，整體仍與節點數同階。
- **SC**：O(n)
  - 需要保存序列化結果，反序列化時也要有遞迴堆疊與拆分後的值序列。
- **其他思路**：
  - **BFS 層序序列化**：像 LeetCode 陣列表示法一樣按層輸出，也能透過 `null` 還原樹。
- **解法比較**：
  - **前序 + `#`**：優點是遞迴寫法很自然。缺點是要理解為什麼空節點標記不可省略。
  - **BFS 層序**：優點是輸出格式對很多人更熟悉。缺點是實作時 queue 邏輯較長。
- **測試重點 (Testing)**：
  - **空樹**：序列化後再反序列化，應仍是空樹。
  - **非平衡樹**：確認 `#` 能保留缺節點位置。
  - **含負數值**：字串解析不應出錯。
  - **只有單一節點**：最小非空案例也要可逆。

```python
class Codec:
    def serialize(self, root):
        values = []

        def dfs(node):
            if not node:
                values.append("#")
                return
            values.append(str(node.val))
            dfs(node.left)
            dfs(node.right)

        dfs(root)
        return ",".join(values)

    def deserialize(self, data):
        values = iter(data.split(","))

        def dfs():
            value = next(values)
            if value == "#":
                return None
            node = TreeNode(int(value))
            node.left = dfs()
            node.right = dfs()
            return node

        return dfs()
```

### 310. Minimum Height Trees (Med.)

- **套路**：拓樸式剝葉子
- **思路**：
  - 一棵樹的最小高度根，其實就是整棵樹的中心點，中心可能有 1 個或 2 個。
  - 從所有葉節點開始，一圈一圈往內剝，等價於從外層往中心收縮。
  - 當剩餘節點數不超過 2 時，剩下的點就是所有可能的 MHT roots。
- **TC**：O(n)
  - 每個節點最多入隊出隊一次，每條邊也只會被移除一次。
- **SC**：O(n)
  - 鄰接表、度數資訊與 leaves queue 都需要 O(n) 空間。
- **其他思路**：
  - **樹的直徑中心**：先找直徑兩端，再取直徑路徑的中點 / 中間兩點作為答案。
- **解法比較**：
  - **剝葉子**：優點是最標準，也最容易在無向圖模型下實作。缺點是要先想到中心而不是高度本身。
  - **直徑中心**：優點是數學觀點漂亮。缺點是要多做幾次 BFS / DFS 並重建直徑路徑。
- **測試重點 (Testing)**：
  - **`n = 1`**：應回傳 `[0]`。
  - **星狀圖**：中心應是唯一答案。
  - **鏈狀圖**：長度奇偶不同時，答案可能有 1 個或 2 個中心。
  - **一般樹**：確認多輪剝葉後能留下正確中心。

```python
from collections import deque


def findMinHeightTrees(n, edges):
    if n == 1:
        return [0]

    graph = [set() for _ in range(n)]
    for a, b in edges:
        graph[a].add(b)
        graph[b].add(a)

    leaves = deque(node for node in range(n) if len(graph[node]) == 1)
    remaining = n

    while remaining > 2:
        for _ in range(len(leaves)):
            leaf = leaves.popleft()
            remaining -= 1
            neighbor = graph[leaf].pop()
            graph[neighbor].remove(leaf)
            if len(graph[neighbor]) == 1:
                leaves.append(neighbor)

    return list(leaves)
```
