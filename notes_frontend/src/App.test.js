import { render, screen } from '@testing-library/react';
import App from './App';

// PUBLIC_INTERFACE
// Basic smoke test to ensure the app renders without relying on Supabase state.
test('renders app without crashing (shows either Sign in or main layout)', () => {
  render(<App />);
  const signIn = screen.queryByText(/Sign in/i);
  const appLayout = document.querySelector('.app');
  expect(signIn || appLayout).toBeTruthy();
});
