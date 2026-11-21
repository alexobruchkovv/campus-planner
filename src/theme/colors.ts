import { TaskPriority } from '../types/task';

export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  background: string;
  card: string;
  text: string;
  subtitle: string;
  border: string;
  primary: string;
  onPrimary: string;
  secondary: string;
  danger: string;
  onAccent: string;
  success: string;
  /** Мягкий фон карточки выполненной задачи. */
  successSoft: string;
  warning: string;
}

const light: ThemeColors = {
  background: '#f2f2f2',
  card: '#ffffff',
  text: '#222222',
  subtitle: '#666666',
  border: '#dddddd',
  primary: '#2196f3',
  onPrimary: '#ffffff',
  secondary: '#e4e6eb',
  danger: '#e53935',
  onAccent: '#ffffff',
  success: '#43a047',
  successSoft: '#edf7ee',
  warning: '#fb8c00',
};

const dark: ThemeColors = {
  background: '#121212',
  card: '#1e1e1e',
  text: '#f0f0f0',
  subtitle: '#aaaaaa',
  border: '#333333',
  primary: '#64b5f6',
  onPrimary: '#0d1b2a',
  secondary: '#2c2c2c',
  danger: '#ef5350',
  onAccent: '#ffffff',
  success: '#66bb6a',
  successSoft: '#1c2b1d',
  warning: '#ffa726',
};

export const palettes: Record<ThemeMode, ThemeColors> = { light, dark };

/** Цвет метки приоритета берётся из семантических цветов текущей темы. */
export function getPriorityColor(colors: ThemeColors, priority: TaskPriority): string {
  const map: Record<TaskPriority, string> = {
    low: colors.success,
    medium: colors.warning,
    high: colors.danger,
  };
  return map[priority];
}
