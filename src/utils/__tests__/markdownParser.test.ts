import { describe, it, expect } from 'vitest';
import { parseMarkdownToFlashcards } from '../markdownParser';

// Mock 資料格式對應最新筆記格式（含 TC、SC、其他思路、解法比較、測試重點）
const mockMarkdown = `
# 一、Array & Hashing（陣列與雜湊表）

## 通用套路
這是一段廢話，應該被忽略。

---

### 1. Two Sum (Easy)

- **套路**：Hash Map 反查
- **解說**：這就像你想找兩張拼圖湊成完整的圖案。
- **思路**：遍歷陣列，用 Hash Map 記錄每個數字的索引。
- **TC**：O(n)
  - 只需遍歷一次陣列，每次查詢 Hash Map 為 O(1)。
- **SC**：O(n)
  - 最多存 n 個元素到 Hash Map。
- **其他思路**：
  - 暴力法：兩層迴圈，TC: O(n²), SC: O(1)
- **解法比較**：
  - Hash Map:
    - 優點：TC O(n)，效率高。
    - 缺點：需要額外 O(n) 空間。
- **測試重點 (Testing)**：
  - **基本案例**：target 存在於陣列中。
  - **無解**：陣列中沒有符合的組合。

\`\`\`python
def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        if target - num in seen:
            return [seen[target - num], i]
        seen[num] = i
\`\`\`

### 70. Product of Array Except Self (Med.)

- **套路**：前綴積 + 後綴積
- **思路**：沒有解說時，這個思路應該要被當成解說。
- **TC**：O(n)
  - 兩次線性遍歷。
- **SC**：O(1)
  - 輸出陣列不計入額外空間。
- **測試重點 (Testing)**：
  - **含零**：陣列中有一個或多個零時的邊界處理。

\`\`\`python
def productExceptSelf(nums):
    pass
\`\`\`

### 33. First Missing Positive (Hard)

- **TC**：O(n)
- **SC**：O(1)
`;

describe('parseMarkdownToFlashcards', () => {
  it('能正確解析並排除檔頭', () => {
    const cards = parseMarkdownToFlashcards(mockMarkdown);
    expect(cards.length).toBe(3);
  });

  it('能正確解析題號、標題與難度', () => {
    const cards = parseMarkdownToFlashcards(mockMarkdown);
    expect(cards[0].id).toBe('1');
    expect(cards[0].title).toBe('Two Sum');
    expect(cards[0].difficulty).toBe('Easy');

    expect(cards[1].id).toBe('70');
    expect(cards[1].title).toBe('Product of Array Except Self');
    expect(cards[1].difficulty).toBe('Medium'); // Med. 會被轉換成 Medium

    expect(cards[2].id).toBe('33');
    expect(cards[2].title).toBe('First Missing Positive');
    expect(cards[2].difficulty).toBe('Hard');
  });

  it('能正確提取解說或思路當作 explanation', () => {
    const cards = parseMarkdownToFlashcards(mockMarkdown);
    // 有 解說 時優先提取 解說
    expect(cards[0].explanation).toBe('這就像你想找兩張拼圖湊成完整的圖案。');
    // 沒有 解說 時，fallback 到 思路
    expect(cards[1].explanation).toBe('沒有解說時，這個思路應該要被當成解說。');
    // 兩者都沒有時，回傳預設值
    expect(cards[2].explanation).toBe('請參考下方程式碼解答。');
  });

  it('explanation 不應包含 TC/SC 子說明等其他 bullet 內容', () => {
    const cards = parseMarkdownToFlashcards(mockMarkdown);
    // explanation 只應是 解說/思路 這一個 bullet 的內容，不含 TC、SC 等
    expect(cards[0].explanation).not.toContain('O(n)');
    expect(cards[0].explanation).not.toContain('TC');
  });

  it('整段內文當作 solution，包含所有新格式欄位', () => {
    const cards = parseMarkdownToFlashcards(mockMarkdown);
    // 基本欄位
    expect(cards[0].solution).toContain('- **套路**：Hash Map 反查');
    expect(cards[0].solution).toContain('def twoSum');
    // 新格式欄位：TC、SC、其他思路、解法比較、測試重點
    expect(cards[0].solution).toContain('- **TC**：O(n)');
    expect(cards[0].solution).toContain('- **SC**：O(n)');
    expect(cards[0].solution).toContain('- **其他思路**');
    expect(cards[0].solution).toContain('- **解法比較**');
    expect(cards[0].solution).toContain('- **測試重點 (Testing)**');
    // TC 子說明（縮排項目）也應包含在 solution 中
    expect(cards[0].solution).toContain('只需遍歷一次陣列');
  });

  it('solution 包含多段程式碼區塊（如同時有 DFS 和 BFS 解法）', () => {
    const multiSolutionMarkdown = `
### 133. Clone Graph (Med.)

- **套路**：DFS/BFS + Hash Map

\`\`\`python
# DFS
def cloneGraph(node):
    pass

# BFS
def cloneGraph(node):
    pass
\`\`\`
`;
    const cards = parseMarkdownToFlashcards(multiSolutionMarkdown);
    expect(cards.length).toBe(1);
    expect(cards[0].solution).toContain('# DFS');
    expect(cards[0].solution).toContain('# BFS');
  });
});
