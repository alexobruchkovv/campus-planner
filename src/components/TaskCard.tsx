import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Task } from '../types/task';
import { useTheme } from '../context/ThemeContext';

interface TaskCardProps {
  task: Task;
  onPress: (id: string) => void;
}

const priorityLabels: Record<Task['priority'], string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
};

const priorityColors: Record<Task['priority'], string> = {
  low: '#4caf50',
  medium: '#ff9800',
  high: '#f44336',
};

export default function TaskCard({ task, onPress }: TaskCardProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
        task.isCompleted && styles.cardCompleted,
      ]}
      onPress={() => onPress(task.id)}
    >
      <Text style={[styles.title, { color: colors.text }, task.isCompleted && styles.titleCompleted]}>
        {task.title}
      </Text>
      <Text style={[styles.subject, { color: colors.subtitle }]}>{task.subject}</Text>
      <TouchableOpacity
        activeOpacity={1}
        style={[styles.priorityBadge, { backgroundColor: priorityColors[task.priority] }]}
      >
        <Text style={styles.priorityText}>{priorityLabels[task.priority]}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 14,
    marginVertical: 6,
    marginHorizontal: 12,
    borderWidth: 1,
  },
  cardCompleted: { opacity: 0.55 },
  title: { fontSize: 16, fontWeight: '600' },
  titleCompleted: { textDecorationLine: 'line-through' },
  subject: { fontSize: 13, marginTop: 2, marginBottom: 6 },
  priorityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  priorityText: { color: '#fff', fontSize: 12, fontWeight: '600' },
});