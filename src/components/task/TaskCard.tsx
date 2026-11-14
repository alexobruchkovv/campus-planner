import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { fontSize, radius, spacing } from '../../theme/spacing';
import { Task } from '../../types/task';
import DueDateLabel from './DueDateLabel';
import PriorityBadge from './PriorityBadge';

interface TaskCardProps {
  task: Task;
  onPress: (id: string) => void;
}

export default function TaskCard({ task, onPress }: TaskCardProps) {
  const { colors } = useTheme();
  const isCompleted = task.status === 'completed';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress(task.id)}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
        isCompleted && styles.completed,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.title, { color: colors.text }, isCompleted && styles.titleCompleted]}>{task.title}</Text>
      <Text style={[styles.subject, { color: colors.subtitle }]}>{task.subject}</Text>
      <View style={styles.footer}>
        <PriorityBadge priority={task.priority} />
        <DueDateLabel task={task} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  completed: { opacity: 0.55 },
  pressed: { opacity: 0.8 },
  title: { fontSize: fontSize.subtitle, fontWeight: '600' },
  titleCompleted: { textDecorationLine: 'line-through' },
  subject: { fontSize: fontSize.caption + 1, marginTop: 2, marginBottom: spacing.sm },
  footer: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' },
});
