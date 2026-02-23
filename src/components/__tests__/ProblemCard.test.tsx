import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import ProblemCard from '../ProblemCard';
import type { ProblemStatus } from '../../data/index';

const MOCK_PROBLEM = {
  id: '1',
  title: 'Two Sum',
  difficulty: 'Easy' as const,
  status: 'not_started' as ProblemStatus,
  isBookmarked: false,
};

describe('ProblemCard', () => {
  it('顯示題目名稱與難度', () => {
    render(<ProblemCard {...MOCK_PROBLEM} onStatusChange={vi.fn()} onBookmarkToggle={vi.fn()} />);
    expect(screen.getByText(/Two Sum/i)).toBeInTheDocument();
    expect(screen.getByText(/Easy/i)).toBeInTheDocument();
  });

  it('狀態為 not_started 時顯示對應標籤', () => {
    render(<ProblemCard {...MOCK_PROBLEM} onStatusChange={vi.fn()} onBookmarkToggle={vi.fn()} />);
    expect(screen.getByText(/未開始/i)).toBeInTheDocument();
  });

  it('狀態為 mastered 時顯示對應標籤', () => {
    render(
      <ProblemCard {...MOCK_PROBLEM} status="mastered" onStatusChange={vi.fn()} onBookmarkToggle={vi.fn()} />
    );
    expect(screen.getByText(/已掌握/i)).toBeInTheDocument();
  });

  it('點擊「標示為已掌握」按鈕時觸發 onStatusChange callback', async () => {
    const onStatusChange = vi.fn();
    render(
      <ProblemCard {...MOCK_PROBLEM} onStatusChange={onStatusChange} onBookmarkToggle={vi.fn()} />
    );
    const button = screen.getByRole('button', { name: /標示為已掌握/i });
    await userEvent.click(button);
    expect(onStatusChange).toHaveBeenCalledWith('1', 'mastered');
  });

  it('點擊書籤按鈕時觸發 onBookmarkToggle callback', async () => {
    const onBookmarkToggle = vi.fn();
    render(
      <ProblemCard {...MOCK_PROBLEM} onBookmarkToggle={onBookmarkToggle} onStatusChange={vi.fn()} />
    );
    const bookmarkBtn = screen.getByRole('button', { name: /書籤/i });
    await userEvent.click(bookmarkBtn);
    expect(onBookmarkToggle).toHaveBeenCalledWith('1');
  });
});
