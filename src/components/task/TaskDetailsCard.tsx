import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { fontSize, spacing } from '../../theme/spacing';
import { Task } from '../../types/task';
import { formatDateString } from '../../utils/date';
import { statusLabels } from '../../utils/task';
import Card from '../ui/Card';
import DueDateLabel from './DueDateLabel';
import PriorityBadge from './PriorityBadge';

interface TaskDetailsCardProps {
  task: Task;
  /** Кнопки действий под информацией о задаче. */
  children?: React.ReactNode;
}

export default function TaskDetailsCard({ task, children }: TaskDetailsCardProps) {
  const { colors } = useTheme();

  return (
    <Card>
      <Text style={[styles.title, { color: colors.text }]}>{task.title}</Text>
      <Text style={[styles.subject, { color: colors.subtitle }]}>{task.subject}</Text>
      {task.description ? (
        <Text style={[styles.description, { color: colors.text }]}>{task.description}</Text>
      ) : null}

      <View style={styles.meta}>
        <PriorityBadge priority={task.priority} />
        <Text style={{ color: colors.subtitle }}>Статус: {statusLabels[task.status]}</Text>
        <Text style={{ color: colors.subtitle }}>Создана: {formatDateString(task.createdAt)}</Text>
        <DueDateLabel task={task} />
      </View>

      {children ? <View style={styles.actions}>{children}</View> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: fontSize.title, fontWeight: '700' },
  subject: { fontSize: fontSize.body + 1, marginTop: spacing.xs },
  description: { fontSize: fontSize.body, marginTop: spacing.sm, lineHeight: 20 },
  meta: { marginTop: spacing.sm + spacing.xs, gap: spacing.xs + 2 },
  actions: { marginTop: spacing.md, gap: spacing.sm + 2 },
});
