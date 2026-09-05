import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTasks } from '../../src/context/TasksContext';
import { useTheme } from '../../src/context/ThemeContext';

const priorityLabels = { low: 'Низкий', medium: 'Средний', high: 'Высокий' } as const;

export default function TaskDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getTaskById, toggleStatus } = useTasks();
  const { colors } = useTheme();

  const task = getTaskById(id);

  if (!task) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text, fontSize: 16, marginBottom: 16 }}>Задача не найдена</Text>
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={() => router.replace('/')}>
          <Text style={styles.buttonText}>Вернуться к списку</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.text }]}>{task.title}</Text>
        <Text style={[styles.subject, { color: colors.subtitle }]}>{task.subject}</Text>
        <Text style={{ color: colors.subtitle, marginTop: 8 }}>Приоритет: {priorityLabels[task.priority]}</Text>
        <Text style={{ color: colors.subtitle, marginTop: 4 }}>
          Статус: {task.isCompleted ? 'Выполнено' : 'В процессе'}
        </Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary, marginTop: 16 }]}
          onPress={() => toggleStatus(task.id)}
        >
          <Text style={styles.buttonText}>
            {task.isCompleted ? 'Отметить как невыполненное' : 'Отметить как выполненное'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.border, marginTop: 10 }]}
          onPress={() => router.push({ pathname: '/task/edit/[id]', params: { id: task.id } })}
        >
          <Text style={[styles.buttonText, { color: colors.text }]}>Редактировать</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  centered: { justifyContent: 'center', alignItems: 'center' },
  card: { borderRadius: 12, padding: 16 },
  title: { fontSize: 20, fontWeight: '700' },
  subject: { fontSize: 15, marginTop: 4 },
  button: { borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
});