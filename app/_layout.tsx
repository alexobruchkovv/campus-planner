import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '../src/context/ThemeContext';
import { TasksProvider } from '../src/context/TasksContext';

function RootLayoutNav() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Задачи' }} />
      <Stack.Screen name="task/new" options={{ title: 'Новая задача' }} />
      <Stack.Screen name="task/[id]" options={{ title: 'Детали задачи' }} />
      <Stack.Screen name="task/edit/[id]" options={{ title: 'Редактирование' }} />
      <Stack.Screen name="settings" options={{ title: 'Настройки' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <TasksProvider>
          <RootLayoutNav />
        </TasksProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}