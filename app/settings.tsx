import React from 'react';
import { StyleSheet, Text } from 'react-native';
import Card from '../src/components/ui/Card';
import Screen from '../src/components/ui/Screen';
import SegmentedControl, { SegmentOption } from '../src/components/ui/SegmentedControl';
import { useTheme } from '../src/hooks/useTheme';
import { ThemeMode } from '../src/theme/colors';
import { fontSize, spacing } from '../src/theme/spacing';

const themeOptions: SegmentOption<ThemeMode>[] = [
  { value: 'light', label: 'Светлая' },
  { value: 'dark', label: 'Тёмная' },
];

export default function SettingsScreen() {
  const { theme, setTheme, colors } = useTheme();

  return (
    <Screen>
      <Card>
        <Text style={[styles.header, { color: colors.text }]}>Тема оформления</Text>
        <SegmentedControl options={themeOptions} value={theme} onChange={setTheme} />
        <Text style={{ color: colors.subtitle }}>Тема применяется сразу и запоминается на устройстве.</Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { fontSize: fontSize.subtitle + 2, fontWeight: '700', marginBottom: spacing.sm + spacing.xs },
});
