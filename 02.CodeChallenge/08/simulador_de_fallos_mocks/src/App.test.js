import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Pokedex', () => {
  render(<App />);
  const title = screen.getByText(/Pokedex/i);
  expect(title).toBeInTheDocument();
});
