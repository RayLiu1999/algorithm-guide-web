import { describe, it, expect } from 'vitest';
import { parseMarkdownToFlashcards } from '../markdownParser';

const mockMarkdown = `
# 一、Array & Hashing（陣列與雜湊表）

## 通用套路
這是一段廢話，應該被忽略。

---

### 1. Two Sum (Easy)

- **套路**：Hash Map 反查
- **💡 白話文解說**：這就像你想找兩張拼圖湊成完整的圖案。
- **思路**：遍歷陣列...
- **複雜度**：O(n) / O(n)

\`\`\`python
def twoSum(nums, target):
    pass
\`\`\`

### 70. Product of Array Except Self (Med.)

- **套路**：前綴積 + 後綴積
- **思路**：沒有白話文解說時，這個思路應該要被當成白話文解說。
- **複雜度**：O(n) / O(1)

\`\`\`python
def productExceptSelf(nums):
    pass
\`\`\`

### 33. First Missing Positive (Hard)

- **複雜度**：O(n) / O(1)
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

  it('能正確提取白話文解說或思路當作 explanation', () => {
    const cards = parseMarkdownToFlashcards(mockMarkdown);
    expect(cards[0].explanation).toBe('這就像你想找兩張拼圖湊成完整的圖案。');
    expect(cards[1].explanation).toBe('沒有白話文解說時，這個思路應該要被當成白話文解說。');
    expect(cards[2].explanation).toBe('請參考下方程式碼解答。'); // 沒有時提供預設值
  });

  it('整段內文當作 solution', () => {
    const cards = parseMarkdownToFlashcards(mockMarkdown);
    expect(cards[0].solution).toContain('- **套路**：Hash Map 反查');
    expect(cards[0].solution).toContain('def twoSum');
  });
});
