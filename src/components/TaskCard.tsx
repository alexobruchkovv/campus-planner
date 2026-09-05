import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { Task } from '../types/task';

interface TaskCardProps {
  task: Task;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
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

export default function TaskCard({ task, onToggleStatus, onDelete }: TaskCardProps) {
  return (
    <View style={[styles.card, task.isCompleted && styles.cardCompleted]}>
      <View style={styles.info}>
        <Text
          style={[
            styles.title,
            task.isCompleted && styles.titleCompleted,
          ]}
        >
          {task.title}
        </Text>
        <Text style={styles.subject}>{task.subject}</Text>
        <View style={styles.row}>
          <View
            style={[
              styles.priorityBadge,
              { backgroundColor: priorityColors[task.priority] },
            ]}
          >
            <Text style={styles.priorityText}>
              {priorityLabels[task.priority]}
            </Text>
          </View>
          <Text style={styles.status}>
            {task.isCompleted ? 'Выполнено' : 'В процессе'}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Switch value={task.isCompleted} onValueChange={() => onToggleStatus(task.id)} />
        <TouchableOpacity onPress={() => onDelete(task.id)} style={styles.deleteButton}>
          <Text style={styles.deleteText}>Удалить</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginVertical: 6,
    marginHorizontal: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardCompleted: {
    opacity: 0.55,
  },
  info: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
  },
  subject: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 8,
  },
  priorityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  status: {
    fontSize: 12,
    color: '#444',
  },
  actions: {
    alignItems: 'center',
    gap: 8,
  },
  deleteButton: {
    marginTop: 6,
  },
  deleteText: {
    color: '#f44336',
    fontSize: 12,
    fontWeight: '600',
  },
});