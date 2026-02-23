import { render, screen } from '@testing-library/react';

import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import CategorySidebar from '../CategorySidebar';
import { CATEGORIES } from '../../data/index';

// 使用 MemoryRouter 包裝，因為 CategorySidebar 包含 <Link>
const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

describe('CategorySidebar', () => {
  it('渲染所有分類標題', () => {
    renderWithRouter(<CategorySidebar activeCategoryId={null} />);
    CATEGORIES.forEach((cat) => {
      expect(screen.getByText(cat.subtitle)).toBeInTheDocument();
    });
  });

  it('顯示每個分類的題數', () => {
    renderWithRouter(<CategorySidebar activeCategoryId={null} />);
    // 確認第一個分類的題數 22 有顯示
    expect(screen.getByText('22')).toBeInTheDocument();
  });

  it('當 activeCategoryId 對應的分類應有 active 高亮樣式', () => {
    renderWithRouter(<CategorySidebar activeCategoryId="array-hashing" />);
    // 取 Array & Hashing 的連結，應具有 aria-current="page" 或 active class
    const link = screen.getByRole('link', { name: /Array & Hashing/i });
    expect(link).toHaveAttribute('aria-current', 'page');
  });
});
