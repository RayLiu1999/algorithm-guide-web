import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MarkdownViewer from '../MarkdownViewer';

const MOCK_MARKDOWN = `
# 測試標題

普通段落文字。

\`\`\`python
def hello():
    return "world"
\`\`\`

- **💡 白話文解說**：這是一個非常直覺的說明，讓初學者秒懂。

- **套路**：暴力法 O(n²)
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

  it('能渲染白話文解說，並呈現特殊 callout 樣式', () => {
    render(<MarkdownViewer content={MOCK_MARKDOWN} />);
    // 白話文解說的文字應出現在畫面上
    expect(screen.getByText(/這是一個非常直覺的說明/i)).toBeInTheDocument();
  });
});
