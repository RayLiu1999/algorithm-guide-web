import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../../App';
import { describe, it, expect } from 'vitest';

describe('App', () => {
  it('renders headline', () => {
    render(
      // App 內部使用了 <Routes>，測試時需要以 MemoryRouter 包裝提供路由 context
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    const headline = screen.getByText(/AlgorithmGuide/i);
    expect(headline).toBeInTheDocument();
  });

  it('renders DashboardPage at root path', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    // 首頁應渲染 DashboardPage 的內容
    expect(screen.getByText(/Algorithm Mastery/i)).toBeInTheDocument();
  });
});
