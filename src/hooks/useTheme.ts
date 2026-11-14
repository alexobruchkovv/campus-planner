import { useContext } from 'react';
import { ThemeContext, ThemeContextValue } from '../context/ThemeContext';

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme() вызван вне <ThemeProvider>. Оберните приложение в ThemeProvider (app/_layout.tsx).');
  }
  return context;
}
