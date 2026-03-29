import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import DashboardPage from '../DashboardPage';
import { createProgressKey, useProgressStore } from '../../store/progressStore';
import { CATEGORIES } from '../../data/index';

function resetStore() {
  localStorage.removeItem('algorithm-guide-progress');
  useProgressStore.setState({
    progress: {},
    bookmarks: [],
  });
}

describe('DashboardPage', () => {
  beforeEach(resetStore);

  it('會隨著閃卡掌握狀態更新首頁達成率', async () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/達成率/)).toHaveTextContent('0%');

    const { setStatus } = useProgressStore.getState();
    act(() => {
      setStatus(createProgressKey(CATEGORIES[0].id, '1'), 'mastered');
    });

    await waitFor(() => {
      expect(screen.getByText(/達成率/)).toHaveTextContent('1%');
    });

    const firstCategory = screen.getAllByRole('link', { name: /Array & Hashing/i })[1];
    expect(firstCategory).toHaveTextContent(/已掌握\s*1\s*題/);
    expect(firstCategory).toHaveTextContent('4%');
  });

  it('不同分類的同題號不會互相覆蓋', async () => {
    const { setStatus } = useProgressStore.getState();

    act(() => {
      setStatus(createProgressKey(CATEGORIES[0].id, '1'), 'mastered');
      setStatus(createProgressKey(CATEGORIES[1].id, '1'), 'mastered');
    });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    const firstCategory = screen.getAllByRole('link', { name: /Array & Hashing/i })[1];
    const secondCategory = screen.getAllByRole('link', { name: /Two Pointers/i })[1];

    expect(firstCategory).toHaveTextContent('4%');
    expect(secondCategory).toHaveTextContent('11%');
  });
});
