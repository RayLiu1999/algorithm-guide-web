import { render, screen } from '@testing-library/react';
import App from '../../App';
import { describe, it, expect } from 'vitest';

describe('App', () => {
  it('renders headline', () => {
    render(<App />);
    const headline = screen.getByText(/AlgorithmGuide 教學互動網/i);
    expect(headline).toBeInTheDocument();
  });
});
