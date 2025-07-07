import { render, screen } from '@testing-library/react';
import App from './App';

test('renders welcome message', () => {
  render(<App />);
  const headingElement = screen.getByText(/Willkommen zur Nexo-App/i);
  expect(headingElement).toBeInTheDocument();
});
