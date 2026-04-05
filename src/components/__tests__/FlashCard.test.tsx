import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import FlashCard from '../FlashCard';

const MOCK_PROPS = {
  title: 'Two Sum',
  difficulty: 'Easy' as const,
  explanation: '- **Problem (English)**:\n  - Given an array of integers `nums` and an integer `target`.\n  - Return the indices of the two numbers that add up to `target`.\n- **Examples**:\n  - Example 1: `nums = [2,7,11,15], target = 9`\n    - Output: `[0,1]`\n- **Constraints**:\n  - `2 <= nums.length <= 10^4`',
  solution: `# 解法\n\`\`\`python\ndef twoSum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        diff = target - n\n        if diff in seen:\n            return [seen[diff], i]\n        seen[n] = i\n\`\`\``,
  onRate: vi.fn(),
};

describe('FlashCard', () => {
  it('預設顯示題目標題與完整英文題目區塊', () => {
    render(<FlashCard {...MOCK_PROPS} />);
    expect(screen.getByText(/Two Sum/i)).toBeInTheDocument();
    expect(screen.getByText(/Problem \(English\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Given an array of integers/i)).toBeInTheDocument();
    expect(screen.getByText(/Examples/i)).toBeInTheDocument();
    expect(screen.getByText(/Constraints/i)).toBeInTheDocument();
    expect(screen.getByText(/Return the indices of the two numbers/i)).toBeInTheDocument();
  });

  it('預設隱藏解答 (程式碼)', () => {
    render(<FlashCard {...MOCK_PROPS} />);
    // 解答預設隱藏，程式碼不應出現在畫面上
    expect(screen.queryByText(/twoSum/i)).not.toBeInTheDocument();
  });

  it('有「顯示解答」按鈕', () => {
    render(<FlashCard {...MOCK_PROPS} />);
    expect(screen.getByRole('button', { name: /顯示解答/i })).toBeInTheDocument();
  });

  it('點擊「顯示解答」後解答區域出現', async () => {
    const { container } = render(<FlashCard {...MOCK_PROPS} />);
    const revealButton = screen.getByRole('button', { name: /顯示解答/i });
    await userEvent.click(revealButton);
    await screen.findByText(/Python 解法/i);
    const pre = container.querySelector('pre');
    expect(pre).toBeInTheDocument();
    expect(pre?.textContent).toContain('twoSum');
  });

  it('解答展開後，顯示「已掌握」與「還不熟」評分按鈕', async () => {
    render(<FlashCard {...MOCK_PROPS} />);
    await userEvent.click(screen.getByRole('button', { name: /顯示解答/i }));
    expect(await screen.findByRole('button', { name: /已掌握/i })).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: /還不熟/i })).toBeInTheDocument();
  });

  it('點擊「已掌握」觸發 onRate 並傳入 mastered', async () => {
    const onRate = vi.fn();
    render(<FlashCard {...MOCK_PROPS} onRate={onRate} />);
    await userEvent.click(screen.getByRole('button', { name: /顯示解答/i }));
    await userEvent.click(await screen.findByRole('button', { name: /已掌握/i }));
    expect(onRate).toHaveBeenCalledWith('mastered');
  });

  it('點擊「還不熟」觸發 onRate 並傳入 in_progress', async () => {
    const onRate = vi.fn();
    render(<FlashCard {...MOCK_PROPS} onRate={onRate} />);
    await userEvent.click(screen.getByRole('button', { name: /顯示解答/i }));
    await userEvent.click(await screen.findByRole('button', { name: /還不熟/i }));
    expect(onRate).toHaveBeenCalledWith('in_progress');
  });
});
