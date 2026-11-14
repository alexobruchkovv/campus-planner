import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { getPriorityColor } from '../../theme/colors';
import { fontSize, radius, spacing } from '../../theme/spacing';
import { TaskPriority } from '../../types/task';
import { priorityLabels } from '../../utils/task';

export default function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const { colors } = useTheme();

  return (
    <View style={[styles.badge, { backgroundColor: getPriorityColor(colors, priority) }]}>
      <Text style={[styles.text, { color: colors.onAccent }]}>{priorityLabels[priority]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  text: { fontSize: fontSize.caption, fontWeight: '600' },
});
