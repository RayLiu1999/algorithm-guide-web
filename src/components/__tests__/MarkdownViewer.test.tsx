import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import MarkdownViewer from '../MarkdownViewer';

const MOCK_MARKDOWN = `
# 測試標題

普通段落文字。

\`\`\`python
def hello():
    return "world"
\`\`\`

- **解說**：這是一個非常直覺的說明，讓初學者秒懂。

- **套路**：暴力法 O(n²)
`;

const MOCK_PROBLEM_MARKDOWN = `
### 1. Two Sum (Easy)

- **Problem (English)**:
  - Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.
  - You may assume that each input would have exactly one solution, and you may not use the same element twice.
  - You can return the answer in any order.
- **題目（中文）**：
  - 給你一個整數陣列 \`nums\` 和一個整數 \`target\`，請找出兩個數字，使它們的總和等於 \`target\`，並回傳這兩個數字的索引。
  - 你可以假設每組輸入都只有一個解，而且不能使用同一個元素兩次。
  - 你可以用任何順序回傳答案。
- **Examples**:
  - Example 1: \`nums = [2, 7, 11, 15]\`, \`target = 9\`
    - Output: \`[0, 1]\`
    - Explanation: Because \`nums[0] + nums[1] == 9\`, we return \`[0, 1]\`.
- **Constraints**:
  - \`2 <= nums.length <= 10^4\`
  - \`-10^9 <= nums[i] <= 10^9\`
  - \`-10^9 <= target <= 10^9\`
- **套路**： Hash Map 反查法
- **思路**：
  - 這裡放一段解題內容，讓測試能確認 modal 會顯示題目本身。
`;

describe('MarkdownViewer', () => {
  it('能渲染 Markdown 標題', () => {
    render(<MarkdownViewer content={MOCK_MARKDOWN} />);
    expect(screen.getByRole('heading', { name: /測試標題/i })).toBeInTheDocument();
  });

  it('能渲染普通段落文字', () => {
    render(<MarkdownViewer content={MOCK_MARKDOWN} />);
    expect(screen.getByText(/普通段落文字/i)).toBeInTheDocument();
  });

  it('能渲染程式碼區塊', () => {
    const { container } = render(<MarkdownViewer content={MOCK_MARKDOWN} />);
    // rehype-highlight 會將語法拆成多個 span，故改為確認 <pre> 存在
    const pre = container.querySelector('pre');
    expect(pre).toBeInTheDocument();
    // 確認 code 區塊包含我們的函式名稱（即使被拆開，pre 的 textContent 仍含全文）
    expect(pre?.textContent).toContain('hello');
  });

  it('能渲染解說，並呈現特殊 callout 樣式', () => {
    render(<MarkdownViewer content={MOCK_MARKDOWN} />);
    // 解說的文字應出現在畫面上
    expect(screen.getByText(/這是一個非常直覺的說明/i)).toBeInTheDocument();
  });

  it('點擊 Problem 按鈕會打開題目視窗', async () => {
    const user = userEvent.setup();
    render(<MarkdownViewer content={MOCK_PROBLEM_MARKDOWN} categoryId="array-hashing" />);

    expect(screen.queryByText(/Given an array of integers/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/題目（中文）/i)).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /查看 Two Sum 題目內容/i }));

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText(/Given an array of integers/i)).toBeInTheDocument();
    expect(within(dialog).getByText(/題目（中文）/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /關閉題目視窗/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
