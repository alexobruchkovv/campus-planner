import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { fontSize, spacing } from '../../theme/spacing';
import { TaskStats } from '../../types/task';

export default function TaskStatsBar({ stats }: { stats: TaskStats }) {
  const { colors } = useTheme();
  const items = [
    { label: 'Всего', value: stats.total },
    { label: 'Активные', value: stats.active },
    { label: 'Выполнено', value: stats.completed },
  ];

  return (
    <View style={styles.row}>
      {items.map((item) => (
        <View key={item.label} style={styles.item}>
          <Text style={[styles.value, { color: colors.text }]}>{item.value}</Text>
          <Text style={[styles.label, { color: colors.subtitle }]}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: spacing.sm + spacing.xs },
  item: { alignItems: 'center' },
  value: { fontSize: fontSize.title, fontWeight: '700' },
  label: { fontSize: fontSize.caption },
});
