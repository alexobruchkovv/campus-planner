import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { palettes, ThemeColors, ThemeMode } from '../theme/colors';

export interface ThemeContextValue {
  theme: ThemeMode;
  colors: ThemeColors;
  setTheme: (theme: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const THEME_STORAGE_KEY = '@campus-planner/theme';

const isThemeMode = (value: string | null): value is ThemeMode => value === 'light' || value === 'dark';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('light');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (isMounted && isThemeMode(saved)) setThemeState(saved);
      } catch (error) {
        console.warn('Не удалось загрузить тему', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
    AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme).catch((error: unknown) => {
      console.warn('Не удалось сохранить тему', error);
    });
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, colors: palettes[theme], setTheme }),
    [theme, setTheme]
  );

  if (isLoading) {
    return (
      <View
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: palettes.light.background }}
      >
        <ActivityIndicator size="large" color={palettes.light.primary} />
      </View>
    );
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
