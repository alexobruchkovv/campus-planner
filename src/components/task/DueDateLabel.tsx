import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { fontSize } from '../../theme/spacing';
import { Task } from '../../types/task';
import { formatDateString } from '../../utils/date';
import { isTaskOverdue } from '../../utils/task';

/** Срок сдачи; просроченная задача подсвечивается. Без срока ничего не выводит. */
export default function DueDateLabel({ task }: { task: Pick<Task, 'status' | 'dueDate'> }) {
  const { colors } = useTheme();
  if (!task.dueDate) return null;

  const overdue = isTaskOverdue(task);
  return (
    <Text style={[styles.text, { color: overdue ? colors.danger : colors.subtitle }, overdue && styles.overdue]}>
      Срок: {formatDateString(task.dueDate)}
      {overdue ? ' · просрочено' : ''}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: { fontSize: fontSize.caption + 1 },
  overdue: { fontWeight: '600' },
});
